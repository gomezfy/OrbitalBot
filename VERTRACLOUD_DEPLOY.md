# Guia de Deploy - OrbitalBot no VertraCloud.app

## 📋 Pré-requisitos

### 1. Configurar Aplicação Discord OAuth

Antes de fazer o deploy, você precisa configurar o Discord OAuth:

1. Acesse: https://discord.com/developers/applications
2. Clique em **"New Application"** (se ainda não criou)
3. Dê um nome para sua aplicação (ex: "OrbitalBot")
4. Vá em **OAuth2** → **General**
5. **IMPORTANTE**: Adicione as URLs de redirecionamento:
   - Para desenvolvimento local: `http://localhost:5000/api/auth/callback`
   - Para VertraCloud: `https://seu-dominio.vertracloud.app/api/auth/callback`
   
6. Copie as seguintes informações:
   - **CLIENT ID** (na página OAuth2)
   - **CLIENT SECRET** (clique em "Reset Secret" se necessário)

### 2. Configurar Bot Token (Opcional para funcionalidades avançadas)

1. No mesmo painel, vá em **Bot**
2. Clique em **"Add Bot"** se ainda não criou
3. Copie o **BOT TOKEN**
4. Em **Privileged Gateway Intents**, ative:
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
   - ✅ PRESENCE INTENT (opcional)

---

## 🚀 Deploy no VertraCloud.app

### Passo 1: Preparar o Projeto

O projeto já está pronto para deploy! Os arquivos necessários já estão configurados:

- ✅ `package.json` com script `start` para produção
- ✅ `build` script para compilar o projeto
- ✅ Configurações de segurança (helmet, rate limiting)
- ✅ Suporte a variáveis de ambiente

### Passo 2: Fazer Deploy no VertraCloud

1. Acesse: https://vertracloud.app
2. Faça login ou crie uma conta
3. Clique em **"New Instance"** ou **"Create Project"**
4. Selecione **Node.js** como runtime
5. Configure **EXATAMENTE** assim:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: 5000
   
⚠️ **IMPORTANTE**: O build DEVE rodar ANTES do start! A ordem importa!

### Passo 3: Configurar Variáveis de Ambiente

No painel do VertraCloud, adicione as seguintes variáveis de ambiente:

#### Obrigatórias:
```bash
# Discord OAuth (OBRIGATÓRIO para login funcionar)
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui

# Segurança da Sessão (OBRIGATÓRIO)
SESSION_SECRET=uma_senha_super_secreta_aleatoria_aqui
# Gere uma senha segura com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ambiente
NODE_ENV=production
PORT=5000
```

#### Opcionais (para funcionalidades do bot):
```bash
# Bot Token Discord (apenas se quiser usar funcionalidades avançadas do bot)
DISCORD_BOT_TOKEN=seu_bot_token_aqui
```

### Passo 4: Atualizar URL de Callback no Discord

1. Volte em: https://discord.com/developers/applications
2. Selecione sua aplicação
3. Vá em **OAuth2** → **General**
4. Em **Redirects**, adicione:
   ```
   https://seu-dominio.vertracloud.app/api/auth/callback
   ```
   (substitua `seu-dominio` pelo domínio real que o VertraCloud forneceu)
5. Clique em **"Save Changes"**

### Passo 5: Deploy!

1. Faça o upload do código ou conecte seu repositório GitHub
2. Clique em **"Deploy"**
3. Aguarde o build completar
4. Acesse sua aplicação no domínio fornecido pelo VertraCloud

---

## 🔧 Configuração Alternativa: Upload Manual

Se preferir fazer upload manual dos arquivos:

1. No VertraCloud, selecione **"Upload Files"**
2. Faça upload de todos os arquivos do projeto (exceto `node_modules`)
3. O VertraCloud vai instalar as dependências automaticamente

---

## ✅ Verificar se Está Funcionando

1. Acesse `https://seu-dominio.vertracloud.app`
2. Você deve ver a página de login com o botão "Conectar com Discord"
3. Clique no botão - você será redirecionado para o Discord
4. Autorize a aplicação
5. Você será redirecionado de volta e logado com sucesso!

---

## 🐛 Solução de Problemas

### Erro: "no_client_id" ou "Discord credentials not configured"
**Solução**: Certifique-se de que `DISCORD_CLIENT_ID` e `DISCORD_CLIENT_SECRET` estão configurados nas variáveis de ambiente do VertraCloud.

### Erro: "Token exchange failed" ou "Invalid redirect_uri"
**Solução**: 
1. Verifique se a URL de callback está EXATAMENTE igual no Discord Developer Portal
2. Certifique-se de que está usando `https://` e não `http://` para produção
3. Confirme que o domínio está correto (sem barras no final)

### Erro: "SESSION_SECRET deve ser configurado em produção"
**Solução**: Adicione `SESSION_SECRET` nas variáveis de ambiente com uma senha forte e aleatória.

### Bot não conecta
**Solução**: 
1. Verifique se o `DISCORD_BOT_TOKEN` está correto
2. Certifique-se de que os Privileged Gateway Intents estão ativados
3. Verifique os logs do VertraCloud para mais detalhes

---

## 📊 Monitoramento

O VertraCloud oferece:
- Logs em tempo real
- Métricas de uso (CPU, RAM, requisições)
- Status de uptime

Acesse o painel de controle para monitorar sua aplicação.

---

## 🔄 Atualizações

Para atualizar a aplicação:

1. **Via GitHub**: Faça push das alterações - o VertraCloud pode fazer deploy automático
2. **Via Upload**: Faça upload dos novos arquivos
3. **Restart**: Use o botão "Restart" no painel do VertraCloud

---

## 💰 Custos Estimados

Consulte https://vertracloud.app para preços atualizados. 

Alternativas gratuitas/baratas:
- **Railway.app**: $5/mês com período gratuito
- **Render.com**: Tier gratuito disponível (com limitações)
- **Fly.io**: Tier gratuito para projetos pequenos

---

## 📞 Suporte

- **VertraCloud Docs**: https://docs.vertracloud.app
- **Discord Community**: Link disponível nos docs
- **Email**: Disponível via documentação oficial

---

## 🎯 Próximos Passos Após Deploy

1. ✅ Testar o login do Discord
2. ✅ Configurar o bot token (se aplicável)
3. ✅ Convidar o bot para seu servidor Discord
4. ✅ Testar todas as funcionalidades
5. ✅ Configurar domínio customizado (opcional)

---

**Boa sorte com seu deploy! 🚀**
