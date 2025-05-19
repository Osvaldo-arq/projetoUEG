import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PoemService from '../../application/PoemService';
import PoemSearch from '../components/PoemSearch';
import styles from '../../styles/PoemsByDate.module.css';

/**
 * Componente PoemsByDate:
 *
 * Exibe um campo de busca para filtrar poemas por título ou autor.
 * Quando o campo estiver vazio, não exibe poemas.
 * Ao digitar, mostra apenas os resultados correspondentes.
 * Inclui paginação para lista completa (quando não houver busca).
 */
export default function PoemsByDate() {
  const [poems, setPoems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await PoemService.listAll();
        const sorted = data.sort(
          (a, b) => new Date(b.postDate) - new Date(a.postDate)
        );
        setPoems(sorted);
      } catch (e) {
        if ((e.status && e.status === 403) || e.message?.toLowerCase().includes('forbid')) {
          navigate('/login');
          return;
        }
        setError(e.message || 'Erro ao carregar poemas');
      }
    }
    load();
  }, [navigate]);

  // Quando pesquisa ativa, usa filtered, caso contrário, lista padrão não é exibida
  const hasSearch = filtered.length > 0;

  // Paginação apenas para lista completa (não exibida se pesquisa ativa)
  const totalPages = Math.ceil(poems.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentPoems = poems.slice(start, start + itemsPerPage);

  const handleReadMore = (id) => navigate(`/poems/${id}`);

  return (
    <div>
      <PoemSearch poems={poems} onSearch={setFiltered} />
      {error && <p className={styles.error}>{error}</p>}

      {/* Exibe resultados da busca */}
      {hasSearch && (
        <div className={styles.container}>
          {filtered.map((poem) => (
            <div key={poem.id} className={styles.card}>
              <img src={poem.imageUrl} alt={poem.title} className={styles.image} />
              <div className={styles.content}>
                <h3 className={styles.title}>{poem.title}</h3>
                <p className={styles.author}>por {poem.author}</p>
                <p className={styles.excerpt}>
                  {(poem.text || '').split('\n')[0]}...
                </p>
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
      )}

      {/* Exibe lista completa com paginação apenas se não estiver pesquisando */}
      {!hasSearch && (
        <>
          <div className={styles.container}>
            {currentPoems.map((poem) => (
              <div key={poem.id} className={styles.card}>
                <img
                  src={poem.imageUrl}
                  alt={poem.title}
                  className={styles.image}
                />
                <div className={styles.content}>
                  <h3 className={styles.title}>{poem.title}</h3>
                  <p className={styles.author}>por {poem.author}</p>
                  <p className={styles.excerpt}>
                    {(poem.text || '').split('\n')[0]}...
                  </p>
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

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                Anterior
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`${styles.pageButton} ${
                      currentPage === page ? styles.active : ''
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
