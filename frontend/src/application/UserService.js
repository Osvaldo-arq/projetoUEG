// src/application/UserService.js
import HttpClient from '../infrastructure/HttpClient';

const API = ''; // proxy CRA

const UserService = {
  /**
   * Obtém a lista de todos os usuários.
   */
  listAll: () =>
    HttpClient.get(`${API}/api/auth/users`, localStorage.getItem('token')),

  /**
   * Cria um novo usuário.
   * @param {Object} userData - Objeto com os dados do usuário (username, email, password, role).
   */
  create: (userData) =>
    HttpClient.post(`${API}/api/auth/register`, userData, localStorage.getItem('token')),

  /**
   * Atualiza os dados de um usuário existente.
   * @param {number} id - ID do usuário a ser atualizado.
   * @param {Object} userData - Objeto com os novos dados do usuário.
   */
  update: (id, userData) =>
    HttpClient.put(`${API}/api/auth/${id}`, userData, localStorage.getItem('token')),

  /**
   * Deleta um usuário pelo seu ID.
   * @param {number} id - ID do usuário a ser deletado.
   */
  deleteById: (id) =>
    HttpClient.delete(`${API}/api/auth/${id}`, localStorage.getItem('token')),

  /**
   * Obtém um usuário pelo seu ID (opcional, dependendo da necessidade).
   * @param {number} id - ID do usuário a ser buscado.
   */
  getById: (id) =>
    HttpClient.get(`${API}/api/auth/${id}`, localStorage.getItem('token')),
};

export default UserService;