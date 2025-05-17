import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../application/AuthService';
import { AuthContext } from '../../context/AuthContext';
import styles from '../../styles/LoginForm.module.css';

/**
 * Componente LoginForm:
 *
 * Este componente representa o formulário de login da aplicação. Ele permite que os usuários
 * insiram suas credenciais (nome de usuário e senha) para autenticar e acessar a aplicação.
 */
export default function LoginForm() {
  // Declaração de estados:
  // - credentials: Armazena o nome de usuário e senha digitados pelo usuário.
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  // - error: Armazena qualquer mensagem de erro que possa ocorrer durante o processo de login.
  const [error, setError] = useState(null);
  // - loading: Indica se o formulário está em estado de carregamento (por exemplo, aguardando resposta do servidor).
  const [loading, setLoading] = useState(false);

  // Inicialização do hook useNavigate do React Router para permitir a navegação entre rotas.
  const navigate = useNavigate();

  // Utilização do contexto de autenticação para acessar a função de login.
  // O contexto AuthContext fornece a função login, que é responsável por atualizar o estado de autenticação global.
  const { login } = useContext(AuthContext);

  /**
   * Função onChange:
   *
   * Atualiza o estado 'credentials' com os valores dos campos de entrada do formulário.
   * Por exemplo, quando o usuário digita no campo "Usuário", esta função atualiza
   * o valor de 'credentials.username'.  Além disso, limpa o estado de 'error'.
   *
   * @param e O evento de mudança do campo de entrada.
   */
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(null); // Limpa o erro ao digitar.
  };

  /**
   * Função onSubmit:
   *
   * Lida com o envio do formulário de login.  Chama o serviço de autenticação,
   * atualiza o estado de loading e, em caso de sucesso, chama a função login do contexto
   * e navega para o dashboard do usuário. Em caso de erro, atualiza o estado de error.
   *
   * @param e O evento de envio do formulário.
   */
  const onSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página).
    setLoading(true);    // Define o estado de carregamento para true (exibe "Entrando...").
    setError(null);      // Limpa qualquer erro anterior.

    try {
      // Chama o serviço de autenticação (AuthService) para realizar o login.
      // A função AuthService.login retorna uma Promise que resolve com os dados do usuário (incluindo token e role).
      const user = await AuthService.login(credentials.username, credentials.password);
      // Chama a função login do contexto de autenticação para atualizar o estado global de autenticação.
      // Isso faz com que o componente AuthProvider (que envolve a aplicação) saiba que o usuário está logado.
      login(user.token, user.role);
      // Redireciona o usuário para a página de dashboard apropriada com base no seu role.
      // Por exemplo, se o usuário for um "ADMIN", ele será redirecionado para "/admin/dashboard".
      navigate(`/${user.role.toLowerCase()}/`, { replace: true }); // O replace: true substitui a página atual no histórico de navegação.
    } catch (err) {
      // Captura qualquer erro que ocorra durante o processo de login (por exemplo, credenciais inválidas).
      setError(err.message); // Atualiza o estado de erro com a mensagem de erro.
    } finally {
      setLoading(false);   // Define o estado de carregamento para false (remove "Entrando...").
    }
  };

  // Renderização do componente:
  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}> 
        <div className={styles.formDiv}> 
          <label htmlFor="username" className={styles.label}>Usuário:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={onChange}
            required
            className={styles.input} 
          />
        </div>
        <div className={styles.formDiv}>
          <label htmlFor="password" className={styles.label}>Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={onChange}
            required
            className={styles.input} 
          />
        </div>
        {error && <div className={styles.error}>{error}</div>} 
        <button type="submit" disabled={loading} className={styles.button}> 
          {loading ? 'Entrando...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

