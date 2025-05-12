package project.poem.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import project.poem.domain.model.Comment;

/**
 * Repositório JPA para a entidade {@link Comment}.
 * Fornece métodos para interagir com a tabela 'comments' no banco de dados.
 * Estende a interface {@link JpaRepository}, que já oferece métodos básicos de CRUD (Create, Read, Update, Delete).
 */
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * Busca todos os comentários associados a um poema específico.
     *
     * @param poemId O ID do poema para o qual os comentários devem ser buscados.
     * @return Uma lista de objetos Comment representando os comentários do poema.
     */
    List<Comment> findByPoemId(Long poemId);
}
