#!/bin/bash
cd "$(dirname "$0")"
echo "=== Instalando dependências do EGE Business ==="
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
echo ""
echo "=== Iniciando servidor na porta 3001 ==="
npm run dev
