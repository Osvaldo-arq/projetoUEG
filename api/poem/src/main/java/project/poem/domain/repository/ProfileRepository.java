package project.poem.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import project.poem.domain.model.Profile;

/**
 * Repositório JPA para a entidade {@link Profile}.
 * Fornece métodos para interagir com a tabela 'profiles' no banco de dados.
 * Estende a interface {@link JpaRepository}, que já oferece métodos básicos de CRUD (Create, Read, Update, Delete).
 */
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    /**
     * Busca um perfil pelo email do usuário associado.
     * O email do usuário é armazenado no campo 'userEmail' da entidade {@link Profile}.
     *
     * @param email O email do usuário a ser pesquisado.
     * @return Um {@link Optional} contendo o perfil encontrado (se existir) ou um {@link Optional} vazio caso contrário.
     */
    Optional<Profile> findByUserEmail(String email);
}