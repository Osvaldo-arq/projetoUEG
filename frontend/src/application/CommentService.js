// ../infrastructure/CommentService.js

import HttpClient from '../infrastructure/HttpClient'; // Importa a classe HttpClient para fazer requisições HTTP
const API = ''; // Define uma constante para a URL base da API (pode estar vazia se a rota for completa)

const CommentService = {
  /**
   * Lista os comentários de um poema específico.
   * @param {number} poemId - O ID do poema para o qual buscar os comentários.
   * @returns {Promise<Array>} Uma Promise que resolve para um array de objetos de comentário.
   */
  listByPoem: (poemId) =>
    HttpClient.get(
      `${API}/api/comments/poem/${poemId}`, // Endpoint da API para listar comentários por ID do poema
      localStorage.getItem('token') // Envia o token de autenticação (se existir) no cabeçalho da requisição
    ),

  /**
   * Cria um novo comentário.
   * @param {object} payload - Um objeto contendo os dados do novo comentário.
   * @param {number} payload.poemId - O ID do poema ao qual o comentário pertence.
   * @param {string} payload.content - O conteúdo do comentário.
   * @param {string} [payload.author] - O nome do autor do comentário (opcional, pode ser obtido do token).
   * @returns {Promise<object>} Uma Promise que resolve para o objeto do comentário criado.
   */
  create: async ({ poemId, content, author }) => {
    const res = await HttpClient.post(
        `${API}/api/comments`, // Endpoint da API para criar um novo comentário
        { poemId, content, author }, // Corpo da requisição com os dados do comentário
        localStorage.getItem('token') // Envia o token de autenticação (se existir) no cabeçalho da requisição
    );
    return res.json(); // Retorna o corpo da resposta como JSON
    },

  /**
   * Atualiza um comentário existente.
   * @param {number} id - O ID do comentário a ser atualizado.
   * @param {object} payload - Um objeto contendo os dados de atualização do comentário.
   * @param {string} payload.content - O novo conteúdo do comentário.
   * @returns {Promise<object>} Uma Promise que resolve para o objeto do comentário atualizado.
   */
  update: async (id, { content }) => {
    const res = await HttpClient.put(
      `${API}/api/comments/${id}`, // Endpoint da API para atualizar um comentário específico (usa o ID)
      { content }, // Corpo da requisição com o novo conteúdo
      localStorage.getItem('token') // Envia o token de autenticação (se existir) no cabeçalho da requisição
    );
    return res.json(); // Retorna o corpo da resposta como JSON
  },

  /**
   * Exclui um comentário existente.
   * @param {number} id - O ID do comentário a ser excluído.
   * @returns {Promise<void>} Uma Promise que resolve quando o comentário é excluído com sucesso.
   */
  delete: async (id) => {
    return await HttpClient.delete(
      `${API}/api/comments/${id}`, // Endpoint da API para excluir um comentário específico (usa o ID)
      localStorage.getItem('token') // Envia o token de autenticação (se existir) no cabeçalho da requisição
    );
    // A função HttpClient.delete provavelmente já lida com erros na camada HTTP.
    // Se você precisar de tratamento de erro específico aqui (ex: para códigos de status),
    // pode adicionar um try/catch e verificar a resposta do HttpClient.
  },
};

export default CommentService; // Exporta o objeto CommentService para ser usado em outros módulos