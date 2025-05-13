export class User {
  /**
   * Classe que representa um usuário da aplicação.
   * @param username O nome de usuário do usuário.
   * @param token O token de autenticação do usuário.
   * @param role A role do usuário (por padrão, 'USER').
   */
  constructor(username, token, role = 'USER') {
    this.username = username; // Nome de usuário do usuário.
    this.token = token;    // Token de autenticação do usuário.
    this.role = role;      // Role do usuário (pode ser 'USER', 'ADMIN', etc.).
  }
}
