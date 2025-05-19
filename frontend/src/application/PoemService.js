// src/application/PoemService.js
import HttpClient from '../infrastructure/HttpClient'; // Importa o módulo HttpClient para fazer requisições HTTP.

const API = ''; // proxy CRA

const PoemService = {
  /**
   * Obtém a lista de todos os poemas.
   * @returns Promise<PoemDto[]>
   */
  listAll: () =>
    HttpClient.get(`${API}/api/poems`, localStorage.getItem('token')),

  /**
   * Obtém a lista de poemas curtidos pelo usuário autenticado.
   * @returns Promise<PoemDto[]>
   */
  listLiked: () =>
    HttpClient.get(`${API}/api/poems/liked`, localStorage.getItem('token')),

  /**
   * Obtém um poema específico pelo seu ID.
   * @param {number} id - ID do poema.
   * @returns Promise<PoemDto>
   */
  getById: (id) =>
    HttpClient.get(`${API}/api/poems/${id}`, localStorage.getItem('token')),

  /**
   * Cria um novo poema.
   * @param {PoemDto} dto - Dados do poema.
   * @returns Promise<PoemDto>
   */
  create: async (dto) => {
    const res = await HttpClient.post(
      `${API}/api/poems`,
      dto,
      localStorage.getItem('token')
    );
    return res.json();
  },

  /**
   * Atualiza um poema existente pelo seu ID.
   * @param {number} id - ID do poema.
   * @param {PoemDto} dto - Dados do poema.
   * @returns Promise<PoemDto>
   */
  update: async (id, dto) => {
    const res = await HttpClient.post(
      `${API}/api/poems`,
      dto,
      localStorage.getItem('token')
    );
    return res.json();
  },

  /**
   * Exclui um poema pelo seu ID.
   * @param {number} id - ID do poema.
   * @returns Promise<void>
   */
  deleteById: (id) =>
    HttpClient.delete(`${API}/api/poems/${id}`, localStorage.getItem('token')),
};

export default PoemService;
