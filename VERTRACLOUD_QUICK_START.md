# ⚡ Quick Start - Deploy no VertraCloud em 5 Minutos

## 🚀 Passo 1: Preparar o Código
✅ **JÁ FEITO!** O código já está pronto para deploy

## 🔑 Passo 2: Credenciais (1 min)

No painel do VertraCloud, configure estas variáveis:

```
DISCORD_CLIENT_ID=sua_credential
DISCORD_CLIENT_SECRET=sua_credential
DISCORD_BOT_TOKEN=seu_bot_token
SESSION_SECRET=gere-com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NODE_ENV=production
PORT=5000
```

## 📦 Passo 3: Deploy (2 min)

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
3. **Port**: `5000`
4. Clique em Deploy!

## 🔗 Passo 4: URL de Callback (1 min)

No Discord Developer Portal:
1. OAuth2 → General → Redirects
2. Adicione: `https://seu-dominio.vertracloud.app/api/auth/callback`
3. Salve!

## ✅ Pronto!

Seu bot estará online em: `https://seu-dominio.vertracloud.app`

---

**Total: 5 minutos para deploy!** ⚡
