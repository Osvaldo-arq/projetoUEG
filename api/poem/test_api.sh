#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8080}"

USER="testuser79"
PASS="123456"
EMAIL="test79@example.com"
ROLE="USER"

echo "🔹 1) Registrando usuário..."
REGISTER_RESP=$(curl -s -w "\n%{http_code}" \
  -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'"$USER"'",
    "password": "'"$PASS"'",
    "confirmPassword": "'"$PASS"'",
    "email": "'"$EMAIL"'",
    "role": "'"$ROLE"'"
  }')

REGISTER_BODY=$(echo "$REGISTER_RESP" | sed '$d')
REGISTER_CODE=$(echo "$REGISTER_RESP" | tail -n1)

if [ "$REGISTER_CODE" -ne 200 ]; then
  echo "❌ Registro falhou (HTTP $REGISTER_CODE)"
  echo "$REGISTER_BODY" | jq . || echo "$REGISTER_BODY"
  exit 1
fi
echo "✅ Registro OK (HTTP $REGISTER_CODE)"
echo

echo "🔹 2) Realizando login..."
LOGIN_RESP=$(curl -s -w "\n%{http_code}" \
  -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'"$USER"'",
    "password": "'"$PASS"'"
  }')

LOGIN_BODY=$(echo "$LOGIN_RESP" | sed '$d')
LOGIN_CODE=$(echo "$LOGIN_RESP" | tail -n1)

if [ "$LOGIN_CODE" -ne 200 ]; then
  echo "❌ Login falhou (HTTP $LOGIN_CODE)"
  echo "$LOGIN_BODY" | jq . || echo "$LOGIN_BODY"
  exit 1
fi

TOKEN=$(echo "$LOGIN_BODY" | tr -d '"')
if [[ -z "$TOKEN" ]]; then
  echo "❌ Token não retornado no login"
  exit 1
fi

echo "✅ Login OK (HTTP $LOGIN_CODE), token recebido"
echo

echo "🔹 3) CRUD de Profile"

# 3.1) Criar / Atualizar Profile
echo "  👉 Criando profile..."
CREATE_RESP=$(curl -s -w "\n%{http_code}" \
  -X POST "$BASE_URL/api/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "firstName": "Maria",
    "lastName": "Silva",
    "phone": "+551199999999",
    "userEmail": "'"$EMAIL"'"
  }')

CREATE_BODY=$(echo "$CREATE_RESP" | sed '$d')
CREATE_CODE=$(echo "$CREATE_RESP" | tail -n1)

if [ "$CREATE_CODE" -ne 200 ]; then
  echo "❌ Falha ao criar profile (HTTP $CREATE_CODE)"
  echo "$CREATE_BODY" | jq . || echo "$CREATE_BODY"
  exit 1
fi
echo "  ✅ Profile criado: $(echo "$CREATE_BODY" | jq .)"

# 3.2) Ler Profile criado
echo "  👉 Buscando profile por email..."
GET_RESP=$(curl -s -w "\n%{http_code}" \
  -X GET "$BASE_URL/api/profile/$EMAIL" \
  -H "Authorization: Bearer $TOKEN")

GET_BODY=$(echo "$GET_RESP" | sed '$d')
GET_CODE=$(echo "$GET_RESP" | tail -n1)

if [ "$GET_CODE" -ne 200 ]; then
  echo "❌ Falha ao buscar profile (HTTP $GET_CODE)"
  echo "$GET_BODY" | jq . || echo "$GET_BODY"
  exit 1
fi
# Valida JSON e campos
echo "$GET_BODY" | jq .firstName >/dev/null || { echo "❌ JSON inválido"; exit 1; }
echo "  ✅ Profile lido corretamente: $(echo "$GET_BODY" | jq .)"

# 3.3) Deletar Profile
echo "  👉 Deletando profile..."
DEL_RESP=$(curl -s -w "\n%{http_code}" \
  -X DELETE "$BASE_URL/api/profile/$EMAIL" \
  -H "Authorization: Bearer $TOKEN")

DEL_BODY=$(echo "$DEL_RESP" | sed '$d')
DEL_CODE=$(echo "$DEL_RESP" | tail -n1)

if [ "$DEL_CODE" -ne 204 ]; then
  echo "❌ Falha ao deletar profile (HTTP $DEL_CODE)"
  echo "$DEL_BODY" | jq . || echo "$DEL_BODY"
  exit 1
fi
echo "  ✅ Profile deletado (HTTP $DEL_CODE)"

# 3.4) Confirmar exclusão
echo "  👉 Confirmando exclusão (deve falhar)..."
CONF_RESP=$(curl -s -w "\n%{http_code}" \
  -X GET "$BASE_URL/api/profile/$EMAIL" \
  -H "Authorization: Bearer $TOKEN")

CONF_CODE=$(echo "$CONF_RESP" | tail -n1)
if [ "$CONF_CODE" -eq 200 ]; then
  echo "❌ Profile ainda existe! (HTTP 200)"
  exit 1
fi
echo "  ✅ Exclusão confirmada (HTTP $CONF_CODE)"
echo

echo "🎉 Testes concluídos com sucesso! 🎉"

