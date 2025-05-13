package project.poem.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 * Entidade JPA que representa a curtida de um poema por um usuário.
 * Mapeia para a tabela "poem_likes" no banco de dados.
 * Esta entidade é usada para rastrear quais usuários curtiram quais poemas.
 */
@Entity
@Table(
    name = "poem_likes",
    // Define uma constraint de unicidade para garantir que um usuário só possa curtir um poema uma vez.
    uniqueConstraints = @UniqueConstraint(columnNames = {"poem_id", "user_id"})
)
public class PoemLike {

    /**
     * Identificador único da curtida.
     * Gerado automaticamente como uma identidade pelo banco de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Poema que foi curtido.
     * A anotação `@ManyToOne` indica que muitas curtidas podem ser associadas a um poema.
     * `optional = false` indica que um PoemLike deve sempre estar associado a um poema.
     * `@JoinColumn(name = "poem_id", nullable = false)` especifica a coluna na tabela "poem_likes"
     * que armazena a chave estrangeira para a tabela "poems".  `nullable = false`
     * garante que esta coluna não pode ser nula.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "poem_id", nullable = false)
    private Poem poem;

    /**
     * Usuário que curtiu o poema.
     * A anotação `@ManyToOne` indica que muitas curtidas podem ser feitas por um usuário.
     * `optional = false` indica que um PoemLike deve sempre estar associado a um usuário.
     * `@JoinColumn(name = "user_id", nullable = false)` especifica a coluna na tabela "poem_likes"
     * que armazena a chave estrangeira para a tabela "users". `nullable = false`
     * garante que esta coluna não pode ser nula.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Getters e Setters

    /**
     * Obtém o ID da curtida.
     *
     * @return O ID da curtida.
     */
    public Long getId() {
        return id;
    }

    /**
     * Define o ID da curtida.
     *
     * @param id O ID da curtida a ser definido.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Obtém o poema que foi curtido.
     *
     * @return O poema que foi curtido.
     */
    public Poem getPoem() {
        return poem;
    }

    /**
     * Define o poema que foi curtido.
     *
     * @param poem O poema a ser definido.
     */
    public void setPoem(Poem poem) {
        this.poem = poem;
    }

    /**
     * Obtém o usuário que curtiu o poema.
     *
     * @return O usuário que curtiu o poema.
     */
    public User getUser() {
        return user;
    }

    /**
     * Define o usuário que curtiu o poema.
     *
     * @param user O usuário a ser definido.
     */
    public void setUser(User user) {
        this.user = user;
    }
}

