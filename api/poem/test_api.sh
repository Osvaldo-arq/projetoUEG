#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8080}"

USER="testuser221"
PASS="123456"
EMAIL="test1221@example.com"
ROLE="USER"

# 1) Registro do usuário
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
REGISTER_CODE=$(echo "$REGISTER_RESP" | tail -n1)
if [ "$REGISTER_CODE" -ne 200 ]; then
  echo "❌ Registro falhou (HTTP $REGISTER_CODE)"
  exit 1
fi

echo "✅ Registro OK"

echo
# 2) Login
echo "🔹 2) Login..."
LOGIN_RESP=$(curl -s -w "\n%{http_code}" \
  -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'"$USER"'",
    "password": "'"$PASS"'"
  }')
LOGIN_CODE=$(echo "$LOGIN_RESP" | tail -n1)
TOKEN=$(echo "$LOGIN_RESP" | sed '$d' | tr -d '"')
if [ "$LOGIN_CODE" -ne 200 ] || [[ -z "$TOKEN" ]]; then
  echo "❌ Login falhou (HTTP $LOGIN_CODE)"
  exit 1
fi
echo "✅ Login OK, token recebido"

echo
# Presume USER_ID = 1 (ajuste se necessário)
USER_ID=1

# 3) CRUD de Profile
echo "🔹 3) CRUD de Profile..."
# 3.1) Criar Profile
echo "  ➤ Criando profile..."
PROF_CREATE=$(curl -s -w "\n%{http_code}" \
  -X POST "$BASE_URL/api/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "firstName": "Maria",
    "lastName": "Silva",
    "phone": "+551199999999",
    "userEmail": "'"$EMAIL"'"
  }')
PROF_CODE=$(echo "$PROF_CREATE" | tail -n1)
if [ "$PROF_CODE" -ne 200 ]; then
  echo "❌ Create Profile falhou (HTTP $PROF_CODE)"
  exit 1
fi
echo "  ✅ Profile criado"

# 3.2) Ler Profile
echo "  ➤ Lendo profile..."
PROF_GET=$(curl -s -w "\n%{http_code}" \
  -X GET "$BASE_URL/api/profile/$EMAIL" \
  -H "Authorization: Bearer $TOKEN")
PROF_GET_CODE=$(echo "$PROF_GET" | tail -n1)
if [ "$PROF_GET_CODE" -ne 200 ]; then
  echo "❌ Get Profile falhou (HTTP $PROF_GET_CODE)"
  exit 1
fi
echo "  ✅ Profile lido: $(echo "$PROF_GET" | sed '$d')"

# 3.3) Deletar Profile
echo "  ➤ Deletando profile..."
PROF_DEL=$(curl -s -w "\n%{http_code}" \
  -X DELETE "$BASE_URL/api/profile/$EMAIL" \
  -H "Authorization: Bearer $TOKEN")
PROF_DEL_CODE=$(echo "$PROF_DEL" | tail -n1)
if [ "$PROF_DEL_CODE" -ne 204 ]; then
  echo "❌ Delete Profile falhou (HTTP $PROF_DEL_CODE)"
  exit 1
fi
echo "  ✅ Profile deletado"

echo
# 4) CRUD de Poema
echo "🔹 4) CRUD de Poema..."
# 4.1) Criar Poema
echo "  ➤ Criando poema..."
POEM_CREATE=$(curl -s -w "\n%{http_code}" \
  -X POST "$BASE_URL/api/poems" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Meu Poema",
    "text": "Texto do poema",
    "author": "Autor X",
    "imageUrl": "http://example.com/img.jpg",
    "postDate": "12/05/2025"
  }')
POEM_ID=$(echo "$POEM_CREATE" | sed '$d' | jq -r '.id')
POEM_CREATE_CODE=$(echo "$POEM_CREATE" | tail -n1)
if [ "$POEM_CREATE_CODE" -ne 200 ] || [[ -z "$POEM_ID" ]]; then
  echo "❌ Create Poema falhou (HTTP $POEM_CREATE_CODE)"
  exit 1
fi
echo "  ✅ Poema criado com ID=$POEM_ID"

# 4.2) Ler Poema
echo "  ➤ Lendo poema..."
POEM_GET=$(curl -s -w "\n%{http_code}" \
  -X GET "$BASE_URL/api/poems/$POEM_ID" \
  -H "Authorization: Bearer $TOKEN")
POEM_GET_CODE=$(echo "$POEM_GET" | tail -n1)
if [ "$POEM_GET_CODE" -ne 200 ]; then
  echo "❌ Get Poema falhou (HTTP $POEM_GET_CODE)"
  exit 1
fi
echo "  ✅ Poema lido: $(echo "$POEM_GET" | sed '$d')"

# 4.3) Atualizar Poema
echo "  ➤ Atualizando poema..."
POEM_UPDATE=$(curl -s -w "
%{http_code}" \
  -X POST "$BASE_URL/api/poems" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id": '$POEM_ID',
    "title": "Meu Poema Editado",
    "text": "Texto atualizado",
    "author": "Autor X",
    "imageUrl": "http://example.com/img2.jpg",
    "postDate": "13/05/2025"
  }')
POEM_UPDATE_CODE=$(echo "$POEM_UPDATE" | tail -n1)
if [ "$POEM_UPDATE_CODE" -ne 200 ]; then
  echo "❌ Update Poema falhou (HTTP $POEM_UPDATE_CODE)"
  exit 1
fi
echo "  ✅ Poema atualizado"

# 4.4) Deletar Poema) Deletar Poema
echo "  ➤ Deletando poema..."
POEM_DEL=$(curl -s -w "\n%{http_code}" \
  -X DELETE "$BASE_URL/api/poems/$POEM_ID" \
  -H "Authorization: Bearer $TOKEN")
POEM_DEL_CODE=$(echo "$POEM_DEL" | tail -n1)
if [ "$POEM_DEL_CODE" -ne 204 ]; then
  echo "❌ Delete Poema falhou (HTTP $POEM_DEL_CODE)"
  exit 1
fi
echo "  ✅ Poema deletado"

echo
# 5) Deletar usuário
echo "🔹 5) Deletando usuário ID=$USER_ID..."
USER_DEL_CODE=$(curl -s -w "%{http_code}" -o /dev/null \
  -X DELETE "$BASE_URL/api/auth/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")
if [ "$USER_DEL_CODE" -ne 200 ]; then
  echo "❌ Delete Usuário falhou (HTTP $USER_DEL_CODE)"
  exit 1
fi
echo "✅ Usuário deletado"

echo
"🎉 Teste completo concluído! 🎉"
