package project.poem.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import project.poem.domain.model.PoemLike;

/**
 * Repositório JPA para a entidade {@link PoemLike}.
 * Fornece métodos para interagir com a tabela 'poem_likes' no banco de dados.
 * Estende a interface {@link JpaRepository}, que já oferece métodos básicos de CRUD (Create, Read, Update, Delete).
 */
public interface PoemLikeRepository extends JpaRepository<PoemLike, Long> {

    /**
     * Conta o número de curtidas de um poema específico.
     *
     * @param poemId O ID do poema para o qual as curtidas devem ser contadas.
     * @return O número de curtidas do poema.
     */
    long countByPoemId(Long poemId);

    /**
     * Busca uma curtida específica de um poema por um usuário.
     *
     * @param poemId O ID do poema.
     * @param userId O ID do usuário.
     * @return Um Optional contendo a curtida, se encontrada, ou um Optional vazio, caso contrário.
     */
    Optional<PoemLike> findByPoemIdAndUserId(Long poemId, Long userId);
}
