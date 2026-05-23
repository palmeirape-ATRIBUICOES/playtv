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

});

// Bounce attention CSS keyframe helper injected programmatically
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes bounce-attention {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
    }
`;
document.head.appendChild(styleSheet);
