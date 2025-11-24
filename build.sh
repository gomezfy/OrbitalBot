#!/bin/bash
set -e

echo "📦 Instalando dependências..."
npm install

echo "🔨 Compilando aplicação..."
npm run build

echo "✅ Build concluído com sucesso!"
echo "📁 Arquivos gerados em dist/"
ls -lh dist/
