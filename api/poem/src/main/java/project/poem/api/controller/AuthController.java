package project.poem.api.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.poem.application.dto.LoginDto;
import project.poem.application.dto.UserDto;
import project.poem.application.service.UserService;
import project.poem.infrastructure.security.UsernameAlreadyExistsException;

/**
 * Controlador REST para operações de autenticação, como registro e login de usuários.
 * Também inclui endpoints para atualizar e deletar usuários, com controle de acesso.
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
     * @param userDto Objeto DTO contendo os dados do novo usuário. As anotações `@Valid`
     * garantem que os dados recebidos sejam validados de acordo com as regras definidas em UserDto.
     * @return ResponseEntity contendo o token JWT em caso de sucesso ou uma mensagem de erro em caso de falha.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserDto userDto) {
        try {
            // Chama o serviço para registrar o usuário e obter o token JWT.
            String token = userService.registerUser(userDto);
            return ResponseEntity.ok(token); // Retorna o JWT em caso de sucesso
        } catch (IllegalArgumentException e) {
            // Retorna uma resposta de erro 400 (Bad Request) com a mensagem da exceção.
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (UsernameAlreadyExistsException e) {
            // Retorna uma resposta de erro 409 (Conflict) se o nome de usuário já existir.
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (Exception e) {
            // Retorna uma resposta de erro 500 (Internal Server Error) para erros inesperados.
            return ResponseEntity.internalServerError().body("Erro interno ao registrar o usuário");
        }
    }

    /**
     * Endpoint para autenticar um usuário existente.
     * Recebe as credenciais de login no corpo da requisição e tenta autenticá-lo.
     *
     * @param loginDto Objeto DTO contendo o nome de usuário e a senha para login. As anotações `@Valid`
     * garantem que os dados recebidos sejam validados de acordo com as regras definidas em LoginDto.
     * @return ResponseEntity contendo o token JWT em caso de sucesso ou uma mensagem de erro em caso de falha.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto loginDto) {
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

    /**
     * Endpoint para atualizar os dados de um usuário existente.
     * Recebe o ID do usuário na URL e os novos dados no corpo da requisição.
     * A anotação `@PreAuthorize` garante que apenas o próprio usuário ou um administrador possa acessar este endpoint.
     *
     * @param id      O ID do usuário a ser atualizado.
     * @param userDto Objeto DTO contendo os novos dados do usuário. As anotações `@Valid`
     * garantem que os dados recebidos sejam validados de acordo com as regras definidas em UserDto.
     * @return ResponseEntity com uma mensagem de sucesso ou erro.
     */
    @PutMapping("/{id}")
    @PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody @Valid UserDto userDto) {
        try {
            userService.updateUser(id, userDto);
            return ResponseEntity.ok("Usuário atualizado com sucesso.");
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.badRequest().body("Nome de usuário já existe.");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar o usuário.");
        }
    }

    /**
     * Endpoint para deletar um usuário existente.
     * Recebe o ID do usuário a ser deletado como parte da URL.
     * A anotação `@PreAuthorize` garante que apenas o próprio usuário ou um administrador possa acessar este endpoint.
     *
     * @param id O ID do usuário a ser deletado.
     * @return ResponseEntity com uma mensagem de sucesso.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Usuário deletado com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao deletar o usuário.");
        }
    }
}