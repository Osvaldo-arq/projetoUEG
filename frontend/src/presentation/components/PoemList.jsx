import React from 'react';

/**
 * Componente para exibir uma lista de poemas em uma tabela.
 * Este componente recebe uma lista de poemas e funções para editar e excluir poemas.
 */
export default function PoemList({ poems, onEdit, onDelete }) {
  return (
    <table border="1" cellPadding="5" style={{ width: '100%', marginBottom: '1rem' }}>
      {/* Estilos inline para a tabela: borda, preenchimento e margem inferior. */}
      <thead>
        <tr>
          {/* Cabeçalho da tabela com as colunas: ID, Título, Autor, Data e Ações. */}
          <th>ID</th><th>Título</th><th>Autor</th><th>Data</th><th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {poems.map(p => (
          // Mapeia o array de poemas para renderizar cada poema como uma linha na tabela.
          <tr key={p.id}>
            {/* A chave 'key' é importante para o React identificar cada linha de forma eficiente. */}
            <td>{p.id}</td>        {/* Exibe o ID do poema. */}
            <td>{p.title}</td>     {/* Exibe o título do poema. */}
            <td>{p.author}</td>    {/* Exibe o autor do poema. */}
            <td>{p.postDate}</td>  {/* Exibe a data de publicação do poema. */}
            <td>
              {/* Coluna de ações com botões para editar e excluir o poema. */}
              <button onClick={() => onEdit(p)}>Editar</button>
              {/* Botão para editar o poema. 'onClick' chama a função 'onEdit' passada como prop. */}
              <button onClick={() => onDelete(p.id)} style={{ marginLeft: '0.5rem' }}>Excluir</button>
              {/* Botão para excluir o poema. 'onClick' chama a função 'onDelete' passada como prop.
                  Estilo inline para adicionar margem à esquerda do botão. */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
