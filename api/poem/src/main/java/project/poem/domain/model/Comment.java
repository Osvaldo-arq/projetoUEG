package project.poem.domain.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entidade JPA que representa um comentário em um poema.
 * Mapeia para a tabela "comments" no banco de dados.
 */
@Entity
@Table(name = "comments")
public class Comment {

    /**
     * Identificador único do comentário.
     * Gerado automaticamente como uma identidade pelo banco de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Autor do comentário.
     */
    private String author;

    /**
     * Conteúdo do comentário.
     * A anotação `@Column(columnDefinition = "TEXT")` indica que este campo
     * deve ser mapeado para um tipo de dados TEXT no banco de dados,
     * permitindo armazenar textos longos.
     */
    @Column(columnDefinition = "TEXT")
    private String content;

    /**
     * Data de publicação do comentário.
     */
    private LocalDate commentDate;

    /**
     * Poema ao qual este comentário pertence.
     * A anotação `@ManyToOne` indica que muitos comentários podem pertencer a um poema.
     * `fetch = FetchType.LAZY` indica que o poema associado não deve ser carregado
     * automaticamente quando o comentário é carregado, otimizando o desempenho.
     * `@JoinColumn(name = "poem_id")` especifica a coluna na tabela de comentários
     * que armazena a chave estrangeira para a tabela de poemas.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poem_id")
    private Poem poem;

    // Getters e Setters

    /**
     * Obtém o ID do comentário.
     *
     * @return O ID do comentário.
     */
    public Long getId() {
        return id;
    }

    /**
     * Define o ID do comentário.
     *
     * @param id O ID do comentário a ser definido.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Obtém o autor do comentário.
     *
     * @return O autor do comentário.
     */
    public String getAuthor() {
        return author;
    }

    /**
     * Define o autor do comentário.
     *
     * @param author O autor do comentário a ser definido.
     */
    public void setAuthor(String author) {
        this.author = author;
    }

    /**
     * Obtém o conteúdo do comentário.
     *
     * @return O conteúdo do comentário.
     */
    public String getContent() {
        return content;
    }

    /**
     * Define o conteúdo do comentário.
     *
     * @param content O conteúdo do comentário a ser definido.
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * Obtém a data de publicação do comentário.
     *
     * @return A data de publicação do comentário.
     */
    public LocalDate getCommentDate() {
        return commentDate;
    }

    /**
     * Define a data de publicação do comentário.
     *
     * @param commentDate A data de publicação do comentário a ser definida.
     */
    public void setCommentDate(LocalDate commentDate) {
        this.commentDate = commentDate;
    }

    /**
     * Obtém o poema ao qual o comentário pertence.
     *
     * @return O poema ao qual o comentário pertence.
     */
    public Poem getPoem() {
        return poem;
    }

    /**
     * Define o poema ao qual o comentário pertence.
     *
     * @param poem O poema ao qual o comentário pertence a ser definido.
     */
    public void setPoem(Poem poem) {
        this.poem = poem;
    }
}
