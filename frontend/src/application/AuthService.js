import HttpClient from '../infrastructure/HttpClient';
import { parseJwt } from '../infrastructure/jwt';
import { User } from '../domain/User';

const API = '/api';

const AuthService = {
  /**
   * Realiza o login de um usuário.
   * @param {string} username - O nome de usuário do usuário.
   * @param {string} password - A senha do usuário.
   * @returns {Promise<User>} - Uma Promise que resolve com um objeto User contendo informações do usuário e o token.
   * @throws {Error} - Se o login falhar, lança um erro com a mensagem de erro da API ou uma mensagem padrão.
   */
  login: async (username, password) => {
    const payload = { username, password };
    // Envia uma requisição POST para o endpoint de login da API.
    const res = await HttpClient.post(`${API}/auth/login`, payload);

    // Verifica se a resposta da API indica sucesso (status 200-299).
    if (!res.ok) {
      // Se a resposta não for OK, obtém o texto do erro da resposta.
      const errorText = await res.text();
      // Lança um erro com a mensagem de erro da API ou uma mensagem padrão.
      throw new Error(errorText || 'Falha no login');
    }

    // Se o login for bem-sucedido, obtém os dados da resposta.  Espera-se que seja um JSON contendo token e email.
    const responseData = await res.json();
    const { token, email } = responseData;

    // Decodifica o token JWT para obter os claims (informações) do usuário, incluindo o role.
    const claims = parseJwt(token);
    // Obtém o role do usuário dos claims, ou usa 'USER' como padrão se o role não estiver presente.
    const role = claims.role || 'USER';

    // Armazena o token, email e username no localStorage.
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', username); // Armazena o nome de usuário

    // Retorna um novo objeto User com o nome de usuário, token, role e email.
    return new User(username, token, role, email);
  },

  /**
   * Registra um novo usuário.
   * @param {string} username - O nome de usuário do novo usuário.
   * @param {string} email - O email do novo usuário.
   * @param {string} password - A senha do novo usuário.
   * @returns {Promise<string>} - Uma Promise que resolve com o token JWT retornado pela API.
   * @throws {Error} - Se o registro falhar, lança um erro com a mensagem de erro da API ou uma mensagem padrão.
   */
  register: async (username, email, password) => {
    const payload = { username, email, password, confirmPassword: password, role: 'USER' };
    // Envia uma requisição POST para o endpoint de registro da API.
    const res = await HttpClient.post(`${API}/auth/register`, payload);

    // Verifica se a resposta da API indica sucesso (status 200-299).
    if (!res.ok) {
      // Se a resposta não for OK, obtém o texto do erro da resposta.
      const errorText = await res.text();
      // Lança um erro com a mensagem de erro da API ou uma mensagem padrão.
      throw new Error(errorText || 'Falha no registro');
    }

    // Se o registro for bem-sucedido, obtém o token da resposta.
    const responseData = await res.text();
    return responseData;
  },
};

export default AuthService;
