# ⚙️ Guia de Setup do VertraCloud - Passo a Passo Visual

## ❌ Problema Comum

```
Error: Cannot find module '/app/dist/index.js'
```

**Causa**: O build não foi executado ANTES do start.

**Solução**: Configurar a ordem correta dos comandos!

---

## ✅ Configuração Correta no VertraCloud

### Passo 1: Criar Instância

1. Acesse: https://vertracloud.app
2. Clique em **"New Instance"** ou **"Create App"**
3. Selecione **Node.js** como runtime

### Passo 2: Configurar Comandos (⚠️ CRÍTICO!)

**IMPORTANTE**: A ordem dos comandos IMPORTA!

#### a) Build Command
```
npm run build
```

- Isto irá:
  1. Compilar o React frontend para `dist/public/`
  2. Compilar o Node.js backend para `dist/index.js`
  3. Criar todos os arquivos necessários

#### b) Start Command
```
npm start
```

- Isto irá:
  1. Iniciar o servidor Node.js
  2. Servir o frontend compilado
  3. Ouvir na porta 5000

### Passo 3: Porta

```
5000
```

### Passo 4: Variáveis de Ambiente

Clique em "Environment Variables" e adicione TODAS:

```
DISCORD_CLIENT_ID=seu_client_id_aqui
DISCORD_CLIENT_SECRET=seu_client_secret_aqui
DISCORD_BOT_TOKEN=seu_bot_token_aqui
SESSION_SECRET=gere-com-este-comando:
```

**Para gerar SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e cole no VertraCloud.

```
NODE_ENV=production
PORT=5000
```

### Passo 5: Upload do Código

Faça upload EXATAMENTE desses arquivos/pastas:

✅ **Incluir:**
- `package.json`
- `package-lock.json`
- `server/` (toda pasta)
- `client/` (toda pasta)
- `shared/` (toda pasta)
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `postcss.config.js`
- `drizzle.config.ts`
- Qualquer arquivo de configuração `.ts` ou `.js`

❌ **NÃO incluir:**
- `node_modules/` (instalado automaticamente)
- `dist/` (gerado pelo build)
- `.git/` ou `.gitignore`
- `replit.md` (não necessário em produção)

### Passo 6: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (pode levar 2-3 minutos)
3. Aguarde o servidor iniciar

### Passo 7: Configurar URL de Callback no Discord

1. Acesse: https://discord.com/developers/applications
2. Selecione sua aplicação
3. Vá em: **OAuth2** → **General**
4. Em **Redirects**, clique **"Add Redirect"**
5. Cole: `https://seu-dominio.vertracloud.app/api/auth/callback`
   - Substitua `seu-dominio` pelo domínio real
6. Clique em **"Save Changes"**

### Passo 8: Teste!

1. Acesse: `https://seu-dominio.vertracloud.app`
2. Clique em **"Conectar com Discord"**
3. Autorize a aplicação
4. Você deve ser redirecionado para o dashboard logado!

---

## 🔍 Troubleshooting

### Erro: "Cannot find module '/app/dist/index.js'"

**Causa**: Build não foi executado
**Solução**: 
- Certifique-se de que **Build Command** está configurado
- Verifique se o build completou sem erros nos logs

### Erro: "Discord credentials not configured"

**Causa**: Variáveis de ambiente não estão configuradas
**Solução**:
- Verifique se você adicionou `DISCORD_CLIENT_ID` e `DISCORD_CLIENT_SECRET`
- Reinicie a instância após adicionar as variáveis

### Erro: "Invalid redirect_uri"

**Causa**: URL de callback não está registrada no Discord
**Solução**:
- Vá em Discord Developer Portal
- OAuth2 → General → Redirects
- Certifique-se de que a URL está EXATAMENTE como está no VertraCloud
- Use `https://` (com S)

### Aplicação inicia mas fica lenta

**Causa**: Primeiro build/boot é lento
**Solução**: Aguarde 30-60 segundos na primeira execução

---

## 📞 Verificar Logs

No painel do VertraCloud, clique em **"Logs"** para ver:
- Progresso do build
- Erros de inicialização
- Requisições HTTP

---

## 🎯 Checklist Final

Antes de deploy, confirme:

- [ ] Build Command: `npm run build`
- [ ] Start Command: `npm start`
- [ ] Port: `5000`
- [ ] `DISCORD_CLIENT_ID` configurado
- [ ] `DISCORD_CLIENT_SECRET` configurado
- [ ] `SESSION_SECRET` configurado
- [ ] `NODE_ENV=production` configurado
- [ ] Arquivos necessários foram uploadados
- [ ] URL de callback adicionada no Discord

---

## ✅ Pronto!

Se tudo foi configurado corretamente, seu bot estará online em poucos minutos! 🚀
