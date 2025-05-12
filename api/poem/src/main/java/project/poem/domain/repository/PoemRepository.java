package project.poem.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import project.poem.domain.model.Poem;

/**
 * Repositório JPA para a entidade {@link Poem}.
 * Fornece métodos para interagir com a tabela 'poems' no banco de dados.
 * Estende a interface {@link JpaRepository}, que já oferece métodos básicos de CRUD (Create, Read, Update, Delete).
 */
public interface PoemRepository extends JpaRepository<Poem, Long> {
    // Os métodos básicos de CRUD (findAll, findById, save, deleteById)
    // são automaticamente fornecidos pela interface JpaRepository.
    // Podemos adicionar métodos personalizados aqui, se necessário.
}