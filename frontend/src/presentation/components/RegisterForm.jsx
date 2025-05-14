import React, { useState } from 'react';
import AuthService from '../../application/AuthService';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  // Define o estado para armazenar os dados de registro do usuário.
  const [username, setUsername]           = useState(''); // Usado para armazenar o nome de usuário
  const [email, setEmail]                 = useState(''); // Usado para armazenar o email do usuário
  const [password, setPassword]           = useState(''); // Usado para armazenar a senha do usuário
  const [confirmPassword, setConfirmPass] = useState(''); // Usado para armazenar a confirmação da senha
  const [error, setError]                 = useState(null); // Usado para armazenar mensagens de erro
  const navigate = useNavigate();           // Usado para redirecionar o usuário após o registro

  /**
   * Função assíncrona para lidar com o envio do formulário de registro.
   * Realiza a validação da confirmação de senha e, em caso de sucesso,
   * chama o serviço AuthService para registrar o usuário, salva o token no localStorage
   * e redireciona para a página de dashboard.
   */
  const onSubmit = async e => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)
    setError(null);      // Limpa qualquer erro anterior

    // Validação da confirmação de senha
    if (password !== confirmPassword) {
      setError('Senhas não coincidem'); // Define uma mensagem de erro se as senhas não coincidirem
      return;                           // Impede a continuação do processo de registro
    }

    try {
      console.log('RegisterForm submit', { username, email }); // Log para depuração
      // Chama o serviço AuthService para registrar o usuário
      const token = await AuthService.register(username, email, password);
      console.log('RegisterForm received token', token); // Log do token recebido

      localStorage.setItem('token', token); // Armazena o token no localStorage para uso futuro
      localStorage.setItem('role',  'USER');    // Armazena a role do usuário

      navigate('/dashboard', { replace: true }); // Redireciona o usuário para o dashboard
    } catch (err) {
      console.error('RegisterForm error', err); // Log de erros
      setError(err.message || 'Erro no cadastro'); // Define a mensagem de erro a ser exibida
    }
  };

  // Renderiza o formulário de registro.
  return (
    <form onSubmit={onSubmit}>
      <h2>Cadastro</h2>
      {/* Exibe a mensagem de erro, se houver */}
      {error && <div style={{color:'red'}}>{error}</div>}

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required // Campo obrigatório
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required // Campo obrigatório
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required // Campo obrigatório
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPass(e.target.value)} // Campo de confirmação de senha
        required // Campo obrigatório
      />

      <button type="submit">Registrar</button> {/* Botão para enviar o formulário */}
    </form>
  );
}
