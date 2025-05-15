package project.poem.application.dto;

/**
 * Data Transfer Object (DTO) para representar os dados de um usuário durante o registro.
 * Contém informações como nome de usuário, senha, confirmação de senha, email e role.
 */
public class UserDto {
    private Long id;
    private String username;
    private String password;
    private String confirmPassword;
    private String email;
    private String role;

    /**
     * Obtém o ID do usuário.
     * 
     * @return O ID do usuário.
     */
    public Long getId() {
        return id;
    }

    /**
     * Define o ID do usuário.
     *
     * @param id O ID do usuário a ser definido.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Obtém o nome de usuário.
     *
     * @return O nome de usuário.
     */
    public String getUsername() {
        return username;
    }

    /**
     * Define o nome de usuário.
     *
     * @param username O nome de usuário a ser definido.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Obtém a senha.
     *
     * @return A senha.
     */
    public String getPassword() {
        return password;
    }

    /**
     * Define a senha.
     *
     * @param password A senha a ser definida.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Obtém a confirmação da senha.
     *
     * @return A confirmação da senha.
     */
    public String getConfirmPassword() {
        return confirmPassword;
    }

    /**
     * Define a confirmação da senha.
     *
     * @param confirmPassword A confirmação da senha a ser definida.
     */
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    /**
     * Obtém o email.
     *
     * @return O email.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Define o email.
     *
     * @param email O email a ser definido.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Obtém a role do usuário.
     *
     * @return A role do usuário.
     */
    public String getRole() {
        return role;
    }

    /**
     * Define a role do usuário.
     *
     * @param role A role do usuário a ser definida.
     */
    public void setRole(String role) {
        this.role = role;
    }
}