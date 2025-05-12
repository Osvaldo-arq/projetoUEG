#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8080}"

USER="testuser1"
PASS="123456"
EMAIL="test1@example.com"
ROLE="USER"

echo
echo "===================== Iniciando Teste da API ====================="

# 1) Registro do usuário
echo
echo "🔹 1) Registro de Usuário"
echo "   Usuário: $USER, Email: $EMAIL, Role: $ROLE"
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
  echo "❌ [1] Falha ao registrar usuário (HTTP $REGISTER_CODE)"
  echo "    Resposta: $(echo "$REGISTER_RESP" | sed '$d')"
  exit 1
fi
echo "✅ [1] Usuário registrado com sucesso!"

# 2) Login
echo
echo "🔹 2) Autenticação (Login)"
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
  echo "❌ [2] Falha no login (HTTP $LOGIN_CODE)"
  echo "    Resposta: $(echo "$LOGIN_RESP" | sed '$d')"
  exit 1
fi
echo "✅ [2] Login bem-sucedido. Token JWT recebido."

# Presume USER_ID = 1 (ajuste conforme necessário)
USER_ID=1

# 3) CRUD de Profile
echo
echo "🔹 3) CRUD de Profile"
# 3.1 Criar
echo "   ➤ [3.1] Criando profile para $EMAIL..."
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
  echo "❌ [3.1] Falha ao criar profile (HTTP $PROF_CODE)"
  echo "    $(echo "$PROF_CREATE" | sed '$d')"
  exit 1
fi
echo "✅ [3.1] Profile criado com sucesso."

# 3.2 Ler
echo "   ➤ [3.2] Buscando profile de $EMAIL..."
PROF_GET=$(curl -s -w "\n%{http_code}" \
  -X GET "$BASE_URL/api/profile/$EMAIL" \
  -H "Authorization: Bearer $TOKEN")
PROF_GET_CODE=$(echo "$PROF_GET" | tail -n1)
if [ "$PROF_GET_CODE" -ne 200 ]; then
  echo "❌ [3.2] Falha ao buscar profile (HTTP $PROF_GET_CODE)"
  exit 1
fi
echo "✅ [3.2] Profile encontrado: $(echo "$PROF_GET" | sed '$d')"

# 3.3 Deletar
echo "   ➤ [3.3] Excluindo profile de $EMAIL..."
PROF_DEL=$(curl -s -w "\n%{http_code}" \
  -X DELETE "$BASE_URL/api/profile/$EMAIL" \
  -H "Authorization: Bearer $TOKEN")
PROF_DEL_CODE=$(echo "$PROF_DEL" | tail -n1)
if [ "$PROF_DEL_CODE" -ne 204 ]; then
  echo "❌ [3.3] Falha ao excluir profile (HTTP $PROF_DEL_CODE)"
  exit 1
fi
echo "✅ [3.3] Profile excluído com sucesso."

# 4) CRUD de Poema
echo
echo "🔹 4) CRUD de Poema"
# 4.1 Criar
echo "   ➤ [4.1] Criando poema..."
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
  echo "❌ [4.1] Falha ao criar poema (HTTP $POEM_CREATE_CODE)"
  exit 1
fi
echo "✅ [4.1] Poema criado: ID=$POEM_ID"

# 4.2 Ler
echo "   ➤ [4.2] Lendo poema ID=$POEM_ID..."
POEM_GET=$(curl -s -w "\n%{http_code}" \
  -X GET "$BASE_URL/api/poems/$POEM_ID" \
  -H "Authorization: Bearer $TOKEN")
POEM_GET_CODE=$(echo "$POEM_GET" | tail -n1)
if [ "$POEM_GET_CODE" -ne 200 ]; then
  echo "❌ [4.2] Falha ao ler poema (HTTP $POEM_GET_CODE)"
  exit 1
fi
echo "✅ [4.2] Poema lido: $(echo "$POEM_GET" | sed '$d')"

# 4.3 Atualizar
echo "   ➤ [4.3] Atualizando poema ID=$POEM_ID..."
POEM_UPDATE=$(curl -s -w "\n%{http_code}" \
  -X POST "$BASE_URL/api/poems" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id": '"$POEM_ID"',
    "title": "Meu Poema Editado",
    "text": "Texto atualizado",
    "author": "Autor X",
    "imageUrl": "http://example.com/img2.jpg",
    "postDate": "13/05/2025"
  }')
POEM_UPDATE_CODE=$(echo "$POEM_UPDATE" | tail -n1)
if [ "$POEM_UPDATE_CODE" -ne 200 ]; then
  echo "❌ [4.3] Falha ao atualizar poema (HTTP $POEM_UPDATE_CODE)"
  exit 1
