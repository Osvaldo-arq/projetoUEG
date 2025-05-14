import HttpClient from '../infrastructure/HttpClient'; // Importa o módulo HttpClient para fazer requisições HTTP.
import { User } from '../domain/User'; // Importa a classe User do arquivo '../domain/User'.

const API = ''; // proxy CRA fará http://localhost:8080
// Define a URL base da API.  O proxy do Create React App (CRA) irá redirecionar as requisições para 'http://localhost:8080'.

const AuthService = {
  /**
   * Função para registrar um novo usuário.
   * @param username O nome de usuário do novo usuário.
   * @param email O email do novo usuário.
   * @param password A senha do novo usuário.
   * @returns Uma Promise que resolve com o token JWT retornado pela API.
   */
  register: async (username, email, password) => {
    const payload = { username, email, password, confirmPassword: password, role: 'USER' };
    // Cria o payload (corpo da requisição) com os dados do usuário a serem enviados para o registro.
    console.log('AuthService→ register payload:', payload);
    // Imprime o payload no console para fins de depuração.
    const res = await HttpClient.post(`${API}/api/auth/register`, payload);
    // Envia uma requisição POST para a API para registrar o usuário.  A URL completa é construída usando a constante API e a rota '/api/auth/register'.
    const token = await res.text();
    // Extrai o token JWT da resposta da API.  Espera-se que a resposta seja um texto contendo o token.
    console.log('AuthService← register token:', token);
    // Imprime o token retornado pela API.
    return token; // Retorna o token JWT.
  },

  /**
   * Função para autenticar um usuário existente (login).
   * @param username O nome de usuário do usuário que está fazendo login.
   * @param password A senha do usuário.
   * @returns Uma Promise que resolve com um objeto User contendo os dados do usuário e o token JWT.
   */
  login: async (username, password) => {
    const payload = { username, password };
    // Cria o payload com o nome de usuário e senha para a requisição de login.
    console.log('AuthService→ login payload:', payload);
    // Imprime o payload no console.
    const res = await HttpClient.post(`${API}/api/auth/login`, payload);
    // Envia uma requisição POST para a API para autenticar o usuário.
    const token = await res.text();
    // Obtém o token JWT da resposta.
    console.log('AuthService← login token:', token);
    // Imprime o token.
    const role = res.headers.get('Role') || 'USER';
    // Obtém a role do usuário do cabeçalho da resposta. Se o cabeçalho 'Role' não estiver presente, assume 'USER' como padrão.
    return new User(username, token, role);
    // Cria um novo objeto User com o nome de usuário, token e role, e o retorna.
  },
};

export default AuthService;
