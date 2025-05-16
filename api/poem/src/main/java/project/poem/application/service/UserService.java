package project.poem.application.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.poem.application.dto.UserDto;
import project.poem.domain.model.Role;
import project.poem.domain.model.User;
import project.poem.domain.repository.UserRepository;
import project.poem.infrastructure.security.JwtTokenProvider;
import project.poem.infrastructure.security.UsernameAlreadyExistsException;

/**
 * Serviço responsável pela lógica de negócios relacionada aos usuários,
 * incluindo registro, autenticação, atualização e exclusão.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    /**
     * Construtor para injetar as dependências necessárias.
     */
    public UserService(UserRepository userRepository,
                       JwtTokenProvider jwtTokenProvider,
                       BCryptPasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Registra um novo usuário no sistema.
     *
     * @param userDto DTO contendo os dados do novo usuário.
     * @return Token JWT gerado para o usuário.
     */
    @Transactional
    public String registerUser(UserDto userDto) {
        if (!userDto.getPassword().equals(userDto.getConfirmPassword())) {
            throw new IllegalArgumentException("As senhas não coincidem.");
        }

        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new UsernameAlreadyExistsException("O nome de usuário já está em uso.");
        }

        Role role;
        try {
            role = Role.valueOf(userDto.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Role inválida: " + userDto.getRole());
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setRole(role);

        userRepository.save(user);

        return jwtTokenProvider.createToken(user.getUsername(), user.getRole());
    }

    /**
     * Autentica um usuário existente e retorna um token JWT.
     *
     * @param username Nome de usuário.
     * @param password Senha.
     * @return Token JWT.
     */
    public String authenticateUser(String username, String password) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (org.springframework.security.core.AuthenticationException authEx) {
            throw new IllegalArgumentException("Erro de autenticação: " + authEx.getMessage());
        } catch (IllegalArgumentException illegalArgEx) {
            throw new IllegalArgumentException("Argumento inválido: " + illegalArgEx.getMessage());
        }

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));

        return jwtTokenProvider.createToken(user.getUsername(), user.getRole());
    }

    /**
     * Atualiza os dados de um usuário.
     *
     * @param id      ID do usuário.
     * @param userDto DTO com os novos dados.
     */
    @Transactional
    public void updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o ID: " + id));

        if (!user.getUsername().equals(userDto.getUsername()) &&
            userRepository.existsByUsername(userDto.getUsername())) {
            throw new UsernameAlreadyExistsException("O nome de usuário já está em uso por outro usuário.");
        }

        Role role;
        try {
            role = Role.valueOf(userDto.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Role inválida: " + userDto.getRole());
        }

        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());

        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        user.setRole(role);
        userRepository.save(user);
    }

    /**
     * Exclui um usuário pelo ID.
     *
     * @param id ID do usuário.
     */
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UsernameNotFoundException("Usuário não encontrado com o ID: " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Retorna os dados de um usuário a partir do nome de usuário.
     *
     * @param username Nome de usuário.
     * @return Entidade User.
     */
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Retorna os dados de um usuário a partir do email.
     *
     * @param email Email do usuário.
     * @return Entidade User ou null se não encontrado.
     */
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.orElse(null);
    }
}
