/* -------------------------------------------------------------
   PLAYTV PREMIUM APPLICATION LOGIC
   Complete feature set: tab switching, playlist manager, 
   device activation, FAQ accordions, and WhatsApp redirects
   Fully integrated with Firebase Firestore 'playlists' and 'campaigns'
------------------------------------------------------------- */

// ==========================================
// CONFIGURATION SYSTEM
// ==========================================
const PLAYTV_CONFIG = {
    whatsappNumber: '5511999999999', // Custom CRM sync whatsapp phone
    companyName: 'PlayTV',
    defaultMessage: 'Olí! Baixei o PlayTV na minha TV e gostaria de realizar a ativaçío do meu teste de 7 dias.',
    activationMsg: 'Olí! Gostaria de ativar meu aplicativo PlayTV.\n\nMAC Address: {mac}\nDevice Key: {key}'
};

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. HEADER SCROLL ACTION ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. MOBILE DRAWER NAVIGATION MENU ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const drawerCloseBtn = document.querySelector('.drawer-close-btn');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.add('open');
        });
    }

    const closeDrawer = () => {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
    };
    
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // --- 3. INSTALLATION MANUAL TABS SYSTEM ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // Toggle active tabs
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle active panes
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === targetId) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // --- 4. PORTAL TABS SWITCHER (PLAYLIST VS ACTIVATION) ---
    const portalTabButtons = document.querySelectorAll('.portal-tab-btn');
    const portalPanes = document.querySelectorAll('.portal-pane');

    portalTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // Toggle buttons
            portalTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle panes
            portalPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('id') === targetId) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // --- 5. FAQ ACCORDION LOGIC ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            
            // Toggle clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- 6. AUTO-FORMAT MAC ADDRESS INPUTS ---
    const macInputs = [document.getElementById('p-mac'), document.getElementById('a-mac')];
    
    macInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                let formatted = "";
                for (let i = 0; i < value.length && i < 12; i++) {
                    if (i > 0 && i % 2 === 0) formatted += ":";
                    formatted += value[i];
                }
                e.target.value = formatted;
            });
        }
    });

    // --- 7. PLAYLISTS DATABASE DASHBOARD SYNC SYSTEM ---
    const playlistLoginForm = document.getElementById("playlist-login-form");
    const playlistActionForm = document.getElementById("playlist-action-form");
    
    const loginState = document.getElementById("playlist-login-state");
    const dashboardState = document.getElementById("playlist-dashboard-state");
    
    const loggedMacBadge = document.getElementById("logged-mac-badge");
    const playlistsContainer = document.getElementById("playlists-container");
    
    const playlistNameInput = document.getElementById("playlist-name");
    const playlistUrlInput = document.getElementById("playlist-url");
    const editIndexInput = document.getElementById("edit-index");
    
    const btnSavePlaylist = document.getElementById("btn-save-playlist");
    const btnCancelEdit = document.getElementById("btn-cancel-edit");
    const btnPlaylistLogout = document.getElementById("btn-playlist-logout");

    let activeClientMac = null;
    let activeClientKey = null;
    let currentPlaylists = [];

    // Session recovery on start
    function recoverSession() {
        const savedMac = localStorage.getItem("playtv_client_mac");
        const savedKey = localStorage.getItem("playtv_client_key");
        if (savedMac && savedKey && loginState) {
            const pMacInput = document.getElementById("p-mac");
            const pKeyInput = document.getElementById("p-key");
            if (pMacInput) pMacInput.value = savedMac;
            if (pKeyInput) pKeyInput.value = savedKey;
            loginClient(savedMac, savedKey, true);
        }
    }

    if (playlistLoginForm) {
        playlistLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const mac = document.getElementById("p-mac").value.trim().toUpperCase();
            const key = document.getElementById("p-key").value.trim();
            loginClient(mac, key, false);
        });
    }

    async function loginClient(mac, key, isAutoLogin) {
        const formattedMacDoc = mac.replace(/:/g, "-");
        
        try {
            // 1. Try querying /playlists/{mac}
            let docRef = db.collection("playlists").doc(formattedMacDoc);
            let docSnap = await docRef.get();
            
            let playlistData = null;
            
            if (docSnap.exists) {
                const data = docSnap.data();
                if (data.device_key === key) {
                    playlistData = data;
                }
            } else {
                // 2. Query campaigns/main/contacts inside CRM
                const contactsSnap = await db.collection("campaigns").doc("main").collection("contacts")
                    .where("mac", "==", mac.toUpperCase())
                    .get();
                    
                if (!contactsSnap.empty) {
                    const contactDoc = contactsSnap.docs[0];
                    const contactData = contactDoc.data();
                    
                    if (contactData.pass === key) {
                        // Onboard client into playlists Firestore collection
                        const newPlaylistDoc = {
                            mac_address: mac.toUpperCase(),
                            device_key: key,
                            expire_date: contactData.expiration || "2028-12-31",
                            is_trial: 0,
                            playlists: contactData.server && contactData.server !== "Nenhum" ? [
                                { name: "Minha Lista Principal", url: contactData.server }
                            ] : []
                        };
                        await docRef.set(newPlaylistDoc);
                        playlistData = newPlaylistDoc;
                    }
                }
            }
            
            if (playlistData) {
                // Save session in localStorage
                localStorage.setItem("playtv_client_mac", mac);
                localStorage.setItem("playtv_client_key", key);
                
                activeClientMac = mac;
                activeClientKey = key;
                currentPlaylists = playlistData.playlists || [];
                
                if (loggedMacBadge) loggedMacBadge.textContent = `MAC: ${playlistData.mac_address}`;
                
                if (loginState) loginState.classList.add("hidden");
                if (dashboardState) dashboardState.classList.remove("hidden");
                
                renderPlaylists();
            } else {
                if (!isAutoLogin) {
                    alert("Acesso negado. MAC ou Device Key incorretos.");
                } else {
                    logoutClient();
                }
            }
        } catch (err) {
            console.error("Login failure:", err);
            if (!isAutoLogin) alert("Erro ao fazer login. Verifique sua conexío.");
        }
    }

    function renderPlaylists() {
        if (!playlistsContainer) return;
        playlistsContainer.innerHTML = "";
        
        if (currentPlaylists.length === 0) {
            playlistsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-folder-open"></i>
                    <span>No Playlists Added. Insert M3U on the right form!</span>
                </div>
            `;
            return;
        }
        
        currentPlaylists.forEach((pl, idx) => {
            const item = document.createElement("div");
            item.className = "playlist-item";
            item.innerHTML = `
                <div class="playlist-info">
                    <h4>${pl.name}</h4>
                    <p>${pl.url}</p>
                </div>
                <div class="playlist-actions">
                    <button class="action-btn action-edit" data-index="${idx}"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn action-delete" data-index="${idx}"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            
            item.querySelector(".action-edit").addEventListener("click", () => editPlaylist(idx));
            item.querySelector(".action-delete").addEventListener("click", () => deletePlaylist(idx));
            
            playlistsContainer.appendChild(item);
        });
    }

    async function savePlaylistsToFirestore() {
        const formattedMacDoc = activeClientMac.replace(/:/g, "-");
        try {
            await db.collection("playlists").doc(formattedMacDoc).update({
                playlists: currentPlaylists
            });
        } catch (err) {
            console.error("Sync error:", err);
            alert("Erro de sincronizaçío. Verifique sua rede.");
        }
    }

    if (playlistActionForm) {
        playlistActionForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = playlistNameInput.value.trim();
            const url = playlistUrlInput.value.trim();
            const editIdx = parseInt(editIndexInput.value);
            
            if (editIdx === -1) {
                currentPlaylists.push({ name, url });
            } else {
                currentPlaylists[editIdx] = { name, url };
                resetForm();
            }
            
            renderPlaylists();
            await savePlaylistsToFirestore();
            playlistActionForm.reset();
        });
    }

    function editPlaylist(idx) {
        const pl = currentPlaylists[idx];
        if (playlistNameInput) playlistNameInput.value = pl.name;
        if (playlistUrlInput) playlistUrlInput.value = pl.url;
        if (editIndexInput) editIndexInput.value = idx;
        
        const titleEl = document.getElementById("playlist-form-title");
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--cyan);"></i> <span>Edit Playlist</span>`;
        if (btnSavePlaylist) btnSavePlaylist.textContent = "Save Changes";
        if (btnCancelEdit) btnCancelEdit.classList.remove("hidden");
        if (playlistNameInput) playlistNameInput.focus();
    }

    async function deletePlaylist(idx) {
        if (confirm("Deseja realmente remover esta playlist?")) {
            currentPlaylists.splice(idx, 1);
            renderPlaylists();
            await savePlaylistsToFirestore();
            resetForm();
        }
    }

    function resetForm() {
        if (editIndexInput) editIndexInput.value = "-1";
        const titleEl = document.getElementById("playlist-form-title");
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-plus-circle" style="color: var(--cyan);"></i> <span>Add Playlist</span>`;
        if (btnSavePlaylist) btnSavePlaylist.textContent = "Save List";
        if (btnCancelEdit) btnCancelEdit.classList.add("hidden");
        if (playlistActionForm) playlistActionForm.reset();
    }

    if (btnCancelEdit) {
        btnCancelEdit.addEventListener("click", resetForm);
    }

    function logoutClient() {
        localStorage.removeItem("playtv_client_mac");
        localStorage.removeItem("playtv_client_key");
        activeClientMac = null;
        activeClientKey = null;
        currentPlaylists = [];
        
        if (loginState) loginState.classList.remove("hidden");
        if (dashboardState) dashboardState.classList.add("hidden");
        if (playlistLoginForm) playlistLoginForm.reset();
        resetForm();
    }

    if (btnPlaylistLogout) {
        btnPlaylistLogout.addEventListener("click", logoutClient);
    }


    // --- 8. DEVICE ACTIVATION CHECK SYSTEM ---
    const activationCheckForm = document.getElementById("activation-check-form");
    const activationCheckState = document.getElementById("activation-check-state");
    const activationDashboardState = document.getElementById("activation-dashboard-state");
    
    const statusMacLabel = document.getElementById("status-mac-label");
    const deviceStatusBadge = document.getElementById("device-status-badge");
    const deviceInfoKey = document.getElementById("device-info-key");
    const deviceInfoExpiry = document.getElementById("device-info-expiry");
    
    const btnActivateWhatsapp = document.getElementById("btn-activate-whatsapp");
    const btnActivationLogout = document.getElementById("btn-activation-logout");

    if (activationCheckForm) {
        activationCheckForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const mac = document.getElementById("a-mac").value.trim().toUpperCase();
            const key = document.getElementById("a-key").value.trim();
            const formattedMacDoc = mac.replace(/:/g, "-");
            
            try {
                // 1. Fetch info from playlists
                let docSnap = await db.collection("playlists").doc(formattedMacDoc).get();
                let clientData = null;
                
                if (docSnap.exists) {
                    const data = docSnap.data();
                    if (data.device_key === key) {
                        clientData = data;
                    }
                } else {
                    // 2. Fetch from CRM campaign contacts
                    const contactsSnap = await db.collection("campaigns").doc("main").collection("contacts")
                        .where("mac", "==", mac)
                        .get();
                        
                    if (!contactsSnap.empty) {
                        const cData = contactsSnap.docs[0].data();
                        if (cData.pass === key) {
                            clientData = {
                                mac_address: mac,
                                device_key: key,
                                expire_date: cData.expiration || "2028-12-31",
                                is_trial: 0
                            };
                        }
                    }
                }
                
                if (clientData) {
                    // Render details
                    if (statusMacLabel) statusMacLabel.textContent = `MAC: ${clientData.mac_address}`;
                    if (deviceInfoKey) deviceInfoKey.textContent = clientData.device_key;
                    if (deviceInfoExpiry) deviceInfoExpiry.textContent = clientData.expire_date;
                    
                    // Determine license states
                    const expireMs = new Date(clientData.expire_date).getTime();
                    const nowMs = Date.now();
                    const isExpired = expireMs < nowMs;
                    
                    if (deviceStatusBadge) {
                        if (isExpired) {
                            deviceStatusBadge.className = "status-badge expired";
                            deviceStatusBadge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>DEVICE LICENSE EXPIRED</span>`;
                        } else if (clientData.is_trial) {
                            deviceStatusBadge.className = "status-badge trial";
                            deviceStatusBadge.innerHTML = `<i class="fa-solid fa-gift"></i> <span>7-DAY FREE TRIAL ACTIVE</span>`;
                        } else {
                            deviceStatusBadge.className = "status-badge active";
                            deviceStatusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>PREMIUM LICENSE ACTIVE</span>`;
                        }
                    }
                    
                    // Format customized WhatsApp message
                    const waText = PLAYTV_CONFIG.activationMsg
                        .replace("{mac}", clientData.mac_address)
                        .replace("{key}", clientData.device_key);
                    
                    const waUrl = `https://api.whatsapp.com/send?phone=${PLAYTV_CONFIG.whatsappNumber}&text=${encodeURIComponent(waText)}`;
                    if (btnActivateWhatsapp) btnActivateWhatsapp.setAttribute("href", waUrl);
                    
                    if (activationCheckState) activationCheckState.classList.add("hidden");
                    if (activationDashboardState) activationDashboardState.classList.remove("hidden");
                } else {
                    alert("Acesso negado. MAC ou Device Key incorretos.");
                }
            } catch (err) {
                console.error("Activation check error:", err);
                alert("Erro ao verificar status. Verifique sua conexío.");
            }
        });
    }

    if (btnActivationLogout) {
        btnActivationLogout.addEventListener("click", () => {
            if (activationCheckState) activationCheckState.classList.remove("hidden");
            if (activationDashboardState) activationDashboardState.classList.add("hidden");
            if (activationCheckForm) activationCheckForm.reset();
        });
    }

    // --- 9. GENERAL WHATSAPP TRIGGERS SETUP ---
    const generalWaUrl = `https://api.whatsapp.com/send?phone=${PLAYTV_CONFIG.whatsappNumber}&text=${encodeURIComponent(PLAYTV_CONFIG.defaultMessage)}`;
    
    // Floating Button
    const waFloatingBtn = document.querySelector('.whatsapp-floating-btn');
    if (waFloatingBtn) {
        waFloatingBtn.addEventListener('click', () => {
            window.open(generalWaUrl, '_blank');
        });
    }

    // Bind triggers
    const whatsappTriggers = document.querySelectorAll('.whatsapp-trigger');
    whatsappTriggers.forEach(t => t.setAttribute('href', generalWaUrl));


    // --- 10. CONTACT FORM SUBMIT REDIRECTION ---
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("c-name").value.trim();
            const email = document.getElementById("c-email").value.trim();
            const msg = document.getElementById("c-message").value.trim();
            
            let text = `Olí! Me chamo ${name} (${email}) e gostaria de tirar uma dúvida sobre o PlayTV:\n\n*Mensagem:* ${msg}`;
            const url = `https://api.whatsapp.com/send?phone=${PLAYTV_CONFIG.whatsappNumber}&text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    }

    // Start Recover Session
    recoverSession();
});
