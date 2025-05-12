package project.poem.infrastructure.security;

import java.security.Key;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import project.poem.domain.model.Role;

/**
 * Componente responsável por fornecer funcionalidades relacionadas a tokens JWT,
 * como criação, validação e extração de informações.
 */
@Component
public class JwtTokenProvider {

    /**
     * Chave secreta usada para assinar e verificar os tokens JWT.
     * O valor é injetado da configuração (application.properties ou application.yml).
     * É crucial manter essa chave em segredo.
     */
    @Value("${jwt.secret}")
    private String secretKey;

    /**
     * Tempo de validade do token JWT em milissegundos.
     * O valor é injetado da configuração.
     */
    @Value("${jwt.expiration}")
    private long validityInMs;

    /**
     * Obtém a chave de assinatura a partir da chave secreta codificada em Base64.
     *
     * @return A chave de assinatura.
     */
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Cria um novo token JWT para o usuário com o nome de usuário e role fornecidos.
     * O token contém o nome de usuário como subject e a role como uma claim.
     * Também inclui as autoridades compatíveis com o Spring Security.
     *
     * @param username O nome de usuário a ser incluído no token.
     * @param role     A role do usuário a ser incluída no token.
     * @return O token JWT gerado.
     */
    public String createToken(String username, Role role) {
        // Define as claims (informações) que serão incluídas no token.
        Claims claims = Jwts.claims().setSubject(username); // Define o subject (geralmente o nome de usuário).
        claims.put("role", role.name()); // Adiciona a role como uma claim.
        claims.put("authorities", List.of("ROLE_" + role.name())); // Adiciona as autoridades (roles) compatíveis com Spring Security.

        // Define as datas de emissão e expiração do token.
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + validityInMs); // Calcula a data de expiração.

        // Constrói o token JWT.
        return Jwts.builder()
            .setClaims(claims) // Define as claims.
            .setIssuedAt(now) // Define a data de emissão.
            .setExpiration(expiryDate) // Define a data de expiração.
            .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Assina o token usando a chave e o algoritmo HS256.
            .compact(); // Compacta o token para uma string.
    }

    /**
     * Valida um token JWT verificando sua assinatura e se ele não expirou.
     *
     * @param token O token JWT a ser validado.
     * @return true se o token for válido, false caso contrário.
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token); // Tenta analisar o token. Se não houver exceção, é válido.
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Captura exceções se o token for inválido ou mal formado.
            return false;
        }
    }

    /**
     * Analisa um token JWT e retorna o objeto Jws<Claims> contendo as claims.
     *
     * @param token O token JWT a ser analisado.
     * @return O objeto Jws<Claims> contendo as claims do token.
     */
    public Jws<Claims> parseToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey()) // Define a chave de assinatura para verificar o token.
            .build()
            .parseClaimsJws(cleanToken(token)); // Analisa o token após remover o prefixo "Bearer ".
    }

    /**
     * Obtém o nome de usuário (subject) do token JWT.
     *
     * @param token O token JWT do qual extrair o nome de usuário.
     * @return O nome de usuário contido no token.
     */
    public String getUsername(String token) {
        return parseToken(token).getBody().getSubject(); // Obtém o subject da claim do token.
    }

    /**
     * Obtém a role do usuário do token JWT.
     *
     * @param token O token JWT do qual extrair a role.
     * @return A role do usuário contida no token.
     */
    public Role getRole(String token) {
        String role = (String) parseToken(token).getBody().get("role"); // Obtém a claim "role" do token.
        return Role.valueOf(role); // Converte a string da role para a enumeração Role.
    }

    /**
     * Obtém a lista de roles (autoridades) do token JWT.
     *
     * @param token O token JWT do qual extrair as roles.
     * @return Uma lista de strings representando as roles do usuário.
     */
    public List<String> getRoles(String token) {
        Claims claims = parseToken(token).getBody(); // Obtém as claims do token.
        Object authorities = claims.get("authorities"); // Obtém a claim "authorities".
        // Verifica se a claim "authorities" é uma lista de strings.
        if (authorities instanceof List<?> list) {
            return list.stream()
                .filter(item -> item instanceof String) // Filtra apenas os elementos que são strings.
                .map(item -> (String) item) // Cast para String.
                .toList(); // Converte o stream para uma lista.
        }
        return List.of(); // Retorna uma lista vazia se a claim não for uma lista de strings.
    }

    /**
     * Remove o prefixo "Bearer " do token, se presente.
     *
     * @param token O token JWT com ou sem o prefixo "Bearer ".
     * @return O token sem o prefixo "Bearer ".
     */
    private String cleanToken(String token) {
        return token.startsWith("Bearer ") ? token.substring(7) : token;
    }
}