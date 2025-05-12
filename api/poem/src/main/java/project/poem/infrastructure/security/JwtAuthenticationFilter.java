package project.poem.infrastructure.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import project.poem.application.service.UserDetailsServices;
import project.poem.domain.model.User;

/**
 * Filtro de autenticação JWT que intercepta todas as requisições para verificar a presença
 * e validade do token JWT no cabeçalho "Authorization".
 * Este filtro é executado uma vez por requisição.
 */
@WebFilter("/*")
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsServices userDetailsService;

    /**
     * Construtor para injetar as dependências necessárias.
     *
     * @param jwtTokenProvider   Componente responsável por gerar e validar tokens JWT.
     * @param userDetailsService Serviço responsável por carregar os detalhes do usuário.
     */
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, UserDetailsServices userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Método principal do filtro que é executado para cada requisição.
     * Extrai o token da requisição, valida-o e, se válido, autentica o usuário
     * definindo a autenticação no contexto de segurança do Spring.
     *
     * @param request     A requisição HTTP.
     * @param response    A resposta HTTP.
     * @param filterChain A cadeia de filtros para continuar o processamento da requisição.
     * @throws ServletException Em caso de erro no servlet.
     * @throws IOException      Em caso de erro de I/O.
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Extrai o token JWT do cabeçalho da requisição.
        String token = getTokenFromRequest(request);

        // Verifica se o token existe e é válido.
        if (token != null && jwtTokenProvider.validateToken(token)) {
            // Obtém o nome de usuário (subject) do token.
            String username = jwtTokenProvider.getUsername(token);

            // Carrega os detalhes do usuário com base no nome de usuário obtido do token.
            User user = (User) userDetailsService.loadUserByUsername(username);

            // Cria um objeto de autenticação do Spring Security (UsernamePasswordAuthenticationToken)
            // com o usuário carregado, sem as credenciais (null), e suas autoridades (roles).
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities());

            // Define a autenticação no contexto de segurança do Spring Security.
            // Isso indica que o usuário está autenticado para esta requisição.
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Continua o processamento da requisição, passando para o próximo filtro na cadeia.
        filterChain.doFilter(request, response);
    }

    /**
     * Método utilitário para extrair o token JWT do cabeçalho "Authorization" da requisição.
     * O token é esperado no formato "Bearer <token>".
     *
     * @param request A requisição HTTP.
     * @return O token JWT sem o prefixo "Bearer ", ou null se o cabeçalho não estiver presente ou no formato incorreto.
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        // Verifica se o cabeçalho "Authorization" existe e começa com "Bearer ".
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            // Retorna o token, removendo o prefixo "Bearer " (7 caracteres).
            return bearerToken.substring(7);
        }
        // Retorna null se o cabeçalho não estiver presente ou não estiver no formato esperado.
        return null;
    }
}