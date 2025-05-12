package project.poem.domain.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entidade JPA que representa um poema no sistema.
 * Mapeia para a tabela "poems" no banco de dados.
 */
@Entity
@Table(name = "poems")
public class Poem {

    /**
     * Identificador único do poema.
     * Gerado automaticamente como uma identidade pelo banco de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Título do poema.
     */
    private String title;

    /**
     * Texto completo do poema.
     */
    private String text;

    /**
     * Autor do poema.
     */
    private String author;

    /**
     * URL da imagem associada ao poema (opcional).
     */
    private String imageUrl;

    /**
     * Data de publicação do poema.
     * A anotação `@JsonFormat` especifica o formato da data ao ser serializada ou desserializada de JSON.
     */
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate postDate;

    // Getters e Setters

    /**
     * Obtém o ID do poema.
     * @return O ID do poema.
     */
    public Long getId() { return id; }

    /**
     * Define o ID do poema.
     * @param id O ID do poema a ser definido.
     */
    public void setId(Long id) { this.id = id; }

    /**
     * Obtém o título do poema.
     * @return O título do poema.
     */
    public String getTitle() { return title; }

    /**
     * Define o título do poema.
     * @param title O título do poema a ser definido.
     */
    public void setTitle(String title) { this.title = title; }

    /**
     * Obtém o texto do poema.
     * @return O texto do poema.
     */
    public String getText() { return text; }

    /**
     * Define o texto do poema.
     * @param text O texto do poema a ser definido.
     */
    public void setText(String text) { this.text = text; }

    /**
     * Obtém o autor do poema.
     * @return O autor do poema.
     */
    public String getAuthor() { return author; }

    /**
     * Define o autor do poema.
     * @param author O autor do poema a ser definido.
     */
    public void setAuthor(String author) { this.author = author; }

    /**
     * Obtém a URL da imagem associada ao poema.
     * @return A URL da imagem.
     */
    public String getImageUrl() { return imageUrl; }

    /**
     * Define a URL da imagem associada ao poema.
     * @param imageUrl A URL da imagem a ser definida.
     */
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    /**
     * Obtém a data de publicação do poema.
     * @return A data de publicação do poema.
     */
    public LocalDate getPostDate() { return postDate; }

    /**
     * Define a data de publicação do poema.
     * @param postDate A data de publicação do poema a ser definida.
     */
    public void setPostDate(LocalDate postDate) { this.postDate = postDate; }
}