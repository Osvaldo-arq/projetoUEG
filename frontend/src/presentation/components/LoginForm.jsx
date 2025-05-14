import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';           // v6
import AuthService from '../../application/AuthService';   // ajuste o caminho conforme seu projeto

/**
 * Componente de formulário para login de usuários.
 * Este componente gerencia o estado das credenciais de login, exibe um formulário para o usuário
 * inserir seu nome de usuário e senha, realiza a autenticação através do serviço AuthService,
 * salva o token e role do usuário no localStorage e redireciona o usuário para a página
 * apropriada (dashboard do administrador ou do usuário comum) após o login bem-sucedido.
 */
export default function LoginForm() {
  // Define o estado para armazenar as credenciais do usuário (nome de usuário e senha).
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  // Define o estado para armazenar mensagens de erro, se ocorrerem durante o login.
  const [error, setError] = useState(null);
  // Define o estado para controlar se o formulário está em estado de carregamento (durante a autenticação).
  const [loading, setLoading] = useState(false);
  // Inicializa o hook useNavigate do React Router para permitir a navegação entre páginas.
  const navigate = useNavigate();

  /**
   * Função para atualizar o estado das credenciais quando os campos do formulário são alterados.
   * @param e O evento de mudança do campo do formulário.
   */
  const onChange = (e) => {
    // Atualiza o estado 'credentials' com o novo valor do campo.
    // O nome do campo (username ou password) é usado como chave para atualizar o valor correto.
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(null); // Limpa qualquer erro anterior ao digitar nos campos.
  };

  /**
   * Função assíncrona para lidar com o envio do formulário de login.
   * Realiza a autenticação do usuário através do serviço AuthService e, em caso de sucesso,
   * salva o token e role do usuário no localStorage e redireciona para a página apropriada.
   * @param e O evento de envio do formulário.
   */
  const onSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página).
    setLoading(true); // Define o estado de carregamento como verdadeiro para exibir feedback ao usuário.
    setError(null); // Limpa qualquer erro anterior.

    try {
      // Chama o serviço AuthService para realizar o login do usuário.
      const user = await AuthService.login(credentials.username, credentials.password);
      // Salva o token JWT no localStorage para autenticação em requisições futuras.
      localStorage.setItem('token', user.token);
      // Salva o role do usuário no localStorage para determinar a página de redirecionamento.
      localStorage.setItem('role', user.role);

      // Redireciona o usuário para a página apropriada com base no seu role.
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard'); // Redireciona administradores para o dashboard do administrador.
      } else {
        navigate('/user/dashboard'); // Redireciona usuários comuns para o dashboard do usuário.
      }
    } catch (err) {
      // Captura erros durante o processo de login (por exemplo, credenciais inválidas).
      setError(err.message); // Define a mensagem de erro a ser exibida.
    } finally {
      setLoading(false); // Define o estado de carregamento como falso após a conclusão do processo (sucesso ou falha).
    }
  };

  // Renderiza o formulário de login.
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Usuário:</label>
        <input
          name="username"
          value={credentials.username}
          onChange={onChange}
          required // Campo obrigatório.
        />
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={onChange}
          required // Campo obrigatório.
        />
      </div>
      {/* Exibe a mensagem de erro, se houver. */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {/* Botão de envio do formulário.  Desabilitado enquanto o formulário está carregando. */}
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Login'} {/* Exibe texto diferente durante o carregamento. */}
      </button>
    </form>
  );
}
