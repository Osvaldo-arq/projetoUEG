package project.poem.application.service;

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
     *
     * @param userRepository        Repositório para acessar os dados dos usuários.
     * @param jwtTokenProvider      Componente para gerar tokens JWT.
     * @param passwordEncoder       Componente para codificar senhas.
     * @param authenticationManager Gerenciador de autenticação do Spring Security.
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
     * Valida se as senhas coincidem, verifica se o nome de usuário já existe,
     * codifica a senha, define a role e salva o usuário no banco de dados.
     * Em seguida, gera um token JWT para o usuário registrado.
     *
     * @param userDto DTO contendo os dados do novo usuário.
     * @return O token JWT gerado para o usuário registrado.
     * @throws IllegalArgumentException         Se as senhas não coincidem.
     * @throws UsernameAlreadyExistsException Se o nome de usuário já estiver em uso.
     */
    public String registerUser(UserDto userDto) {
        // Verifica se a senha e a confirmação de senha são iguais.
        if (!userDto.getPassword().equals(userDto.getConfirmPassword())) {
            throw new IllegalArgumentException("Senhas não coincidem");
        }
        // Verifica se já existe um usuário com o nome de usuário fornecido.
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new UsernameAlreadyExistsException("Nome de usuário já em uso.");
        }
        // Cria uma nova entidade de usuário.
        User user = new User();
        user.setUsername(userDto.getUsername());
        // Codifica a senha utilizando o BCryptPasswordEncoder antes de salvar.
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        // Define a role do usuário, convertendo a string para um enum Role.
        user.setRole(Role.valueOf(userDto.getRole().toUpperCase()));
        // Salva o novo usuário no banco de dados.
        userRepository.save(user);
        // Gera um token JWT para o usuário recém-registrado.
        return jwtTokenProvider.createToken(user.getUsername(), user.getRole());
    }

    /**
     * Autentica um usuário existente no sistema.
     * Utiliza o AuthenticationManager do Spring Security para realizar a autenticação com as credenciais fornecidas.
     * Se a autenticação for bem-sucedida, gera um token JWT para o usuário autenticado.
     *
     * @param username O nome de usuário do usuário a ser autenticado.
     * @param password A senha do usuário a ser autenticado.
     * @return O token JWT gerado para o usuário autenticado.
     * @throws org.springframework.security.core.AuthenticationException Se a autenticação falhar.
     * @throws IllegalArgumentException Se o usuário não for encontrado.
     */
    public String authenticateUser(String username, String password) {
        try {
            // Tenta autenticar o usuário utilizando o AuthenticationManager.
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (org.springframework.security.core.AuthenticationException e) {
            // Captura exceções de autenticação (por exemplo, credenciais inválidas).
            System.out.println("Erro na autenticação: " + e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            // Captura exceções de argumentos inválidos.
            System.out.println("Erro nos argumentos: " + e.getMessage());
            throw e;
        }

        // Busca o usuário no banco de dados pelo nome de usuário.
        User user = userRepository.findByUsername(username)
            // Lança uma exceção se o usuário não for encontrado.
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        // Gera um token JWT para o usuário autenticado.
        return jwtTokenProvider.createToken(user.getUsername(), user.getRole());
    }

    /**
     * Atualiza os dados de um usuário existente no sistema.
     * Busca o usuário pelo ID, verifica se o novo nome de usuário já existe (para outros usuários),
     * atualiza os campos fornecidos (incluindo a senha, se fornecida), e salva as alterações.
     *
     * @param id      O ID do usuário a ser atualizado.
     * @param userDto DTO contendo os dados atualizados do usuário.
     * @throws UsernameNotFoundException    Se o usuário com o ID fornecido não for encontrado.
     * @throws UsernameAlreadyExistsException Se o novo nome de usuário já estiver em uso por outro usuário.
     */
    public void updateUser(Long id, UserDto userDto) {
        // Busca o usuário pelo ID. Lança exceção se não encontrado.
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        // Verifica se o novo nome de usuário já existe para outro usuário.
        if (!user.getUsername().equals(userDto.getUsername()) &&
            userRepository.existsByUsername(userDto.getUsername())) {
            throw new UsernameAlreadyExistsException("Nome de usuário já em uso.");
        }

        // Atualiza os campos do usuário.
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        // Atualiza a senha apenas se uma nova senha for fornecida.
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        user.setRole(Role.valueOf(userDto.getRole()));
        // Salva as alterações no banco de dados.
        userRepository.save(user);
    }

    /**
     * Deleta um usuário do sistema com base no ID fornecido.
     *
     * @param id O ID do usuário a ser deletado.
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

}