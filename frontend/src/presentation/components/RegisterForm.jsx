import React, { useState } from 'react';
import AuthService from '../../application/AuthService';       // Importa o serviço de autenticação
import ProfileService from '../../application/ProfileService'; // Importa o serviço de perfil
import styles from '../../styles/RegisterForm.module.css'; // Importa os estilos CSS do componente

/**
 * Componente RegisterForm:
 *
 * Este componente exibe um formulário para o usuário se registrar na aplicação.
 * Ele coleta informações como nome de usuário, email, senha, nome, sobrenome e telefone.
 */
export default function RegisterForm({ onSuccess }) {
  // Variáveis de estado para armazenar os valores dos campos do formulário
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPass] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null); // Estado para armazenar mensagens de erro

  // Função para lidar com o envio do formulário
  const onSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)
    setError(null); // Limpa qualquer erro anterior

    // Validação: verifica se as senhas coincidem
    if (password !== confirmPassword) {
      setError('Senhas não coincidem');
      return;
    }

    try {
      // 1) Cria o usuário e recebe o token de autenticação
      const token = await AuthService.register(username, email, password);
      localStorage.setItem('token', token); // Armazena o token no localStorage
      localStorage.setItem('role', 'USER'); // Armazena a role do usuário

      // 2) Cria o perfil associado ao usuário
      await ProfileService.create({ firstName, lastName, phone, userEmail: email });

      // 3) Volta para a página inicial através do callback onSuccess
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('RegisterForm error', err); // Imprime o erro no console para debugging
      setError(err.message || 'Erro no cadastro'); // Define a mensagem de erro a ser exibida
    }
  };

  // Renderiza o formulário de registro
  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2>Cadastro</h2>
        {/* Exibe a mensagem de erro, se existir */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Campos do formulário */}
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.formInput}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.formInput}
        />
        <input
          type="text"
          placeholder="Nome"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className={styles.formInput}
        />
        <input
          type="text"
          placeholder="Sobrenome"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className={styles.formInput}
        />
        <input
          type="text"
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className={styles.formInput}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.formInput}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
          className={styles.formInput}
        />

        {/* Botão de envio do formulário */}
        <button type="submit" className={styles.button}>
          Registrar
        </button>
      </form>
    </div>
  );
}

