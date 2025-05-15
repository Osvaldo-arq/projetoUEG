import HttpClient from '../infrastructure/HttpClient'; // Importa o módulo HttpClient para fazer requisições HTTP.

const API = ''; // proxy CRA
// Define a URL base da API.  O proxy do Create React App (CRA) irá redirecionar as requisições para 'http://localhost:8080'.

const PoemService = {
  /**
   * Obtém a lista de todos os poemas.
   * @returns Uma Promise que resolve com a resposta da API, contendo a lista de poemas.
   */
  listAll: () =>
    HttpClient.get(`${API}/api/poems`, localStorage.getItem('token')),
    // Usa o HttpClient para fazer uma requisição GET para '/api/poems'.
    // O token de autenticação é obtido do localStorage.

  /**
   * Obtém um poema específico pelo seu ID.
   * @param id O ID do poema a ser obtido.
   * @returns Uma Promise que resolve com a resposta da API, contendo o poema (PoemDto).
   */
  getById: (id) =>
    HttpClient.get(`${API}/api/poems/${id}`, localStorage.getItem('token')),
    // Usa o HttpClient para fazer uma requisição GET para '/api/poems/{id}'.
    // O token de autenticação é obtido do localStorage.

  /**
   * Cria um novo poema.
   * @param dto Objeto PoemDto contendo os dados do poema a ser criado.
   * @returns Uma Promise que resolve com a resposta da API, contendo o PoemDto criado.
   */
  create: async (dto) => {
    const res = await HttpClient.post(
      `${API}/api/poems`,
      dto,
      localStorage.getItem('token')
    );
    // Usa o HttpClient para fazer uma requisição POST para '/api/poems'.
    // O token de autenticação é obtido do localStorage.
    return res.json(); // Analisa a resposta como JSON e a retorna.
  },

  /**
   * Atualiza um poema existente pelo seu ID.
   * @param id O ID do poema a ser atualizado.
   * @param dto Objeto PoemDto contendo os dados atualizados do poema.
   * @returns Uma Promise que resolve com a resposta da API, contendo o PoemDto atualizado.
   */
  update: async (id, dto) => {
    const res = await HttpClient.post( // Atenção: Usando POST conforme o seu controlador `upsertPoem`
      `${API}/api/poems`,
      dto,
      localStorage.getItem('token')
    );
    // Usa o HttpClient para fazer uma requisição POST para '/api/poems'.
    // O token de autenticação é obtido do localStorage.
    return res.json(); // Analisa a resposta como JSON e a retorna.
  },

  /**
   * Exclui um poema pelo seu ID.
   * @param id O ID do poema a ser excluído.
   * @returns Uma Promise que resolve quando a exclusão for bem-sucedida.
   * @throws {Error} Se a exclusão falhar (status da resposta não for 204).
   */
  deleteById: (id) =>
    fetch(`${API}/api/poems/${id}`, {
      method: 'DELETE', // Especifica o método HTTP como DELETE.
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Inclui o token de autenticação no cabeçalho.
    }).then((res) => {
      // Usa a API fetch para fazer a requisição DELETE.
      if (res.status !== 204) throw new Error('Falha ao excluir poema');
      // Verifica o status da resposta.  204 significa "No Content" (exclusão bem-sucedida, sem conteúdo retornado).
      // Se o status não for 204, lança um erro.
    }),
};

export default PoemService; // Exporta o objeto PoemService para ser usado em outros módulos.