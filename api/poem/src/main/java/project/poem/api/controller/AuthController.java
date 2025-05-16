package project.poem.api.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final UserMapper userMapper;

    public AuthController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    /**
     * Endpoint para registar um novo utilizador.
     * @param userDto DTO contendo os dados do utilizador a serem registados. A anotação @Valid faz a validação do DTO.
     * @return ResponseEntity contendo o token JWT em caso de sucesso, ou uma mensagem de erro em caso de falha.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserDto userDto) {
        try {
            String token = userService.registerUser(userDto);
            return ResponseEntity.ok(token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erro interno ao registar o utilizador");
        }
    }

    /**
     * Endpoint para autenticar um utilizador e obter um token JWT.
     * @param loginDto DTO contendo o nome de utilizador e senha para login.
     * @return ResponseEntity contendo o token JWT e o role do utilizador no header em caso de sucesso,
     * ou uma mensagem de erro em caso de falha.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto loginDto) {
        try {
            String token = userService.authenticateUser(loginDto.getUsername(), loginDto.getPassword());
            User u = userService.getUserByUsername(loginDto.getUsername());
            String role = u.getRole().name();
            String email = u.getEmail();

            // Cria um mapa para armazenar o token e o email
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("email", email);

            return ResponseEntity.ok()
                                 .header("Role", role)
                                 .body(responseData); // Retorna o mapa com token e email
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("Credenciais inválidas");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("Falha na autenticação");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erro interno ao autenticar");
        }
    }

    /**
     * Endpoint para atualizar os dados de um utilizador.
     * Apenas o próprio utilizador ou um administrador podem aceder a este método.
     * @param id O ID do utilizador a ser atualizado, extraído da URL.
     * @param userDto DTO contendo os novos dados do utilizador. A anotação @Valid faz a validação do DTO.
     * @return ResponseEntity com uma mensagem de sucesso ou erro.
     */
    @PutMapping("/{id}")
    @PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody @Valid UserDto userDto) {
        try {
            userService.updateUser(id, userDto);
            return ResponseEntity.ok("Utilizador atualizado com sucesso.");
        } catch (UsernameAlreadyExistsException e) {
            return ResponseEntity.badRequest().body("Nome de utilizador já existe.");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao atualizar o utilizador.");
        }
    }

    /**
     * Endpoint para eliminar um utilizador.
     * Apenas o próprio utilizador ou um administrador podem aceder a este método.
     * @param id O ID do utilizador a ser eliminado, extraído da URL.
     * @return ResponseEntity com uma mensagem de sucesso ou erro.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("#id == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Utilizador eliminado com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao eliminar o utilizador.");
        }
    }

    /**
     * Endpoint para obter todos os utilizadores.
     * Apenas administradores podem aceder a este método.
     * @return ResponseEntity contendo a lista de UserDto.
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDto> userDtos = users.stream()
                                      .map(userMapper::toDto)
                                      .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    /**
     * Endpoint para obter um utilizador pelo email.
     * Apenas o próprio utilizador ou um administrador podem aceder a este método.
     * @param email O email do utilizador a ser obtido, extraído da URL.
     * @return ResponseEntity contendo o UserDto correspondente ao email fornecido.
     */
    @GetMapping("/user/email/{email}")
    @PreAuthorize("hasRole('ADMIN') or #email == authentication.name") // Usa authentication.name
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        UserDto userDto = userMapper.toDto(user);
        return ResponseEntity.ok(userDto);
    }
}

