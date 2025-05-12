package project.poem.application.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

/**
 * Data Transfer Object (DTO) para representar os dados de perfil de um usuário.
 * Utiliza anotações de validação do Bean Validation (JSR-380) para garantir a integridade dos dados.
 */
public class ProfileDto {

    /**
     * Primeiro nome do perfil.
     * Não pode estar em branco (`@NotBlank`).
     */
    @NotBlank
    private String firstName;

    /**
     * Último nome do perfil.
     * Não pode estar em branco (`@NotBlank`).
     */
    @NotBlank
    private String lastName;

    /**
     * Número de telefone do perfil.
     * Deve corresponder ao padrão de um número de telefone (opcionalmente com um '+', seguido de dígitos) (`@Pattern`).
     */
    @Pattern(regexp = "\\+?\\d+")
    private String phone;

    /**
     * Email do usuário associado ao perfil.
     * Deve ser um endereço de email válido (`@Email`) e não pode estar em branco (`@NotBlank`).
     */
    @Email
    @NotBlank
    private String userEmail;

    /**
     * Obtém o primeiro nome.
     *
     * @return O primeiro nome.
     */
    public String getFirstName() { return firstName; }

    /**
     * Define o primeiro nome.
     *
     * @param firstName O primeiro nome a ser definido.
     */
    public void setFirstName(String firstName) { this.firstName = firstName; }

    /**
     * Obtém o último nome.
     *
     * @return O último nome.
     */
    public String getLastName() { return lastName; }

    /**
     * Define o último nome.
     *
     * @param lastName O último nome a ser definido.
     */
    public void setLastName(String lastName) { this.lastName = lastName; }

    /**
     * Obtém o número de telefone.
     *
     * @return O número de telefone.
     */
    public String getPhone() { return phone; }

    /**
     * Define o número de telefone.
     *
     * @param phone O número de telefone a ser definido.
     */
    public void setPhone(String phone) { this.phone = phone; }

    /**
     * Obtém o email do usuário associado.
     *
     * @return O email do usuário.
     */
    public String getUserEmail() { return userEmail; }

    /**
     * Define o email do usuário associado.
     *
     * @param userEmail O email do usuário a ser definido.
     */
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}