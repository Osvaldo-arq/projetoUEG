package project.poem.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.poem.application.dto.LoginDto;
import project.poem.application.dto.UserDto;
import project.poem.application.service.UserService;

/**
 * Controlador REST para operações de autenticação, como registro e login de usuários.
 * Este controlador expõe endpoints sob o caminho base "/api/auth".
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    /**
     * Construtor para injetar a dependência de UserService.
     *
     * @param userService O serviço responsável pela lógica de usuários.
     */
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint para registrar um novo usuário.
     * Recebe os dados do usuário no corpo da requisição e tenta registrá-lo.
     *
     * @param userDto Objeto DTO contendo os dados do novo usuário.
     * @return ResponseEntity contendo o token JWT em caso de sucesso ou uma mensagem de erro em caso de falha.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        try {
            // Chama o serviço para registrar o usuário e obter o token JWT.
            String token = userService.registerUser(userDto);
            return ResponseEntity.ok(token); // Retorna o JWT em caso de sucesso
        } catch (IllegalArgumentException e) {
            // Retorna uma resposta de erro 400 (Bad Request) com a mensagem da exceção.
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Retorna uma resposta de erro 500 (Internal Server Error) para erros inesperados.
            return ResponseEntity.internalServerError().body("Erro interno ao registrar o usuário");
        }
    }

    /**
     * Endpoint para autenticar um usuário existente.
     * Recebe as credenciais de login no corpo da requisição e tenta autenticá-lo.
     *
     * @param loginDto Objeto DTO contendo o nome de usuário e a senha para login.
     * @return ResponseEntity contendo o token JWT em caso de sucesso ou uma mensagem de erro em caso de falha.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            // Chama o serviço para autenticar o usuário e obter o token JWT.
            String token = userService.authenticateUser(
                loginDto.getUsername(),
                loginDto.getPassword()
            );
            return ResponseEntity.ok(token); // Retorna o JWT em caso de sucesso
        } catch (IllegalArgumentException e) {
            // Retorna uma resposta de erro 400 (Bad Request) com a mensagem da exceção.
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Retorna uma resposta de erro 500 (Internal Server Error) para erros inesperados.
            return ResponseEntity.internalServerError().body("Erro interno ao autenticar");
        }
    }
}