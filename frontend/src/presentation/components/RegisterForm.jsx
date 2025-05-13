import React, { useState } from 'react';
//import AuthService from '../../application/AuthService'; // Ajustar o caminho conforme necessário
import { useNavigate } from 'react-router-dom';

/**
 * Componente de formulário para registar novos utilizadores.
 * Este componente gere o estado do formulário, envia os dados para o serviço de autenticação,
 * valida a confirmação da palavra-passe e exibe mensagens de erro.
 */
export default function RegisterForm() {
  // Define os estados para os campos do formulário (nome de utilizador, email, palavra-passe, confirmarPalavraPasse) e para o erro.
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null); // Estado para armazenar mensagens de erro.
  const navigate = useNavigate(); // Hook para navegar entre rotas.

  /**
   * Função assíncrona para lidar com o envio do formulário de registo.
   * @param e O evento de envio do formulário.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página.

    // 1) Validação da confirmação da palavra-passe
    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }

    try {
      // 2) Chama o serviço de registo (AuthService).
      const token = await new Promise(resolve => setTimeout(() => resolve("fake_token"), 500)); //remover esta linha depois de adicionar a importação correta
      //const token = await AuthService.register(username, email, password); // Ajustar o caminho do AuthService
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'USER');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Exibe erro vindo do backend (e.g., utilizador já existe)
      setError(err.message || 'Erro no registo.'); // Garante que há uma mensagem de erro.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registo</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <input
        placeholder="Nome de Utilizador"
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
        placeholder="Palavra-Passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Confirmar Palavra-Passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button type="submit">Registar</button>
    </form>
  );
}
