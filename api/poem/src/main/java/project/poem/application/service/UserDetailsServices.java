package project.poem.application.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import project.poem.domain.model.User;
import project.poem.domain.repository.UserRepository;

/**
 * Serviço responsável por carregar os detalhes de um usuário para autenticação
 * utilizando o Spring Security. Implementa a interface UserDetailsService.
 */
@Service
public class UserDetailsServices implements UserDetailsService {

    private final UserRepository userRepo;

    /**
     * Construtor para injetar a dependência de UserRepository.
     *
     * @param userRepo O repositório para acessar os dados dos usuários.
     */
    public UserDetailsServices(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    /**
     * Carrega os detalhes de um usuário com base no seu nome de usuário.
     * Este método é utilizado pelo Spring Security durante o processo de autenticação.
     *
     * @param username O nome de usuário do usuário a ser carregado.
     * @return Um objeto UserDetails contendo as informações do usuário para autenticação.
     * @throws UsernameNotFoundException Se nenhum usuário for encontrado com o nome de usuário fornecido.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Busca o usuário no banco de dados pelo nome de usuário.
        User u = userRepo.findByUsername(username)
            // Se o usuário não for encontrado, lança uma exceção UsernameNotFoundException.
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));

        // Imprime o nome de usuário encontrado no console (para fins de depuração).
        System.out.println("Usuário encontrado: " + u.getUsername());

        // Constrói um objeto UserDetails do Spring Security com as informações do usuário encontrado.
        return org.springframework.security.core.userdetails.User
            .withUsername(u.getUsername()) // Define o nome de usuário.
            .password(u.getPassword())     // Define a senha.
            .authorities("ROLE_" + u.getRole().name()) // Define as autoridades (roles) do usuário.
                                                      // Importante: as roles no Spring Security geralmente têm o prefixo "ROLE_".
            .accountExpired(false)          // Indica se a conta expirou.
            .accountLocked(false)           // Indica se a conta está bloqueada.
            .credentialsExpired(false)     // Indica se as credenciais (senha) expiraram.
            .disabled(false)                // Indica se o usuário está desabilitado.
            .build();                       // Constrói o objeto UserDetails.
    }
}