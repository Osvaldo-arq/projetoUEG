package project.poem.api.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.poem.api.mapper.UserMapper;
import project.poem.application.dto.LoginDto;
import project.poem.application.dto.UserDto;
import project.poem.application.service.UserService;
import project.poem.domain.model.User;
import project.poem.infrastructure.security.UsernameAlreadyExistsException;

@RestController // Indica que esta classe é um controlador REST.
@RequestMapping("/api/auth") // Mapeia as URLs para este controlador para começarem com "/api/auth".
@CrossOrigin(origins = "http://localhost:3000") // Habilita CORS para permitir requisições de http://localhost:3000.
public class AuthController {

    private final UserService userService; // Declara o serviço UserService, que será injetado pelo Spring.
    private final UserMapper userMapper; // Declara o mapper UserMapper, que será injetado pelo Spring.

    // Construtor para injeção de dependência do UserService e UserMapper.
    public AuthController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    /**
     * Endpoint para registrar um novo usuário.
     * @param userDto DTO contendo os dados do usuário a serem registrados.  A anotação @Valid faz a validação do DTO.
     * @return ResponseEntity contendo o token JWT em caso de sucesso, ou uma mensagem de erro em caso de falha.
     */
    @PostMapping("/register") // Mapeia requisições POST para "/api/auth/register".
    public ResponseEntity<?> register(@RequestBody @Valid UserDto userDto) {
        try {
            String token = userService.registerUser(userDto); // Chama o serviço para registrar o usuário.
            return ResponseEntity.ok(token); // Retorna o token com status 200 OK.
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // Retorna erro 400 Bad Request para argumentos inválidos.
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.status(409).body(e.getMessage()); // Retorna erro 409 Conflict para usuário já existente.
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // Retorna erro 500 Internal Server Error.
                                 .body("Erro interno ao registrar o usuário");
        }
    }

    /**
     * Endpoint para autenticar um usuário e obter um token JWT.
     * @param loginDto DTO contendo o nome de usuário e senha para login.
     * @return ResponseEntity contendo o token JWT e o role do usuário no header em caso de sucesso,
     * ou uma mensagem de erro em caso de falha.
     */
    @PostMapping("/login") // Mapeia requisições POST para "/api/auth/login".
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto loginDto) {
        try {
            String token = userService.authenticateUser(loginDto.getUsername(), loginDto.getPassword()); // Autentica o usuário.
            User u = userService.getUserByUsername(loginDto.getUsername()); // Busca o usuário pelo nome de usuário.
            String role = u.getRole().name(); // Obtém o role do usuário.

            return ResponseEntity.ok() // Retorna resposta 200 OK com token e role.
                                 .header("Role", role) // Adiciona o role ao header da resposta.
                                 .body(token); // Adiciona o token ao corpo da resposta.
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // Retorna erro 401 Unauthorized para credenciais inválidas.
                                 .body("Credenciais inválidas");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED) // Retorna erro 401 Unauthorized para falha de autenticação.
                                 .body("Falha na autenticação");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST) // Retorna erro 400 Bad Request para usuário não encontrado.
                                 .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // Retorna erro 500 Internal Server Error.
                                 .body("Erro interno ao autenticar");
        }
    }

    /**
     * Endpoint para atualizar os dados de um usuário.
     * Apenas o próprio usuário ou um administrador podem acessar este método.
     * @param id O ID do usuário a ser atualizado, extraído da URL.
     * @param userDto DTO contendo os novos dados do usuário.  A anotação @Valid faz a validação do DTO.
     * @return ResponseEntity com uma mensagem de sucesso ou erro.
     */
    @PutMapping("/{id}") // Mapeia requisições PUT para "/api/auth/{id}".
    @PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')") // Garante que apenas o próprio usuário ou um admin pode atualizar.
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody @Valid UserDto userDto) {
        try {
            userService.updateUser(id, userDto); // Chama o serviço para atualizar o usuário.
            return ResponseEntity.ok("Usuário atualizado com sucesso."); // Retorna mensagem de sucesso.
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.badRequest().body("Nome de usuário já existe."); // Retorna erro 400 para usuário já existente.
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage()); // Retorna erro 404 para usuário não encontrado.
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar o usuário."); // Retorna erro 500.
        }
    }

    /**
     * Endpoint para deletar um usuário.
     * Apenas o próprio usuário ou um administrador podem acessar este método.
     * @param id O ID do usuário a ser deletado, extraído da URL.
     * @return ResponseEntity com uma mensagem de sucesso ou erro.
     */
    @DeleteMapping("/{id}") // Mapeia requisições DELETE para "/api/auth/{id}".
    @PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')") // Garante que apenas o próprio usuário ou um admin pode deletar.
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id); // Chama o serviço para deletar o usuário.
            return ResponseEntity.ok("Usuário deletado com sucesso."); // Retorna mensagem de sucesso.
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao deletar o usuário."); // Retorna erro 500.
        }
    }

    /**
     * Endpoint para obter todos os usuários.
     * Apenas administradores podem acessar este método.
     * @return ResponseEntity contendo a lista de UserDto.
     */
    @GetMapping("/users") // Mapeia requisições GET para "/api/auth/users".
    @PreAuthorize("hasRole('ADMIN')") // Garante que apenas usuários com role 'ADMIN' podem acessar.
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers(); // Busca a lista de todos os usuários.
        List<UserDto> userDtos = users.stream() // Converte a lista de User para uma lista de UserDto usando Stream.
                                      .map(userMapper::toDto) // Mapeia cada User para UserDto usando o mapper.
                                      .collect(Collectors.toList()); // Coleta os UserDto em uma lista.
        return ResponseEntity.ok(userDtos); // Retorna a lista de UserDto com status 200 OK.
    }
}