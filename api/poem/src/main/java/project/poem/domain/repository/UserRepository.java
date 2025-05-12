package project.poem.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import project.poem.domain.model.User;

/**
 * Repositório JPA para a entidade {@link User}.
 * Fornece métodos para interagir com a tabela 'users' no banco de dados.
 * Estende a interface {@link JpaRepository}, que já oferece métodos básicos de CRUD (Create, Read, Update, Delete).
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Busca um usuário pelo seu nome de usuário.
     * O nome de usuário é um identificador único para cada usuário no sistema.
     *
     * @param username O nome de usuário a ser pesquisado.
     * @return Um {@link Optional} contendo o usuário encontrado (se existir) ou um {@link Optional} vazio caso contrário.
     */
    Optional<User> findByUsername(String username);
}