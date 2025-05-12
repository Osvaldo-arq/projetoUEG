package project.poem.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Entidade JPA que representa o perfil de um usuário no sistema.
 * Mapeia para a tabela "profiles" no banco de dados.
 */
@Entity
@Table(name = "profiles")
public class Profile {

    /**
     * Identificador único do perfil.
     * Gerado automaticamente pela estratégia padrão do JPA.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Primeiro nome do usuário.
     */
    private String firstName;

    /**
     * Último nome do usuário.
     */
    private String lastName;

    /**
     * Número de telefone do usuário.
     */
    private String phone;

    /**
     * Email do usuário associado a este perfil.
     * Não pode ser nulo e deve ser único no banco de dados.
     * Usado como chave estrangeira para a tabela de usuários.
     */
    @Column(name = "user_email", nullable = false, unique = true)
    private String userEmail;

    /**
     * Relacionamento um-para-um com a entidade User.
     * FetchType.LAZY indica que o usuário só será carregado quando explicitamente acessado.
     * @JoinColumn especifica a coluna de junção, referenciando a coluna "email" na tabela "users".
     * insertable = false e updatable = false indicam que o JPA não deve tentar inserir ou atualizar esta coluna
     * diretamente, pois seu valor é gerenciado através da associação com a entidade User.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email", referencedColumnName = "email", insertable = false, updatable = false)
    private User user;

    // Getters and Setters

    /**
     * Obtém o ID do perfil.
     * @return O ID do perfil.
     */
    public Long getId() { return id; }

    /**
     * Define o ID do perfil.
     * @param id O ID do perfil a ser definido.
     */
    public void setId(Long id) { this.id = id; }

    /**
     * Obtém o primeiro nome do usuário.
     * @return O primeiro nome do usuário.
     */
    public String getFirstName() { return firstName; }

    /**
     * Define o primeiro nome do usuário.
     * @param firstName O primeiro nome do usuário a ser definido.
     */
    public void setFirstName(String firstName) { this.firstName = firstName; }

    /**
     * Obtém o último nome do usuário.
     * @return O último nome do usuário.
     */
    public String getLastName() { return lastName; }

    /**
     * Define o último nome do usuário.
     * @param lastName O último nome do usuário a ser definido.
     */
    public void setLastName(String lastName) { this.lastName = lastName; }

    /**
     * Obtém o número de telefone do usuário.
     * @return O número de telefone do usuário.
     */
    public String getPhone() { return phone; }

    /**
     * Define o número de telefone do usuário.
     * @param phone O número de telefone do usuário a ser definido.
     */
    public void setPhone(String phone) { this.phone = phone; }

    /**
     * Obtém o email do usuário associado a este perfil.
     * @return O email do usuário.
     */
    public String getUserEmail() { return userEmail; }

    /**
     * Define o email do usuário associado a este perfil.
     * @param userEmail O email do usuário a ser definido.
     */
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    /**
     * Obtém o usuário associado a este perfil.
     * Carregado lazy (apenas quando acessado).
     * @return O usuário associado.
     */
    public User getUser() { return user; }

    /**
     * Define o usuário associado a este perfil e atualiza o email do usuário.
     * @param user O usuário a ser associado.
     */
    public void setUser(User user) {
        this.user = user;
        this.userEmail = user.getEmail();
    }
}