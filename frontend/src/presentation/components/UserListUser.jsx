// src/components/UserList.js
import React from 'react';
import styles from '../../styles/UserList.module.css'; // Crie este arquivo CSS

/**
 * Componente para exibir a lista de usuários.
 *
 * @param {Object} props - Props do componente.
 * @param {Array<Object>} props.users - Lista de objetos de usuário a serem exibidos.
 * @param {function} props.onEdit - Função chamada ao clicar no botão de editar um usuário.
 * @param {function} props.onDelete - Função chamada ao clicar no botão de deletar um usuário.
 */
const UserList = ({ users, onEdit, onDelete }) => {
  return (
    <div className={styles.userListContainer}>
      {users && users.length > 0 ? (
        <table className={styles.userListTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mudar senha</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td className={styles.actions}>
                  <button onClick={() => onEdit(user)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum usuário encontrado.</p>
      )}
    </div>
  );
};

export default UserList;