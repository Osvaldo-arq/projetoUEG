import React from 'react';

/**
 * ProfileList Component:
 *
 * Este componente exibe uma tabela de perfis de usuário. Ele recebe um array de objetos de perfil
 * como uma prop e renderiza cada perfil em uma linha da tabela. Ele também fornece botões "Editar" e "Excluir"
 * para cada perfil, que chamam funções de callback passadas como props.
 */
export default function ProfileList({ profiles, onEdit, onDelete }) {
  // Renderiza a tabela:
  return (
    <table border="1" cellPadding="5" style={{ width: '100%', marginBottom: '2rem' }}>
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
        {/* Mapeia o array 'profiles' para renderizar uma linha da tabela para cada perfil. */}
        {profiles.map((p) => (
          <tr key={p.userEmail}> {/* Usa userEmail como a chave, assumindo que é único. */}
            <td>{p.firstName}</td>
            <td>{p.lastName}</td>
            <td>{p.phone}</td>
            <td>{p.userEmail}</td>
            <td>
              {/* Botão para editar o perfil. */}
              <button
                onClick={() => onEdit(p)} // Chama o callback 'onEdit' com os dados do perfil quando clicado.
                style={{ marginRight: '0.5rem' }} // Adiciona uma margem direita para espaçamento.
              >
                Editar
              </button>
              {/* Botão para excluir o perfil. */}
              <button onClick={() => onDelete(p.userEmail)}>Excluir</button>  {/* Chama o callback 'onDelete' com o userEmail quando clicado. */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
