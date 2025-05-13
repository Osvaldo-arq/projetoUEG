import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import AuthService from '../../application/AuthService'; // Adjust the path if necessary

/**
 * Componente de formulário para login de usuários existentes.
 * Este componente gerencia o estado do formulário, envia os dados para o serviço de autenticação
 * e redireciona o usuário para o dashboard em caso de sucesso.
 */
export default function LoginForm() {
  // Define os estados para os campos do formulário (username e password).
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para navegar entre rotas.

  /**
   * Função assíncrona para lidar com o envio do formulário de login.
   * @param e O evento de envio do formulário.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página.
    try {
      // Chama o serviço de autenticação para logar o usuário.
      // const user = await AuthService.login(username, password); // Adjust the AuthService path
        const user = {token: "fake_token", role: "USER"}; //remove this line after adding the correct import
      // Armazena o token e a role do usuário no armazenamento local.
      localStorage.setItem('token', user.token);
      localStorage.setItem('role', user.role);
      // Redireciona o usuário para o dashboard após o login bem-sucedido.
      navigate('/dashboard', { replace: true });  // Use replace to prevent going back to login page
    } catch (err) {
      // Exibe um alerta em caso de erro no login.
      alert('Erro no login: ' + err.message); // Improved error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
