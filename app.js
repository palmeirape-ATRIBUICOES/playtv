/* -------------------------------------------------------------
   IBO PRIME - ADVANCED INTERACTIVE LOGIC
   Fully optimized for IBO Player screen upload & easy activations.
------------------------------------------------------------- */

// ==========================================
// ⚙️ CONFIGURAÇÃO FÁCIL: AJUSTE AQUI SEUS DADOS
// ==========================================
const IPTV_CONFIG = {
    whatsappNumber: '5511999999999', // Insira o DDD + Número do WhatsApp sem espaços ou traços (Ex: 5511999999999)
    companyName: 'IBO Prime',
    defaultMessage: 'Olá! Baixei o IBO Player na minha TV e gostaria de ativar meus 7 dias de teste gratuito.',
    plans: {
        'Bronze - Mensal': 'Olá! Gostaria de aproveitar a ativação do IBO Player e assinar o Plano Bronze Mensal por R$ 35,90.',
        'Prata - Trimestral': 'Olá! Gostaria de aproveitar a oferta VIP e assinar o Plano Prata Trimestral por R$ 89,90.',
        'Ouro - Semestral': 'Olá! Gostaria de assinar o Plano Ouro Semestral com maior desconto por R$ 149,90.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. HEADER SCROLL EFFECT ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. MOBILE DRAWER MENU ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const drawerCloseBtn = document.querySelector('.drawer-close-btn');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
    });

    const closeDrawer = () => mobileDrawer.classList.remove('open');
    drawerCloseBtn.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // --- 3. TAB SWITCHER (MANUAL DO IBO PLAYER) ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // Toggle active buttons
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

    // --- 4. INTERACTIVE PHOTO UPLOADER LOGIC ---
    const photoUploadContainer = document.getElementById('photo-upload-container');
    const photoInput = document.getElementById('photo-input');
    const uploadIdleState = document.getElementById('upload-idle-state');
    const uploadPreviewState = document.getElementById('upload-preview-state');
    const uploadPreviewImg = document.getElementById('upload-preview-img');
    const previewFileName = document.getElementById('preview-file-name');
    const btnRemovePhoto = document.getElementById('btn-remove-photo');

    // Trigger file selection when clicking container (avoid double triggers)
    photoUploadContainer.addEventListener('click', (e) => {
        if (e.target !== photoInput && !btnRemovePhoto.contains(e.target) && e.target.id !== 'photo-input') {
            photoInput.click();
        }
    });

    // Handle drag and drop visual highlights
    photoUploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        photoUploadContainer.style.borderColor = 'var(--warning)';
        photoUploadContainer.style.background = 'rgba(255, 159, 10, 0.05)';
    });

    const resetDragStyle = () => {
        photoUploadContainer.style.borderColor = 'rgba(255, 255, 255, 0.12)';
        photoUploadContainer.style.background = 'rgba(255, 255, 255, 0.01)';
    };

    photoUploadContainer.addEventListener('dragleave', resetDragStyle);
    photoUploadContainer.addEventListener('drop', resetDragStyle);

    // Dynamic file input changed
    photoInput.addEventListener('change', () => {
        handleFileSelection(photoInput.files[0]);
    });

    function handleFileSelection(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                uploadPreviewImg.src = e.target.result;
                previewFileName.textContent = file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name;
                
                uploadIdleState.style.display = 'none';
                uploadPreviewState.style.display = 'flex';
            };
            
            reader.readAsDataURL(file);
        } else if (file) {
            alert('Por favor, selecione apenas arquivos de imagem (fotos da TV).');
            clearPhotoInput();
        }
    }

    // Remove selected photo
    btnRemovePhoto.addEventListener('click', (e) => {
        e.stopPropagation();
        clearPhotoInput();
    });

    function clearPhotoInput() {
        photoInput.value = '';
        uploadPreviewImg.src = '';
        uploadPreviewState.style.display = 'none';
        uploadIdleState.style.display = 'flex';
    }

    // --- 5. MAC ADDRESS AUTOMATIC INPUT FORMATTING MASK ---
    const macInput = document.getElementById('mac-address');
    
    macInput.addEventListener('input', (e) => {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        let formatted = '';
        
        // Auto group characters in blocks of 2 separated by colons (Ex: aa:bb:cc...)
        for (let i = 0; i < value.length && i < 12; i++) {
            if (i > 0 && i % 2 === 0) {
                formatted += ':';
            }
            formatted += value[i];
        }
        
        e.target.value = formatted;
    });

    // --- 6. FUNNEL FORM SUBMIT & REDIRECT TO WHATSAPP ---
    const activationForm = document.getElementById('ibo-activation-form');
    
    activationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const clientName = document.getElementById('client-name').value.trim();
        const tvBrand = document.getElementById('tv-brand').value;
        const macAddress = document.getElementById('mac-address').value.trim();
        const deviceKey = document.getElementById('device-key').value.trim();
        const hasPhoto = photoInput.files.length > 0;
        
        // Build customized pre-filled WhatsApp message
        let textMsg = `Olá! Gostaria de ativar meu teste gratuito de 7 dias no IBO Player.\n\n`;
        textMsg += `👤 *Nome:* ${clientName}\n`;
        textMsg += `📺 *Aparelho:* ${tvBrand}\n`;
        
        if (macAddress) {
            textMsg += `🔢 *MAC Address:* \`${macAddress}\`\n`;
        }
        if (deviceKey) {
            textMsg += `🔑 *Device Key:* \`${deviceKey}\`\n`;
        }
        
        if (hasPhoto) {
            textMsg += `\n📸 *FOTO DA TELA:* Enviarei a foto da tela da minha TV com os códigos em seguida neste chat!`;
        } else {
            textMsg += `\n*(Não anexei foto, digitei os códigos acima manualmente)*`;
        }
        
        const waUrl = `https://api.whatsapp.com/send?phone=${IPTV_CONFIG.whatsappNumber}&text=${encodeURIComponent(textMsg)}`;
        
        // Redirect to WhatsApp chat
        window.open(waUrl, '_blank');
    });

    // --- 7. FAQ ACCORDION OPEN/CLOSE CONTROL ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all other accordions
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            
            // Toggle active state
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- 8. WHATSAPP WIDGET & TRIGGERS SETUP ---
    const waFloatingBtn = document.querySelector('.whatsapp-floating-btn');
    const waChatBox = document.querySelector('.whatsapp-chat-box');
    const chatCloseBtn = document.querySelector('.chat-close-btn');
    const btnChatWa = document.getElementById('btn-chat-whatsapp');

    // General WhatsApp Triggers setups (Footer and Floating widget)
    const generalWaUrl = `https://api.whatsapp.com/send?phone=${IPTV_CONFIG.whatsappNumber}&text=${encodeURIComponent(IPTV_CONFIG.defaultMessage)}`;
    btnChatWa.setAttribute('href', generalWaUrl);
    
    const whatsappTriggers = document.querySelectorAll('.whatsapp-trigger');
    whatsappTriggers.forEach(t => t.setAttribute('href', generalWaUrl));

    // Dynamic Plan Buttons message setups
    const planButtons = document.querySelectorAll('.btn-buy');
    planButtons.forEach(btn => {
        const planName = btn.getAttribute('data-plan');
        const planPrice = btn.getAttribute('data-price');
        const customMessage = `Olá! Gostaria de aproveitar a oferta e assinar o *${planName}* no valor de ${planPrice} com ativação de IPTV inclusa para o meu IBO Player. Como faço para pagar?`;
        
        const planWaUrl = `https://api.whatsapp.com/send?phone=${IPTV_CONFIG.whatsappNumber}&text=${encodeURIComponent(customMessage)}`;
        btn.setAttribute('href', planWaUrl);
        btn.setAttribute('target', '_blank');
    });

    // Floating Button Click Handlers
    waFloatingBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        waChatBox.classList.toggle('open');
        
        // Remove badge notification
        const badge = waFloatingBtn.querySelector('.notification-badge');
        if (badge) badge.style.display = 'none';
    });

    chatCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        waChatBox.classList.remove('open');
    });

    // Close chat if clicked outside
    document.addEventListener('click', (e) => {
        if (!waChatBox.contains(e.target) && !waFloatingBtn.contains(e.target)) {
            waChatBox.classList.remove('open');
        }
    });

    // Simulated Agent Micro-interaction: Typing Animation and Delay
    const typingIndicator = document.querySelector('.typing-indicator');
    const chatBody = document.querySelector('.chat-body');
    const receivedMessages = document.querySelectorAll('.chat-message.received');

    receivedMessages.forEach(msg => msg.style.display = 'none');
    typingIndicator.style.display = 'none';

    // Show Typing & Message after a subtle delay to capture visitors' attention
    setTimeout(() => {
        if (!waChatBox.classList.contains('open')) {
            waFloatingBtn.style.animation = 'pulse-whatsapp 1.2s infinite, bounce-attention 0.8s 3 ease-in-out';
        }
        
        typingIndicator.style.display = 'flex';
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Show first message
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            receivedMessages[0].style.display = 'block';
            chatBody.scrollTop = chatBody.scrollHeight;
            
            // Show typing again for second message
            setTimeout(() => {
                typingIndicator.style.display = 'flex';
                chatBody.scrollTop = chatBody.scrollHeight;
                
                setTimeout(() => {
                    typingIndicator.style.display = 'none';
                    receivedMessages[1].style.display = 'block';
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 2200);
            }, 1000);
        }, 1800);
        
    }, 2800);



    // --- 9. CLIENT PORTAL PLAYLIST MANAGER LOGIC ---
    const playlistLoginForm = document.getElementById("playlist-login-form");
    const portalMacInput = document.getElementById("portal-mac");
    const portalKeyInput = document.getElementById("portal-key");
    const loginErrorMsg = document.getElementById("login-error-msg");
    
    const loginState = document.getElementById("playlist-login-state");
    const dashboardState = document.getElementById("playlist-dashboard-state");
    
    const clientMacDisplay = document.getElementById("client-mac-display");
    const clientExpireDisplay = document.getElementById("client-expire-display");
    const playlistsContainer = document.getElementById("playlists-container");
    
    const playlistActionForm = document.getElementById("playlist-action-form");
    const playlistNameInput = document.getElementById("playlist-name");
    const playlistUrlInput = document.getElementById("playlist-url");
    const editIndexInput = document.getElementById("edit-index");
    const btnSavePlaylist = document.getElementById("btn-save-playlist");
    const btnCancelEdit = document.getElementById("btn-cancel-edit");
    const btnPortalLogout = document.getElementById("btn-portal-logout");
    
    let activeClientMac = null;
    let activeClientKey = null;
    let currentPlaylists = [];
    
    // Auto-format MAC Address input in client portal
    if (portalMacInput) {
        portalMacInput.addEventListener("input", (e) => {
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
            let formatted = "";
            for (let i = 0; i < value.length && i < 12; i++) {
                if (i > 0 && i % 2 === 0) formatted += ":";
                formatted += value[i];
            }
            e.target.value = formatted;
        });
    }
    
    // Check if session already exists
    function checkActiveSession() {
        const savedMac = localStorage.getItem("iptv_client_mac");
        const savedKey = localStorage.getItem("iptv_client_key");
        if (savedMac && savedKey && portalMacInput && portalKeyInput) {
            portalMacInput.value = savedMac;
            portalKeyInput.value = savedKey;
            loginClient(savedMac, savedKey, true);
        }
    }
    
    // Handle Login Submit
    if (playlistLoginForm) {
        playlistLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const mac = portalMacInput.value.trim().toLowerCase();
            const key = portalKeyInput.value.trim();
            loginClient(mac, key, false);
        });
    }
    
    async function loginClient(mac, key, isAutoLogin) {
        if (!loginErrorMsg) return;
        loginErrorMsg.classList.add("hidden");
        const formattedMacDoc = mac.replace(/:/g, "-");
        
        try {
            // 1. Try fetching from `/playlists/{mac}`
            let docRef = db.collection("playlists").doc(formattedMacDoc);
            let docSnap = await docRef.get();
            
            let playlistData = null;
            
            if (docSnap.exists) {
                const data = docSnap.data();
                if (data.device_key === key) {
                    playlistData = data;
                }
            } else {
                // 2. If not in playlists, try querying contacts collection in CRM
                const contactsSnap = await db.collection("campaigns").doc("main").collection("contacts")
                    .where("mac", "==", mac.toUpperCase())
                    .get();
                    
                if (!contactsSnap.empty) {
                    const contactDoc = contactsSnap.docs[0];
                    const contactData = contactDoc.data();
                    
                    // Verify key (crm password field is pass)
                    if (contactData.pass === key) {
                        // Onboard this client into the /playlists collection
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
                // Save session for multi-page persistence and auto-load
                localStorage.setItem("iptv_client_mac", mac);
                localStorage.setItem("iptv_client_key", key);
                
                activeClientMac = mac;
                activeClientKey = key;
                currentPlaylists = playlistData.playlists || [];
                
                // Show dashboard state
                if (clientMacDisplay) clientMacDisplay.textContent = playlistData.mac_address;
                if (clientExpireDisplay) clientExpireDisplay.textContent = playlistData.expire_date;
                
                if (loginState) loginState.classList.add("hidden");
                if (dashboardState) dashboardState.classList.remove("hidden");
                
                renderPlaylists();
            } else {
                if (!isAutoLogin) {
                    loginErrorMsg.classList.remove("hidden");
                } else {
                    // Stale login session, clean up
                    logoutClient();
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            if (!isAutoLogin) loginErrorMsg.classList.remove("hidden");
        }
    }
    
    function renderPlaylists() {
        if (!playlistsContainer) return;
        playlistsContainer.innerHTML = "";
        if (currentPlaylists.length === 0) {
            playlistsContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.9rem; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-glass); border-radius: 8px;">
                    <i class="fa-solid fa-folder-open" style="font-size: 1.5rem; margin-bottom: 8px; color: var(--primary);"></i><br>
                    Nenhuma playlist cadastrada. Adicione uma no formulÃ¡rio ao lado!
                </div>
            `;
            return;
        }
        
        currentPlaylists.forEach((pl, idx) => {
            const item = document.createElement("div");
            item.className = "playlist-item glass-panel";
            item.style.display = "flex";
            item.style.justifyContent = "space-between";
            item.style.alignItems = "center";
            item.style.padding = "12px 16px";
            item.style.borderRadius = "8px";
            item.style.background = "rgba(255,255,255,0.03)";
            item.style.border = "1px solid var(--border-glass)";
            
            item.innerHTML = `
                <div style="flex: 1; min-width: 0; padding-right: 15px;">
                    <div style="font-weight: 700; color: var(--text-light); font-size: 0.95rem; margin-bottom: 3px;">${pl.name}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${pl.url}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-sm btn-edit" data-index="${idx}" style="background: rgba(10, 132, 255, 0.15); color: #0a84ff; border: 1px solid rgba(10, 132, 255, 0.3); padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; cursor: pointer;"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-delete" data-index="${idx}" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            
            // Add click listeners
            item.querySelector(".btn-edit").addEventListener("click", () => editPlaylist(idx));
            item.querySelector(".btn-delete").addEventListener("click", () => deletePlaylist(idx));
            
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
            console.error("Firestore sync error:", err);
            alert("Erro ao sincronizar com o servidor. Tente novamente.");
        }
    }
    
    // Action Form Submit (Add or Edit)
    if (playlistActionForm) {
        playlistActionForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = playlistNameInput.value.trim();
            const url = playlistUrlInput.value.trim();
            const editIdx = parseInt(editIndexInput.value);
            
            if (editIdx === -1) {
                // Add new
                currentPlaylists.push({ name, url });
            } else {
                // Edit existing
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
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color: var(--primary);"></i> Editar Lista`;
        if (btnSavePlaylist) btnSavePlaylist.textContent = "Salvar AlteraÃ§Ãµes";
        if (btnCancelEdit) btnCancelEdit.classList.remove("hidden");
        if (playlistNameInput) playlistNameInput.focus();
    }
    
    if (btnCancelEdit) {
        btnCancelEdit.addEventListener("click", resetForm);
    }
    
    function resetForm() {
        if (playlistActionForm) playlistActionForm.reset();
        if (editIndexInput) editIndexInput.value = "-1";
        const titleEl = document.getElementById("playlist-form-title");
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-plus-circle" style="color: var(--primary);"></i> Adicionar Lista`;
        if (btnSavePlaylist) btnSavePlaylist.textContent = "Salvar Lista";
        if (btnCancelEdit) btnCancelEdit.classList.add("hidden");
    }
    
    async function deletePlaylist(idx) {
        if (confirm("Deseja realmente remover esta playlist?")) {
            currentPlaylists.splice(idx, 1);
            renderPlaylists();
            await savePlaylistsToFirestore();
            if (editIndexInput && editIndexInput.value === String(idx)) {
                resetForm();
            }
        }
    }
    
    function logoutClient() {
        localStorage.removeItem("iptv_client_mac");
        localStorage.removeItem("iptv_client_key");
        activeClientMac = null;
        activeClientKey = null;
        currentPlaylists = [];
        
        if (dashboardState) dashboardState.classList.add("hidden");
        if (loginState) loginState.classList.remove("hidden");
        if (playlistLoginForm) playlistLoginForm.reset();
    }
    
    if (btnPortalLogout) {
        btnPortalLogout.addEventListener("click", logoutClient);
    }
    
    // Initial check
    checkActiveSession();

});
