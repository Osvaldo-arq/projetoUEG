import HttpClient from '../infrastructure/HttpClient';
const API = '';

const LikeService = {
  countLikes: (poemId) =>
    HttpClient.get(`${API}/api/poems/${poemId}/likes`, localStorage.getItem('token')),

  hasLiked: async (poemId) => {
    try {
      const response = await HttpClient.get(
        `${API}/api/poems/${poemId}/likes/user`,
        localStorage.getItem('token')
      );
      // Assumindo que a API retorna um objeto JSON com a chave 'liked' (boolean)
      return response.liked;
    } catch (error) {
      console.error('Erro ao verificar se curtiu:', error);
      return false; // Em caso de erro na requisição, assume que não curtiu
    }
  },

  like: (poemId) =>
    HttpClient.post(
      `${API}/api/poems/${poemId}/like`,
      null,
      localStorage.getItem('token')
    ),

  unlike: (poemId) =>
    HttpClient.delete(
      `${API}/api/poems/${poemId}/like`,
      localStorage.getItem('token')
    ),
};

export default LikeService;