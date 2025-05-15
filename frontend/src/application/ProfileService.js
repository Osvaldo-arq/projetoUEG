
import HttpClient from '../infrastructure/HttpClient';

const API = ''; // proxy CRA

const ProfileService = {
  /**
   * Obtém a lista de todos os perfis.
   */
  listAll: () =>
    HttpClient.get(`${API}/api/profile`, localStorage.getItem('token')),

  /**
   * Cria um novo perfil.
   * @param {Object} profile - Objeto com campos firstName, lastName, phone, userEmail
   */
  create: (profile) =>
    HttpClient.post(`${API}/api/profile`, profile, localStorage.getItem('token')),

  /**
   * Deleta um perfil pelo email do usuário.
   * @param {string} email - Email do perfil a ser deletado
   */
  deleteByEmail: (email) =>
    fetch(`${API}/api/profile/${email}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((res) => {
      if (res.status !== 204) throw new Error('Falha ao excluir perfil');
    }),
};

export default ProfileService;