fi
echo "✅ [4.3] Poema atualizado com sucesso."

# 🔹 5) CRUD de Comentário
echo
echo "🔹 5) CRUD de Comentário"
# 5.1 Criar
echo "   ➤ [5.1] Criando comentário para poema ID=$POEM_ID..."
COMMENT_CREATE=$(curl -s -w "\n%{http_code}" \
  -X POST "$BASE_URL/api/comments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "author": "'"$USER"'",
    "content": "Comentário de teste",
    "commentDate": "12/05/2025",
    "poemId": '"$POEM_ID"'
  }')
COMMENT_ID=$(echo "$COMMENT_CREATE" | sed '$d' | jq -r '.id')
COMMENT_CREATE_CODE=$(echo "$COMMENT_CREATE" | tail -n1)
if [ "$COMMENT_CREATE_CODE" -ne 200 ] || [[ -z "$COMMENT_ID" ]]; then
  echo "❌ [5.1] Falha ao criar comentário (HTTP $COMMENT_CREATE_CODE)"
  exit 1
fi
echo "✅ [5.1] Comentário criado: ID=$COMMENT_ID"

# 5.2 Atualizar
echo "   ➤ [5.2] Atualizando comentário ID=$COMMENT_ID..."
COMMENT_UPDATE=$(curl -s -w "\n%{http_code}" \
  -X PUT "$BASE_URL/api/comments/$COMMENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id": '"$COMMENT_ID"',
    "author": "'"$USER"'",
    "content": "Comentário atualizado",
    "commentDate": "13/05/2025",
    "poemId": '"$POEM_ID"'
  }')
COMMENT_UPDATE_CODE=$(echo "$COMMENT_UPDATE" | tail -n1)
if [ "$COMMENT_UPDATE_CODE" -ne 200 ]; then
  echo "❌ [5.2] Falha ao atualizar comentário (HTTP $COMMENT_UPDATE_CODE)"
  exit 1
fi
echo "✅ [5.2] Comentário atualizado com sucesso."

# 5.3 Listar
echo "   ➤ [5.3] Listando comentários para poema ID=$POEM_ID..."
COMMENT_LIST=$(curl -s -w "\n%{http_code}" \
  -X GET "$BASE_URL/api/comments/poem/$POEM_ID" \
  -H "Authorization: Bearer $TOKEN")
COMMENT_LIST_CODE=$(echo "$COMMENT_LIST" | tail -n1)
if [ "$COMMENT_LIST_CODE" -ne 200 ]; then
  echo "❌ [5.3] Falha ao listar comentários (HTTP $COMMENT_LIST_CODE)"
  exit 1
fi
echo "✅ [5.3] Comentários listados: $(echo "$COMMENT_LIST" | sed '$d')"

# 5.4 Deletar
echo "   ➤ [5.4] Excluindo comentário ID=$COMMENT_ID..."
COMMENT_DEL=$(curl -s -w "\n%{http_code}" \
  -X DELETE "$BASE_URL/api/comments/$COMMENT_ID" \
  -H "Authorization: Bearer $TOKEN")
COMMENT_DEL_CODE=$(echo "$COMMENT_DEL" | tail -n1)
if [ "$COMMENT_DEL_CODE" -ne 204 ]; then
  echo "❌ [5.4] Falha ao excluir comentário (HTTP $COMMENT_DEL_CODE)"
  exit 1
fi
echo "✅ [5.4] Comentário excluído com sucesso."

# 4.4 Deletar Poema
echo
echo "🔹 6) Excluindo Poema ID=$POEM_ID..."
POEM_DEL=$(curl -s -w "\n%{http_code}" \
  -X DELETE "$BASE_URL/api/poems/$POEM_ID" \
  -H "Authorization: Bearer $TOKEN")
POEM_DEL_CODE=$(echo "$POEM_DEL" | tail -n1)
if [ "$POEM_DEL_CODE" -ne 204 ]; then
  echo "❌ [6] Falha ao excluir poema (HTTP $POEM_DEL_CODE)"
  exit 1
fi
echo "✅ [6] Poema excluído com sucesso."

# 7) Deletar usuário
echo
echo "🔹 7) Excluindo Usuário ID=$USER_ID..."
USER_DEL_CODE=$(curl -s -w "%{http_code}" -o /dev/null \
  -X DELETE "$BASE_URL/api/auth/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")
if [ "$USER_DEL_CODE" -ne 200 ]; then
  echo "❌ [7] Falha ao excluir usuário (HTTP $USER_DEL_CODE)"
  exit 1
fi
echo "✅ [7] Usuário excluído com sucesso."

echo
echo "===================== Teste Concluído com Sucesso! 🎉 ====================="
