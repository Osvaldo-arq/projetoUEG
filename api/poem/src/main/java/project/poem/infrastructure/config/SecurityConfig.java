package project.poem.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import project.poem.application.service.UserDetailsServices;
import project.poem.infrastructure.security.JwtAuthenticationFilter;
import project.poem.infrastructure.security.JwtTokenProvider;

/**
 * Classe de configuração para o Spring Security.
 * Define as regras de segurança para as requisições HTTP,
 * configura o gerenciamento de sessão, o encoder de senha,
 * o gerenciador de autenticação e adiciona o filtro de autenticação JWT.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsServices userDetailsService;

    /**
     * Construtor para injetar as dependências necessárias.
     *
     * @param jwtTokenProvider   Componente responsável por gerar e validar tokens JWT.
     * @param userDetailsService Serviço responsável por carregar os detalhes do usuário.
     */
    public SecurityConfig(JwtTokenProvider jwtTokenProvider, UserDetailsServices userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Configura a cadeia de filtros de segurança para as requisições HTTP.
     *
     * @param http Objeto HttpSecurity para configurar as regras de segurança.
     * @return O SecurityFilterChain construído.
     * @throws Exception Em caso de erro durante a configuração.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Desabilita o CSRF (Cross-Site Request Forgery) para permitir requisições de diferentes domínios.
            .csrf(csrf -> csrf.disable())
            // Configura o gerenciamento de sessão para ser stateless, pois a autenticação será baseada em JWT.
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Define as regras de autorização para as requisições HTTP.
            .authorizeHttpRequests(auth -> auth
                // Permite acesso irrestrito ao endpoint de autenticação ("/api/auth/**").
                .requestMatchers("/api/auth/**").permitAll()
                // Permite acesso ao endpoint "/api/poems" para usuários com as roles ROLE_USER ou ROLE_ADMIN.
                .requestMatchers("/api/poems/**").hasAnyRole("USER", "ADMIN")
                // Permite acesso aos endpoints de profile para usuários com as roles ROLE_USER ou ROLE_ADMIN.
                .requestMatchers("/api/profile/**").hasAnyRole("USER", "ADMIN")
                // Exige autenticação para qualquer outra requisição que não corresponda aos padrões anteriores.
                .anyRequest().authenticated()
            )
            // Configura o serviço UserDetailsService para buscar os detalhes do usuário durante a autenticação.
            .userDetailsService(userDetailsService)
            // Adiciona o filtro de autenticação JWT antes do filtro padrão de autenticação por nome de usuário e senha.
            .addFilterBefore(
                new JwtAuthenticationFilter(jwtTokenProvider, userDetailsService), // Filtro personalizado para autenticação JWT.
                UsernamePasswordAuthenticationFilter.class // Filtro padrão do Spring Security para autenticação por username/password.
            );

        return http.build();
    }

    /**
     * Cria e configura o AuthenticationManager.
     * O AuthenticationManager é responsável por autenticar as credenciais do usuário.
     *
     * @param cfg Objeto AuthenticationConfiguration para obter o AuthenticationManager.
     * @return O AuthenticationManager configurado.
     * @throws Exception Em caso de erro ao obter o AuthenticationManager.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    /**
     * Cria e configura o BCryptPasswordEncoder.
     * O BCryptPasswordEncoder é utilizado para codificar as senhas dos usuários de forma segura.
     *
     * @return Uma instância do BCryptPasswordEncoder.
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}