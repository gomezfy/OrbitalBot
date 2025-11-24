#!/bin/bash
set -e

echo "📦 Passo 1/3: Instalando dependências..."
if ! npm install; then
  echo "❌ Erro: npm install falhou"
  exit 1
fi

echo "🔨 Passo 2/3: Compilando aplicação..."
if ! npm run build; then
  echo "❌ Erro: npm run build falhou"
  exit 1
fi

echo "✅ Passo 3/3: Verificando arquivos gerados..."
if [ -f "dist/index.js" ]; then
  echo "✅ dist/index.js gerado com sucesso!"
  ls -lh dist/index.js
else
  echo "❌ Erro: dist/index.js não foi gerado"
  exit 1
fi

echo ""
echo "🚀 Build concluído com sucesso!"
echo "Arquivos em dist/:"
ls -lh dist/
