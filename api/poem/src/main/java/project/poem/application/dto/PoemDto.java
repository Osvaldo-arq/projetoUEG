package project.poem.application.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Data Transfer Object (DTO) para representar os dados de um poema.
 * Utiliza a anotação `@JsonFormat` para especificar o formato da data ao serializar/desserializar.
 */
public class PoemDto {

    private Long id;
    private String title;
    private String text;
    private String author;
    private String imageUrl;

    /**
     * Data de publicação do poema, formatada como "dd/MM/yyyy" ao ser serializada para JSON.
     */
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate postDate;

    /**
     * Obtém o ID do poema.
     *
     * @return O ID do poema.
     */
    public Long getId() { return id; }

    /**
     * Define o ID do poema.
     *
     * @param id O ID do poema a ser definido.
     */
    public void setId(Long id) { this.id = id; }

    /**
     * Obtém o título do poema.
     *
     * @return O título do poema.
     */
    public String getTitle() { return title; }

    /**
     * Define o título do poema.
     *
     * @param title O título do poema a ser definido.
     */
    public void setTitle(String title) { this.title = title; }

    /**
     * Obtém o texto do poema.
     *
     * @return O texto do poema.
     */
    public String getText() { return text; }

    /**
     * Define o texto do poema.
     *
     * @param text O texto do poema a ser definido.
     */
    public void setText(String text) { this.text = text; }

    /**
     * Obtém o autor do poema.
     *
     * @return O autor do poema.
     */
    public String getAuthor() { return author; }

    /**
     * Define o autor do poema.
     *
     * @param author O autor do poema a ser definido.
     */
    public void setAuthor(String author) { this.author = author; }

    /**
     * Obtém a URL da imagem associada ao poema.
     *
     * @return A URL da imagem.
     */
    public String getImageUrl() { return imageUrl; }

    /**
     * Define a URL da imagem associada ao poema.
     *
     * @param imageUrl A URL da imagem a ser definida.
     */
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    /**
     * Obtém a data de publicação do poema.
     *
     * @return A data de publicação do poema.
     */
    public LocalDate getPostDate() { return postDate; }

    /**
     * Define a data de publicação do poema.
     *
     * @param postDate A data de publicação do poema a ser definida.
     */
    public void setPostDate(LocalDate postDate) { this.postDate = postDate; }
}