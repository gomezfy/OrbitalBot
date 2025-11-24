# ⚡ Quick Start - Deploy no VertraCloud em 5 Minutos

## ⚠️ PROBLEMA: "dist/index.js não aparece no VertraCloud"

**Causa Principal**: Build command não está configurado corretamente

**Solução**: Use `npm install && npm run build` (NÃO apenas `npm run build`)

---

## 🚀 Passo 1: Build Command CORRETO

No VertraCloud, configure EXATAMENTE assim:

### Build Command (copie e cole):
```
npm install && npm run build
```

**POR QUE precisa de `npm install &&` ?**
- VertraCloud **não instala dependências automaticamente** antes do build
- Sem `npm install`, não existe `vite` nem `esbuild`
- Sem `vite` e `esbuild`, o build FALHA
- Sem build, **não é criado o `dist/index.js`**

### Start Command (copie e cole):
```
npm start
```

### Port:
```
5000
```

---

## 🔑 Passo 2: Variáveis de Ambiente (1 min)

No painel do VertraCloud, adicione TODAS:

```env
DISCORD_CLIENT_ID=coloque_seu_valor_aqui
DISCORD_CLIENT_SECRET=coloque_seu_valor_aqui
SESSION_SECRET=gere_abaixo
NODE_ENV=production
PORT=5000
```

**Gerar SESSION_SECRET** (rode no terminal local):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e cole no campo `SESSION_SECRET` do VertraCloud.

---

## 📁 Passo 3: Arquivos para Upload (1 min)

### ✅ ENVIAR (obrigatório):
- `package.json` ⭐
- `package-lock.json` ⭐
- Pasta `server/` completa ⭐
- Pasta `client/` completa ⭐
- Pasta `shared/` completa ⭐
- `vite.config.ts` ⭐
- `tsconfig.json` ⭐
- `tailwind.config.ts`
- `postcss.config.js`

### ❌ NÃO ENVIAR:
- `node_modules/` (instalado pelo VertraCloud)
- `dist/` (gerado pelo build)
- `.git/`, `.replit`, `replit.nix`
- Arquivos `.md` (documentação)

**Dica**: Use o arquivo `.vertracloudignore` que criei!

---

## 🔍 Passo 4: Verificar Logs (2 min)

Depois de clicar em "Deploy", abra os **Logs** no VertraCloud.

### ✅ Build bem-sucedido deve mostrar:
```
> npm install
added 501 packages

> npm run build
vite v5.4.20 building for production...
✓ 3715 modules transformed.
✓ built in 20.00s

dist/index.js  39.1kb
⚡ Done in 21ms
```

### ✅ Servidor iniciado deve mostrar:
```
> npm start

✅ Verificações de segurança em produção: OK
🚀 Servidor rodando em http://0.0.0.0:5000
```

### ❌ Se aparecer erro:
```
Error: Cannot find module '/app/dist/index.js'
```
**Causa**: Build não gerou o arquivo
**Solução**: Verifique se build command é `npm install && npm run build`

---

## 🔗 Passo 5: URL de Callback (1 min)

Depois que o deploy funcionar:

1. Copie a URL do seu app: `https://seu-app.vertracloud.app`
2. Acesse: https://discord.com/developers/applications
3. Sua aplicação → **OAuth2** → **General**
4. Em **Redirects**, clique **"Add Redirect"**
5. Cole: `https://seu-app.vertracloud.app/api/auth/callback`
6. Clique **"Save Changes"**

---

## ✅ Pronto! Testar o Login

Acesse: `https://seu-app.vertracloud.app`

1. Clique em **"Conectar com Discord"**
2. Autorize a aplicação
3. Você deve ser redirecionado logado! 🎉

---

## 📋 Checklist Rápido

Use o arquivo **`CHECKLIST_UPLOAD.txt`** que criei!

- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Port: `5000`
- [ ] Variáveis de ambiente configuradas
- [ ] Arquivos corretos enviados (SEM `node_modules/` ou `dist/`)
- [ ] URL de callback adicionada no Discord

---

**Total: 5 minutos para deploy completo!** 🚀
