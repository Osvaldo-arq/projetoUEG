import React, { useState } from 'react';
import AuthService from '../../application/AuthService'; // Importa o serviço de autenticação.
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate para redirecionamento.

/**
 * Componente de formulário para registro de novos usuários.
 * Este componente gerencia o estado do formulário, realiza a validação da confirmação de senha,
 * e envia os dados para registro através do serviço de autenticação.
 */
export default function RegisterForm() {
  // Define os estados para os campos do formulário e para exibir erros.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null); // Estado para armazenar mensagens de erro.
  const navigate = useNavigate(); // Inicializa o hook useNavigate para permitir a navegação.

  /**
   * Função assíncrona para lidar com o envio do formulário de registro.
   * Realiza a validação da confirmação de senha e chama o serviço de autenticação para registrar o usuário.
   * @param e O evento de envio do formulário.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página).
    console.log('FormSubmit→', { username, email, password, confirmPassword }); // Log para depuração.

    // Validação da confirmação de senha.
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.'); // Define o erro se as senhas não coincidirem.
      return; // Interrompe o processo de registro.
    }

    try {
      // Chama o serviço de autenticação para registrar o usuário.
      const token = await AuthService.register(username, email, password);
      console.log('FormSubmit← token:', token); // Log do token retornado.
      localStorage.setItem('token', token); // Armazena o token no localStorage.
      localStorage.setItem('role', 'USER'); // Armazena a role do usuário no localStorage.
      navigate('/dashboard', { replace: true }); // Redireciona para o dashboard após o registro bem-sucedido.
    } catch (err) {
      // Captura erros durante o registro (por exemplo, usuário já existe).
      console.error('FormSubmit ERROR:', err); // Log do erro.
      setError(err.message || 'Erro no cadastro.'); // Define a mensagem de erro a ser exibida.
    }
  };

  // Renderiza o formulário de registro.
  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro</h2>
      {/* Exibe a mensagem de erro, se houver. */}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Campos de entrada para nome de usuário, email, senha e confirmação de senha. */}
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required // Campo obrigatório.
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required // Campo obrigatório.
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required // Campo obrigatório.
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required // Campo obrigatório.
      />

      <button type="submit">Registrar</button> {/* Botão para enviar o formulário. */}
    </form>
  );
}
