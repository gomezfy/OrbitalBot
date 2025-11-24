# 🔧 Configurar Discord OAuth - Guia Passo a Passo

## ⚠️ URL Correta para Adicionar

Copie EXATAMENTE esta URL (com HTTPS):

```
https://a6f3a9b6-af65-4fb4-97f0-f4832a9cdb04-00-22zb2l46bu27e.kirk.replit.dev/api/auth/callback
```

---

## 📝 Passo a Passo Detalhado

### 1. Acesse o Discord Developer Portal
🔗 https://discord.com/developers/applications

### 2. Selecione Sua Aplicação
- Clique na aplicação que você criou (Client ID: `1426734768111747284`)
- Se não vê a aplicação, clique em "New Application" primeiro

### 3. Vá em OAuth2
- No menu lateral esquerdo, clique em **"OAuth2"**
- Depois clique em **"General"**

### 4. Configure os Redirects
Na seção **"Redirects"**:

1. ✅ Clique no botão **"Add Redirect"**
2. ✅ Cole EXATAMENTE a URL:
   ```
   https://a6f3a9b6-af65-4fb4-97f0-f4832a9cdb04-00-22zb2l46bu27e.kirk.replit.dev/api/auth/callback
   ```
3. ✅ **IMPORTANTE**: Certifique-se de usar `https://` (com S)
4. ✅ Certifique-se de que não há espaços extras no início ou fim
5. ✅ Clique em **"Save Changes"** no final da página

---

## ✅ Checklist de Verificação

Antes de salvar, confirme:

- [ ] A URL começa com `https://` (com S)
- [ ] A URL termina com `/api/auth/callback`
- [ ] Não há espaços extras
- [ ] Você clicou em "Save Changes"

---

## 🧪 Como Testar Depois

1. Volte para a aplicação no Replit
2. Clique em "Conectar com Discord"
3. Você será redirecionado para o Discord
4. Autorize a aplicação
5. Será redirecionado de volta para o OrbitalBot logado! ✅

---

## ❌ Erros Comuns

### "Invalid redirect_uri"
**Causa**: URL não está registrada ou está incorreta
**Solução**: 
- Verifique se adicionou a URL EXATA acima
- Certifique-se de usar `https://` (com S)
- Certifique-se de clicar em "Save Changes"

### "Access Denied"
**Causa**: Você recusou a autorização
**Solução**: Tente novamente e clique em "Autorizar"

---

## 📞 Precisa de Ajuda?

Se continuar com problemas:
1. Tire um print da seção "Redirects" no Discord
2. Verifique se o Client ID é: `1426734768111747284`
3. Confirme que salvou as alterações

---

## 🚀 Próximo Passo: VertraCloud

Depois que o login funcionar aqui no Replit, você poderá fazer o deploy no VertraCloud. Lá você vai adicionar uma URL diferente:

```
https://seu-dominio.vertracloud.app/api/auth/callback
```

(Consulte o arquivo `VERTRACLOUD_DEPLOY.md` para instruções completas de deploy)
