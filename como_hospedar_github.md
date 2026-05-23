# 🚀 Guia de Publicação Grátis (GitHub Pages) & Instalação PWA no iPhone

Este guia explica o passo a passo para colocar a sua Landing Page e o seu painel CRM online gratuitamente usando o **GitHub Pages**, permitindo que você instale a ferramenta no seu iPhone como um aplicativo nativo (PWA).

---

## 📦 O que foi preparado no seu computador?

Eu já criei e configurei todos os arquivos técnicos necessários para o seu PWA funcionar:
1. `manifest.json`: Arquivo que define o nome, cores e a inicialização em tela cheia do aplicativo.
2. `sw.js` (Service Worker): Registra o cache inteligente dos arquivos para o app abrir instantaneamente no seu celular, mesmo sem sinal de internet ou com conexão fraca.
3. `app_icon.png`: Um ícone tridimensional premium criado sob medida com uma TV dourada brilhante e o logotipo verde neon do WhatsApp.
4. **Repositório Git Local**: Iniciei o repositório e fiz o primeiro commit de todos os arquivos.

---

## 5. Files and Code

### Edited Files

#### 1. [como_hospedar_github.md](file:///C:/Users/thiag/.gemini/antigravity/brain/e35575c5-f9be-45f0-9e1a-dc8b976e0fc8/como_hospedar_github.md)
* **O que foi feito**: Criado o guia completo de publicação online e PWA.
* **Importância**: Passo a passo detalhado para o usuário.

---

## 🌐 Passo 1: Como Hospedar Grátis no GitHub

O GitHub Pages fornece hospedagem profissional, gratuita, vitalícia e com o certificado de segurança SSL (`https://`) — o que é obrigatório pelo sistema iOS para permitir a instalação de PWAs.

### 1. Criar repositório no GitHub
1. Acesse [github.com](https://github.com) (crie uma conta gratuita caso não tenha).
2. Clique no botão verde **"New"** (ou acesse [github.com/new](https://github.com/new)).
3. No campo **Repository name**, digite: `iptv-campanha`
4. Deixe marcado como **Public**.
5. **NÃO** marque as caixas de adicionar README, .gitignore ou licença.
6. Clique em **"Create repository"**.

### 2. Conectar seu computador ao GitHub
Abra o terminal do seu VS Code ou o terminal (PowerShell) dentro da pasta `iptv campanha` e rode os comandos abaixo para enviar seus arquivos (substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub):

```bash
# Definir a branch padrão como 'main'
git branch -M main

# Conectar a sua pasta local ao GitHub
git remote add origin https://github.com/SEU_USUARIO/iptv-campanha.git

# Enviar os arquivos para o ar!
git push -u origin main
```

---

## ⚡ Passo 2: Ativar o Site Online (GitHub Pages)

Depois de enviar os arquivos, faça a publicação com 2 cliques:

1. Na página do seu repositório no GitHub, clique na aba **"Settings"** (Configurações) no menu superior.
2. No menu lateral esquerdo, clique em **"Pages"**.
3. Na seção *Build and deployment* ➡️ *Branch*, mude de **None** para **`main`** (e mantenha a pasta `/root`).
4. Clique no botão **"Save"** (Salvar).

> [!TIP]
> Aguarde cerca de 1 a 2 minutos. O GitHub gerará o seu link público! Você pode atualizar a página e o link aparecerá no topo da aba Pages, como:
> `https://SEU_USUARIO.github.io/iptv-campanha/`

---

## 📱 Passo 3: Como Instalar o PWA no seu iPhone (Safari)

Uma vez que o link estiver ativo, você pode acessar seu CRM de qualquer lugar do mundo no seu iPhone:

```
🔗 Link da sua Landing Page de Clientes:
https://SEU_USUARIO.github.io/iptv-campanha/index.html

🔗 Link do seu Painel CRM Sequenciador:
https://SEU_USUARIO.github.io/iptv-campanha/painel-envios.html
```

### 📲 Passo a passo de instalação no iOS:
1. Abra o navegador **Safari** no seu iPhone.
2. Acesse o link do seu CRM: `https://SEU_USUARIO.github.io/iptv-campanha/painel-envios.html`
3. Toque no botão de **Compartilhar** 📥 (o ícone quadrado com uma seta apontando para cima na barra inferior do Safari).
4. Role a lista de opções para baixo e toque em **"Adicionar à Tela de Início"** (Add to Home Screen).
5. Defina o nome como **"IPTV CRM"** e toque em **"Adicionar"** no canto superior direito.

**Pronto!** O ícone personalizado tridimensional premium já estará na tela inicial do seu iPhone. Ao toque, a ferramenta abrirá em tela cheia (sem a barra de endereços do Safari, sem botões de navegação), funcionando exatamente como um aplicativo nativo da App Store!

---

## 💾 Persistência Segura de Dados no PWA
Como a ferramenta usa a tecnologia de armazenamento local (`localStorage`), o status de envio de todos os seus 8.000 clientes continuará salvo com total segurança no seu iPhone. Se você fechar o app e abrir no dia seguinte, o lote de contatos e os status (Abordagem, MAC, Enviado, etc.) continuarão exatamente de onde você parou!
