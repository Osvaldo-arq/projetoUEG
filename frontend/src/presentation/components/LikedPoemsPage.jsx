import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Importa o componente Link do React Router para navegação
import PoemService from '../../application/PoemService'; // Importa o serviço para buscar poemas
import PoemSearch from '../components/PoemSearch'; // Importa o componente de busca de poemas
import styles from '../../styles/LikedPoems.module.css'; // Importa os estilos CSS do componente

/**
 * Componente LikedPoems:
 *
 * Exibe todos os poemas curtidos pelo usuário e permite buscar por título ou autor.
 * - Sem texto na busca: lista completa.
 * - Com texto: apenas resultados da busca.
 * @param {Object} props - Propriedades do componente.
 * @returns {JSX.Element} Componente LikedPoems.
 * @throws {Error} Se ocorrer um erro ao carregar os poemas.
 */
export default function LikedPoems() {
  const [poems, setPoems] = useState([]);       // Estado para armazenar a lista de poemas curtidos
  const [error, setError] = useState(null);       // Estado para armazenar mensagens de erro
  const [filtered, setFiltered] = useState([]);   // Estado para armazenar os resultados filtrados da busca
  const [searchText, setSearchText] = useState(''); // Estado para armazenar o texto da busca

  // Efeito para carregar os poemas curtidos ao montar o componente
  useEffect(() => {
    async function loadLiked() {
      try {
        const data = await PoemService.listLiked(); // Busca os poemas curtidos usando o serviço
        setPoems(data); // Atualiza o estado com os poemas curtidos
      } catch (e) {
        setError(e.message || 'Erro ao carregar poemas curtidos'); // Define o erro, se ocorrer
      }
    }
    loadLiked(); // Chama a função para carregar os poemas
  }, []);

  const hasSearch = searchText.trim().length > 0; // Verifica se há texto na busca

  // Função para lidar com a busca de poemas (recebe do PoemSearch)
  const handleSearch = useCallback((results, text) => {
    // Evita atualizações infinitas se os valores não mudarem
    setFiltered((prev) => (prev === results ? prev : results));
    setSearchText((prev) => (prev === text ? prev : text));
  }, []);

  // Renderiza mensagem de erro, se houver
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  // Renderiza mensagem se o usuário não curtiu nenhum poema
  if (!poems.length) {
    return <p className={styles.empty}>Você ainda não curtiu nenhum poema.</p>;
  }

  // Função para renderizar um card de poema
  const renderCard = (poem) => (
    <div key={poem.id} className={styles.card}>
      {/* Exibe a imagem do poema */}
      <img src={poem.imageUrl} alt={poem.title} className={styles.image} />
      <div className={styles.content}>
        {/* Exibe o título do poema */}
        <h3 className={styles.title}>{poem.title}</h3>
        {/* Exibe o autor do poema */}
        <p className={styles.author}>por {poem.author}</p>
        {/* Exibe um trecho do poema */}
        <p className={styles.excerpt}>
          {(poem.text || '').split('\n')[0]}...
        </p>
        {/* Link para a página de detalhes do poema */}
        <Link
          to={`/poems/${poem.id}`}
          className={styles.readMore}
          role="button"
        >
          Leia Mais
        </Link>
      </div>
    </div>
  );

  // Renderiza o componente
  return (
    <div>
      {/* Componente de busca de poemas */}
      <PoemSearch poems={poems} onSearch={handleSearch} />

      {/* Container para exibir os poemas */}
      <div className={styles.container}>
        {/* Renderiza os poemas (filtrados ou todos) */}
        {(hasSearch ? filtered : poems).map(renderCard)}
      </div>
    </div>
  );
}

