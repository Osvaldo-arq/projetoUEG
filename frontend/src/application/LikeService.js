import HttpClient from '../infrastructure/HttpClient';
const API = '';

const LikeService = {
  /**
   * Retorna o número de curtidas de um poema.
   * @param {number|string} poemId
   * @returns {Promise<number>}
   */
  countLikes: async (poemId) => {
    const token = localStorage.getItem('token');
    const count = await HttpClient.get(
      `${API}/api/poems/${poemId}/likes`,
      token
    );
    return count;
  },

  /**
   * Verifica se o usuário atualmente logado já curtiu o poema.
   * @param {number|string} poemId
   * @returns {Promise<boolean>}
   */
hasLiked: async (poemId) => {
  try {
    // Retorna diretamente o booleano retornado pela API
    return await HttpClient.get(
      `${API}/api/poems/${poemId}/likes/user`,
      localStorage.getItem('token')
    );
  } catch (error) {
    console.error('Erro ao verificar se curtiu:', error);
    return false;
  }
},


  /**
   * Adiciona uma curtida ao poema.
   * @param {number|string} poemId
   * @returns {Promise<void>}
   */
  like: async (poemId) => {
    const token = localStorage.getItem('token');
    await HttpClient.post(
      `${API}/api/poems/${poemId}/like`,
      null,
      token
    );
  },

  /**
   * Remove a curtida do poema.
   * @param {number|string} poemId
   * @returns {Promise<void>}
   */
  unlike: async (poemId) => {
    const token = localStorage.getItem('token');
    await HttpClient.delete(
      `${API}/api/poems/${poemId}/like`,
      token
    );
  },
};

export default LikeService;
