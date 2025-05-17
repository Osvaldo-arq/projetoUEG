import React from 'react';
import styles from '../../styles/ProfileList.module.css';

/**
 * ProfileList Component:
 *
 * Este componente exibe uma tabela de perfis de usuário. Ele recebe um array de objetos de perfil
 * como uma prop e renderiza cada perfil em uma linha da tabela. Ele também fornece botões "Editar" e "Excluir"
 * para cada perfil, que chamam funções de callback passadas como props.
 */
export default function ProfileList({ profiles, onEdit, onDelete }) {
  return (
    <div className={styles.profileListContainer}>
      <table className={styles.profileListTable}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.userEmail}>
              <td>{p.firstName}</td>
              <td>{p.lastName}</td>
              <td>{p.phone}</td>
              <td>{p.userEmail}</td>
              <td className={styles.actions}>
                <button onClick={() => onEdit(p)} className={styles.profileListTableButton}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}