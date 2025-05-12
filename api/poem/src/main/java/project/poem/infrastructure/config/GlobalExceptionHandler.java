package project.poem.infrastructure.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import project.poem.infrastructure.security.UsernameAlreadyExistsException;

/**
 * Classe responsável por centralizar o tratamento de exceções lançadas pelos controladores REST.
 * A anotação `@RestControllerAdvice` indica que esta classe pode interceptar exceções lançadas
 * por controladores anotados com `@RestController`.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Trata a exceção customizada `UsernameAlreadyExistsException`.
     * Quando esta exceção é lançada, este método retorna uma resposta HTTP com status 409 (Conflict)
     * e a mensagem da exceção no corpo.
     *
     * @param ex A instância de `UsernameAlreadyExistsException` que foi lançada.
     * @return Um ResponseEntity com status 409 e a mensagem da exceção.
     */
    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<String> handleUsernameAlreadyExists(UsernameAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    /**
     * Trata a exceção `MethodArgumentNotValidException`, que ocorre quando a validação
     * de um argumento anotado com `@Valid` falha.
     * Este método extrai os erros de validação dos campos e retorna um ResponseEntity
     * com status 400 (Bad Request) e um mapa contendo o nome do campo e a mensagem de erro.
     *
     * @param ex A instância de `MethodArgumentNotValidException` que foi lançada.
     * @return Um ResponseEntity com status 400 e um mapa de erros de validação.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        // Itera sobre os erros de campo encontrados no resultado da validação.
        ex.getBindingResult().getFieldErrors().forEach(error ->
            // Para cada erro, adiciona ao mapa o nome do campo e a mensagem de erro padrão.
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Trata exceções genéricas que não foram tratadas por outros métodos `@ExceptionHandler`.
     * Este método retorna uma resposta HTTP com status 500 (Internal Server Error)
     * e uma mensagem genérica de erro, incluindo a mensagem da exceção original.
     * É importante ter cuidado ao expor detalhes internos da exceção em ambientes de produção.
     *
     * @param ex A instância de `Exception` que foi lançada.
     * @return Um ResponseEntity com status 500 e uma mensagem de erro interna.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Erro interno: " + ex.getMessage());
    }
}