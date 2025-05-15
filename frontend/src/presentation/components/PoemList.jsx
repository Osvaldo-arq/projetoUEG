import React from 'react';
import styles from '../../styles/PoemList.module.css';

/**
 * Componente para exibir uma lista de poemas em uma tabela.
 * Este componente recebe uma lista de poemas e funções para editar e excluir poemas.
 */
export default function PoemList({ poems, onEdit, onDelete }) {
  return (
    <div className={styles.poemListContainer}> 
      <table className={styles.poemListTable}> 
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Data</th>
            <th>Texto</th>
            <th>Imagem</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {poems.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>{p.author}</td>
              <td>{p.postDate}</td>
              <td>{p.text}</td>
              <td>{p.imageUrl}</td>
              <td>
                <button onClick={() => onEdit(p)} className={styles.poemListTableButton}>Editar</button>
                <button onClick={() => onDelete(p.id)} className={styles.poemListTableButton}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
