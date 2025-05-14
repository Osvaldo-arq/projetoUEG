import HttpClient from '../infrastructure/HttpClient';
import { parseJwt } from '../infrastructure/jwt';
import { User } from '../domain/User';

const API = ''; // CRA proxy

const AuthService = {
  /**
   * Registra um novo usuário.
   * @param username Nome de usuário do usuário a ser registrado.
   * @param email Email do usuário.
   * @param password Senha do usuário.
   * @returns Uma Promise que resolve com o token JWT retornado pela API.
   */
  register: async (username, email, password) => {
    const payload = { username, email, password, confirmPassword: password, role: 'USER' };
    console.log('AuthService.register →', payload); // Log da requisição de registro.
    const res = await HttpClient.post(`${API}/api/auth/register`, payload); // Envia a requisição POST para registrar o usuário.
    const token = await res.text(); // Extrai o token da resposta.
    console.log('AuthService.register ← token', token); // Log do token recebido.
    return token; // Retorna o token JWT.
  },

  /**
   * Realiza o login do usuário.
   * @param username Nome de usuário para login.
   * @param password Senha para login.
   * @returns Uma Promise que resolve com um objeto User contendo informações do usuário e o token.
   */
  login: async (username, password) => {
    const payload = { username, password };
    console.log('AuthService.login →', payload); // Log da requisição de login.
    const res = await HttpClient.post(`${API}/api/auth/login`, payload); // Envia a requisição POST para o endpoint de login.
    const token = await res.text(); // Obtém o token da resposta.
    console.log('AuthService.login ← token', token); // Log do token recebido.

    // Decodifica o role do próprio JWT
    const claims = parseJwt(token); // Chama a função parseJwt para decodificar o token.
    console.log('AuthService.login ← claims', claims); // Log dos claims (informações) do token decodificado.
    const role = claims.role || 'USER'; // Obtém o role do token, ou usa 'USER' como padrão.
    console.log('AuthService.login ← role', role); // Log do role do usuário.

    return new User(username, token, role); // Retorna um novo objeto User com as informações.
  },
};

export default AuthService; // Exporta o objeto AuthService para ser utilizado em outros módulos.
