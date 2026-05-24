const https = require('https');

// Helper to encrypt/decrypt payloads
const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function decryptPayload(encryptedStr) {
    if (!encryptedStr || encryptedStr.length < 2) return null;
    const p1Char = encryptedStr.substring(encryptedStr.length - 1);
    const p3Char = encryptedStr.substring(encryptedStr.length - 2, encryptedStr.length - 1);
    
    const p1 = CHARSET.indexOf(p1Char);
    const p3 = CHARSET.indexOf(p3Char);
    
    if (p1 === -1 || p3 === -1) return null;
    
    const mainPart = encryptedStr.substring(0, encryptedStr.length - 2);
    const base64Str = mainPart.substring(0, p3) + mainPart.substring(p3 + p1);
    
    const jsonStr = Buffer.from(base64Str, 'base64').toString('utf-8');
    return JSON.parse(jsonStr.trim());
}

function encryptPayload(jsonObj) {
    const jsonStr = JSON.stringify(jsonObj);
    const base64 = Buffer.from(jsonStr).toString('base64');
    
    const p1 = Math.floor(Math.random() * 20); 
    const p3 = Math.floor(Math.random() * Math.min(base64.length, 42)); 
    
    let randomStr = "";
    for (let i = 0; i < p1; i++) {
        randomStr += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
    }
    
    const mainPart = base64.substring(0, p3) + randomStr + base64.substring(p3);
    const p3Char = CHARSET.charAt(p3);
    const p1Char = CHARSET.charAt(p1);
    
    return mainPart + p3Char + p1Char;
}

// Fetch document from Firestore REST API
function getFirestoreDocument(path) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'firestore.googleapis.com',
            port: 443,
            path: `/v1/projects/iptv-crm-sync/databases/(default)/documents/${path}`,
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            });
        });

        req.on('error', () => resolve(null));
        req.end();
    });
}

// Query Firestore contacts collection by MAC Address
function queryContactByMac(mac) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            structuredQuery: {
                from: [{ collectionId: "contacts" }],
                where: {
                    fieldFilter: {
                        field: { fieldPath: "mac" },
                        op: "EQUAL",
                        value: { stringValue: mac.toLowerCase().trim() }
                    }
                }
            }
        });

        const options = {
            hostname: 'firestore.googleapis.com',
            port: 443,
            path: '/v1/projects/iptv-crm-sync/databases/(default)/documents:runQuery',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const results = JSON.parse(data);
                    if (Array.isArray(results) && results.length > 0 && results[0].document) {
                        resolve(results[0].document);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        });

        req.on('error', () => resolve(null));
        req.write(postData);
        req.end();
    });
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const encryptedData = body && body.data;
        if (!encryptedData) {
            res.status(400).json({ error: "Missing encrypted data payload" });
            return;
        }

        const payload = decryptPayload(encryptedData);
        if (!payload || !payload.mac_address) {
            res.status(400).json({ error: "Invalid payload decryption or missing mac address" });
            return;
        }

        const mac = payload.mac_address.toLowerCase().trim();
        const formattedMacForDoc = mac.replace(/:/g, '-'); // doc ID safety

        // 1. Try to find playlist in `/playlists/{mac}`
        let playlistDoc = await getFirestoreDocument(`playlists/${formattedMacForDoc}`);
        let registered = false;
        let deviceKey = "";
        let expireDate = "2028-12-31";
        let isTrial = 1;
        let playlists = [];

        if (playlistDoc && playlistDoc.fields) {
            registered = true;
            const fields = playlistDoc.fields;
            deviceKey = fields.device_key && fields.device_key.stringValue || "";
            expireDate = fields.expire_date && fields.expire_date.stringValue || "2028-12-31";
            isTrial = fields.is_trial && fields.is_trial.integerValue ? parseInt(fields.is_trial.integerValue) : 1;
            
            if (fields.playlists && fields.playlists.arrayValue && fields.playlists.arrayValue.values) {
                playlists = fields.playlists.arrayValue.values.map((v, idx) => {
                    const item = v.mapValue && v.mapValue.fields;
                    return {
                        id: String(idx + 1),
                        name: item && item.name && item.name.stringValue || `Lista ${idx + 1}`,
                        url: item && item.url && item.url.stringValue || "",
                        type: "m3u",
                        is_protected: "0"
                    };
                });
            }
        } else {
            // 2. If not found, try to query contacts in `/campaigns/main/contacts`
            let contactDoc = await queryContactByMac(mac);
            if (contactDoc && contactDoc.fields) {
                registered = true;
                const fields = contactDoc.fields;
                deviceKey = fields.pass && fields.pass.stringValue || "";
                expireDate = fields.expiration && fields.expiration.stringValue || "2028-12-31";
                isTrial = 0; // standard registered clients are not trial
                
                const playlistUrl = fields.server && fields.server.stringValue || "";
                if (playlistUrl && playlistUrl !== "Nenhum") {
                    playlists.push({
                        id: "1",
                        name: "Minha Lista",
                        url: playlistUrl,
                        type: "m3u",
                        is_protected: "0"
                    });
                }
            }
        }

        const appResponse = {
            mac_registered: registered,
            mac_address: mac.toUpperCase(),
            device_key: deviceKey,
            expire_date: expireDate,
            is_trial: isTrial,
            lock: 0,
            parent_control: "0000",
            parent_synced: 0,
            pin: "0000",
            plan_id: "1",
            price: "7.9",
            subtitle_url: "",
            urls: playlists
        };

        const encryptedResponse = encryptPayload(appResponse);
        res.status(200).json({ data: encryptedResponse });

    } catch (error) {
        console.error("API error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
