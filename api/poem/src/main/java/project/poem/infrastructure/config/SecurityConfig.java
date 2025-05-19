package project.poem.infrastructure.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import project.poem.application.service.UserDetailsServices;
import project.poem.infrastructure.security.JwtAuthenticationFilter;
import project.poem.infrastructure.security.JwtTokenProvider;

/**
 * Classe de configuração para o Spring Security.
 * Define CORS, JWT, regras de autorização e demais filtros.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsServices userDetailsService;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider,
                          UserDetailsServices userDetailsService) {
        this.jwtTokenProvider    = jwtTokenProvider;
        this.userDetailsService  = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Habilita CORS conforme CorsConfigurationSource abaixo
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Desabilita CSRF, pois usamos JWT
            .csrf(csrf -> csrf.disable())
            // Stateless: não mantemos sessão
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Definição de autorização por endpoint
            .authorizeHttpRequests(auth -> auth
                // Permite acesso a todos os usuários
                .requestMatchers("/api/auth/**").permitAll()
                // libera somente GET em /api/comments e GET /api/comments/{poemId}
                .requestMatchers(HttpMethod.GET, "/api/comments/**").permitAll()
                // libera somente GET em /api/poems e GET /api/poems/{id}
                .requestMatchers(HttpMethod.GET, "/api/poems/**").permitAll()
                // Permite acesso a todos os usuários, mas com autenticação
                .requestMatchers("/api/poems/**").hasAnyRole("USER", "ADMIN")
                // Permite acesso a todos os usuários, mas com autenticação
                .requestMatchers("/api/profile/**").hasAnyRole("USER", "ADMIN")
                // Permite acesso a todos os usuários, mas com autenticação
                .requestMatchers("/api/comments/**").hasAnyRole("USER", "ADMIN")
                // Permite acesso a todos os usuários, mas com autenticação
                .anyRequest().authenticated()
            )
            // Usa nosso UserDetailsService para carregar usuários
            .userDetailsService(userDetailsService)
            // Adiciona o filtro de JWT antes do filtro de autenticação padrão
            .addFilterBefore(
                new JwtAuthenticationFilter(jwtTokenProvider, userDetailsService),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    /**
     * Configura CORS para permitir chamadas do frontend em http://localhost:3000
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Permite chamadas do frontend em http://localhost:3000
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        // Permite chamadas de qualquer origem
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        // Permite cabeçalhos de qualquer origem
        config.setAllowedHeaders(List.of("*"));
        // Permite credenciais (cookies, autenticação)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica CORS a todas as rotas
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * Configura o AuthenticationManager para permitir a autenticação
     * com o BCryptPasswordEncoder.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    /**
     * Configura o BCryptPasswordEncoder para criptografar senhas.
     * Usado no AuthenticationManager.
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
