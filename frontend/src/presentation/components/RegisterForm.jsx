import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import AuthService from '../../application/AuthService'; // Adjust the path if necessary

/**
 * Componente de formulário para registro de novos usuários.
 * Este componente gerencia o estado do formulário, envia os dados para o serviço de autenticação
 * e redireciona o usuário para o dashboard em caso de sucesso.
 */
export default function RegisterForm() {
  // Define os estados para os campos do formulário (username, email e password).
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para navegar entre rotas.

  /**
   * Função assíncrona para lidar com o envio do formulário de registro.
   * @param e O evento de envio do formulário.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página.
    try {
      // Chama o serviço de autenticação para registrar o usuário.
      //const token = await AuthService.register(username, email, password); // Adjust the AuthService
        const token = "fake_token"; //remove this line after adding the correct import
      // Armazena o token e a role do usuário no armazenamento local.
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'USER');
      // Redireciona o usuário para o dashboard após o registro bem-sucedido.
      navigate('/dashboard', { replace: true }); // Use replace to prevent going back to the register page
    } catch (err) {
      // Exibe um alerta em caso de erro no registro.
      alert('Erro no cadastro: ' + err.message); // Improved error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
}
