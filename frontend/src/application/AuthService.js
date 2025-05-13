import HttpClient from '../infrastructure/HttpClient';
import { User } from '../domain/User';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Serviço de autenticação para lidar com o registro e login de usuários.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  /**
   * Registra um novo usuário.
   * @param username O nome de usuário do novo usuário.
   * @param email O email do novo usuário.
   * @param password A senha do novo usuário.
   * @returns Uma Promise que resolve com o token JWT retornado pelo servidor.
   */
  register: async (username, email, password) => {
    // Envia uma requisição POST para a rota de registro da API.
    const res = await HttpClient.post(`${API}/api/auth/register`, {
      username,
      email,
      password,
      confirmPassword: password, // Envia a senha de confirmação igual à senha.
      role: 'USER',                 // Define a role padrão como 'USER'.
    });
    if (!res.ok) {
      throw new Error('Failed to register user');
    }
    const data = await res.json(); // Assume the response contains JSON data.
    return data.token; // Retorna o token JWT do corpo da resposta.
  },

   /**
   * Loga um usuário existente.
   * @param username O nome de usuário do usuário que está logando.
   * @param password A senha do usuário.
   * @returns Uma Promise que resolve com um objeto User contendo informações do usuário e o token.
   */
  login: async (username, password) => {
    const res = await HttpClient.post(`${API}/api/auth/login`, {
      username,
      password,
    });
    if (!res.ok) {
      throw new Error('Failed to log in');
    }
    const data = await res.json(); // Assume the response contains JSON data.
    const token = data.token; // Obtém o token do corpo da resposta.
    const role = data.role || 'USER'; // Assume que a role está no corpo da resposta.
    // Cria e retorna uma instância da classe User com as informações do usuário e o token.
    return new User(username, token, role);
  },
}
