package project.poem.application.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Data Transfer Object (DTO) para representar os dados de um comentário em um poema.
 * Utiliza a anotação `@JsonFormat` para especificar o formato da data ao serializar/desserializar.
 */
public class CommentDto {

    private Long id;
    private String author;
    private String content;

    /**
     * Data de publicação do comentário, formatada como "dd/MM/yyyy" ao ser serializada para JSON.
     */
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate commentDate;
    private Long poemId;

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
     * Obtém o ID do poema ao qual o comentário pertence.
     *
     * @return O ID do poema.
     */
    public Long getPoemId() {
        return poemId;
    }

    /**
     * Define o ID do poema ao qual o comentário pertence.
     *
     * @param poemId O ID do poema a ser definido.
     */
    public void setPoemId(Long poemId) {
        this.poemId = poemId;
    }
}
