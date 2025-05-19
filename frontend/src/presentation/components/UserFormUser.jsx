// src/components/UserForm.js
import React, { useState, useEffect } from 'react';
import styles from '../../styles/UserForm.module.css';

/**
 * Componente para criar e editar usuários.
 *
 * @param {Object} props - Props do componente.
 * @param {Object} props.user - Objeto do usuário a ser editado (se houver).
 * @param {function} props.onSubmit - Função chamada ao submeter o formulário.
 * @param {function} props.onCancel - Função chamada ao clicar no botão de cancelar.
 */
const UserForm = ({ user, onSubmit, onCancel }) => {
  const [id, setId] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [passwordMatchError, setPasswordMatchError] = useState('');

  useEffect(() => {
    if (user) {
      setId(user.id);
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role);
      // Limpa os campos de senha ao editar, para não sobrescrever sem intenção
      setPassword('');
      setConfirmPassword('');
    } else {
      setId(null);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('USER');
    }
    setPasswordMatchError(''); // Limpa o erro ao montar/atualizar o formulário
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validação da confirmação de senha: só se alguma senha foi digitada
    if ((password || confirmPassword) && password !== confirmPassword) {
      setPasswordMatchError('As senhas não coincidem.');
      return;
    }

    // Prepara os dados do usuário para enviar
    const userData = {
      id,
      username,
      email,
      role,
    };

    // Inclui a senha apenas se ela foi digitada
    if (password) {
      userData.password = password;
      // Envia confirmPassword também se for uma nova senha
      userData.confirmPassword = password;
    }

    onSubmit(userData);
  };

  return (
    <div className={styles.userFormContainer}>
      <h2>{user ? 'Editar Usuário' : 'Novo Usuário'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">Nova Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirmar Nova Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordMatchError && <p className={styles.error}>{passwordMatchError}</p>}
        </div>
        <div className={styles.buttons}>
          <button type="submit">{user ? 'Salvar' : 'Criar'}</button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;