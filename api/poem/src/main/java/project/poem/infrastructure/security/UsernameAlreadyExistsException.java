package project.poem.infrastructure.security;

/**
 * Exceção customizada para indicar que um nome de usuário já existe no sistema
 * durante o processo de registro. Esta exceção herda de RuntimeException,
 * o que a torna uma exceção não verificada (unchecked exception).
 */
public class UsernameAlreadyExistsException extends RuntimeException {

    /**
     * Construtor que recebe uma mensagem detalhada sobre a exceção.
     *
     * @param message A mensagem que descreve a razão pela qual a exceção foi lançada.
     */
    public UsernameAlreadyExistsException(String message) {
        super(message);
    }
}