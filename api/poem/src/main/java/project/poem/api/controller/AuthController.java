package project.poem.api.controller;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import project.poem.domain.model.User;
import project.poem.infrastructure.security.UsernameAlreadyExistsException;

@RestController // Indica que esta classe é um controlador REST, combinando @Controller e @ResponseBody.
@RequestMapping("/api/auth") // Mapeia todas as requisições para este controlador para o caminho base "/api/auth".
@CrossOrigin(origins = "http://localhost:3000") // Habilita o CORS para permitir requisições do frontend em http://localhost:3000.
public class AuthController {

    private final UserService userService; // Declara uma instância final de UserService, que será injetada pelo Spring.

    // Construtor para injeção de dependência do UserService.
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint para registrar um novo usuário.
     * @param userDto DTO contendo os dados do usuário a serem registrados.  A anotação @Valid garante que os dados sejam validados de acordo com as restrições definidas em UserDto.
     * @return ResponseEntity contendo o token JWT em caso de sucesso ou uma mensagem de erro em caso de falha.
     */
    @PostMapping("/register") // Mapeia requisições POST para "/api/auth/register".
    public ResponseEntity<?> register(@RequestBody @Valid UserDto userDto) {
        try {
            String token = userService.registerUser(userDto); // Chama o serviço para registrar o usuário e obter o token.
            return ResponseEntity.ok(token); // Retorna o token JWT com status 200 OK.
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // Retorna erro 400 Bad Request para argumentos inválidos.
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.status(409).body(e.getMessage()); // Retorna erro 409 Conflict para nome de usuário já existente.
        } catch (Exception e) {
            return ResponseEntity // Retorna erro 500 Internal Server Error para outras exceções.
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao registrar o usuário");
        }
    }

    /**
     * Endpoint para autenticar um usuário e obter um token JWT.
     * @param loginDto DTO contendo o nome de usuário e senha para login.
     * @return ResponseEntity contendo o token JWT e o role do usuário no header em caso de sucesso, ou uma mensagem de erro em caso de falha.
     */
    @PostMapping("/login") // Mapeia requisições POST para "/api/auth/login".
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto loginDto) {
        try {
            // autentica e gera token
            String token = userService.authenticateUser(
                loginDto.getUsername(),
                loginDto.getPassword()
            );

            // busca a role do usuário para enviar no header
            User u = userService.getUserByUsername(loginDto.getUsername());
            String role = u.getRole().name();

            return ResponseEntity.ok() // Retorna o token e o role com status 200 OK.
                    .header("Role", role) // Adiciona o role do usuário ao header da resposta.
                    .body(token); // Adiciona o token ao corpo da resposta.

        } catch (BadCredentialsException e) {
            // senha errada
            return ResponseEntity // Retorna erro 401 Unauthorized para credenciais inválidas (senha errada).
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciais inválidas");
        } catch (AuthenticationException e) {
            // autenticação falhou
            return ResponseEntity // Retorna erro 401 Unauthorized para falha geral na autenticação.
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Falha na autenticação");
        } catch (IllegalArgumentException e) {
            // usuário não existe
            return ResponseEntity  // Retorna erro 400 Bad Request para usuário não encontrado.
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity // Retorna erro 500 Internal Server Error para outras exceções.
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao autenticar");
        }
    }

    /**
     * Endpoint para atualizar os dados de um usuário.
     * Apenas o próprio usuário ou um administrador podem atualizar os dados do usuário.
     * @param id O ID do usuário a ser atualizado, extraído da URL.
     * @param userDto DTO contendo os novos dados do usuário.
     * @return ResponseEntity com uma mensagem de sucesso ou erro.
     */
    @PutMapping("/{id}") // Mapeia requisições PUT para "/api/auth/{id}".
    @PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')") // Garante que apenas o próprio usuário ou um administrador possa acessar este método.
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody @Valid UserDto userDto) {
        try {
            userService.updateUser(id, userDto); // Chama o serviço para atualizar o usuário.
            return ResponseEntity.ok("Usuário atualizado com sucesso."); // Retorna mensagem de sucesso com status 200 OK.
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.badRequest().body("Nome de usuário já existe."); // Retorna erro 400 Bad Request para nome de usuário já existente.
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());  // Retorna erro 404 Not Found se o usuário não for encontrado.
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar o usuário."); // Retorna erro 500 Internal Server Error para outras exceções.
        }
    }

    /**
     * Endpoint para deletar um usuário.
     * Apenas o próprio usuário ou um administrador podem deletar o usuário.
     * @param id O ID do usuário a ser deletado, extraído da URL.
     * @return ResponseEntity com uma mensagem de sucesso ou erro.
     */
    @DeleteMapping("/{id}") // Mapeia requisições DELETE para "/api/auth/{id}".
    @PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')") // Garante que apenas o próprio usuário ou um administrador possa acessar este método.
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);  // Chama o serviço para deletar o usuário.
            return ResponseEntity.ok("Usuário deletado com sucesso."); // Retorna mensagem de sucesso com status 200 OK.
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao deletar o usuário."); // Retorna erro 500 Internal Server Error para outras exceções.
        }
    }
}