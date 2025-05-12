package project.poem.application.dto;

/**
 * Data Transfer Object (DTO) para representar as credenciais de login de um usuário.
 * Contém o nome de usuário e a senha para autenticação.
 */
public class LoginDto {
    private String username;
    private String password;

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
}