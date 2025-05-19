import React, { useState, useEffect } from 'react'; // Importa React, useState e useEffect.
import styles from '../../styles/PoemSearch.module.css'; // Importa estilos CSS do módulo.

/**
 * Componente de busca para poemas por título ou autor.
 * Quando o usuário digita, filtra os poemas e invoca a função onSearch para atualizar os resultados.
 * @param {Array} poems - Lista de poemas a serem filtrados.
 * @param {Function} onSearch - Função a ser chamada com os resultados filtrados e o texto da busca.
 * @returns {JSX.Element} Componente de busca.
 */
export default function PoemSearch({ poems, onSearch }) {
  const [text, setText] = useState(''); // Estado local para armazenar o texto da busca.

  // Efeito para filtrar os poemas e chamar onSearch sempre que 'text' mudar.
  useEffect(() => {
    if (text.trim() === '') {
      // Se o texto da busca estiver vazio, chama onSearch com um array vazio e o texto vazio.
      onSearch([], text);
    } else {
      // Converte o texto da busca para minúsculo para realizar uma busca case-insensitive.
      const lower = text.toLowerCase();
      // Filtra os poemas com base no título ou autor, também convertidos para minúsculo.
      const results = poems.filter(p =>
        p.title.toLowerCase().includes(lower) ||
        p.author.toLowerCase().includes(lower)
      );
      // Chama onSearch com os resultados da busca e o texto da busca.
      onSearch(results, text);
    }
  }, [text, poems, onSearch]); // Dependências do useEffect: text, poems e onSearch.

  // Renderiza o componente de busca.
  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        placeholder="Pesquise por título ou autor..." // Placeholder para o campo de busca.
        value={text} // Valor do campo de busca vinculado ao estado 'text'.
        onChange={e => setText(e.target.value)} // Atualiza o estado 'text' quando o usuário digita.
        className={styles.searchInput} // Aplica estilos CSS do módulo.
      />
    </div>
  );
}
