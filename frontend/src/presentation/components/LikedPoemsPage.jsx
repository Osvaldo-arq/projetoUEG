import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PoemService from '../../application/PoemService';
import styles from '../../styles/LikedPoems.module.css';

/**
 * Componente LikedPoems:
 *
 * Este componente React tem como responsabilidade exibir os poemas que o usuário
 * autenticado atualmente curtiu. Ele busca esses poemas do backend e os apresenta
 * em um formato de lista de cards, onde cada card representa um poema.
 */
export default function LikedPoems() {
  const [poems, setPoems] = useState([]); // Estado para armazenar a lista de poemas curtidos pelo usuário. Inicializado como um array vazio.
  const [error, setError] = useState(null); // Estado para armazenar qualquer erro que ocorra durante a busca dos poemas. Inicializado como null.
  const navigate = useNavigate(); // Hook do React Router para permitir a navegação entre páginas.

  // useEffect: Hook que executa uma função assincronamente quando o componente é montado.
  useEffect(() => {
    async function loadLiked() {
      try {
        // Chama o serviço PoemService para obter a lista de poemas curtidos pelo usuário.
        // Assume que PoemService.listLiked() retorna uma Promise que resolve com um array de objetos PoemDto.
        const data = await PoemService.listLiked();
        setPoems(data); // Atualiza o estado 'poems' com os dados recebidos do serviço.
      } catch (e) {
        // Se ocorrer um erro durante a chamada ao serviço, atualiza o estado 'error' com a mensagem de erro.
        // A mensagem de erro pode vir diretamente do servidor (e.message) ou ser uma mensagem padrão.
        setError(e.message || 'Erro ao carregar poemas curtidos');
      }
    }
    loadLiked(); // Chama a função loadLiked para iniciar o processo de busca dos poemas.
  }, []); // O array vazio como segundo argumento garante que este efeito é executado apenas uma vez, na montagem do componente.

  // Função para lidar com o clique no botão "Leia Mais" de um poema.
  // Redireciona o usuário para a página de detalhes do poema, usando o ID do poema como parte da URL.
  const handleReadMore = (id) => navigate(`/poems/${id}`);

  // Renderização condicional:
  // Se houver um erro, exibe uma mensagem de erro.
  if (error) return <p className={styles.error}>{error}</p>;
  // Se não houver poemas curtidos, exibe uma mensagem informando que o usuário ainda não curtiu nenhum poema.
  if (!poems.length) return <p className={styles.empty}>Você ainda não curtiu nenhum poema.</p>;

  // Se não houver erros e houver poemas curtidos, renderiza a lista de poemas em cards.
  return (
    <div className={styles.container}>
      {/* Mapeia o array de poemas e renderiza um card para cada poema. */}
      {poems.map((poem) => (
        <div key={poem.id} className={styles.card}>
          {/* Exibe a imagem do poema. */}
          <img src={poem.imageUrl} alt={poem.title} className={styles.image} />
          <div className={styles.content}>
            {/* Exibe o título do poema. */}
            <h3 className={styles.title}>{poem.title}</h3>
            {/* Exibe o autor do poema. */}
            <p className={styles.author}>por {poem.author}</p>
            {/* Exibe um trecho do poema (a primeira linha). */}
            <p className={styles.excerpt}>
              {(poem.text || '').split('\n')[0]}...
            </p>
            {/* Botão "Leia Mais" que redireciona para a página de detalhes do poema. */}
            <button
              onClick={() => handleReadMore(poem.id)}
              className={styles.readMore}
            >
              Leia Mais
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

