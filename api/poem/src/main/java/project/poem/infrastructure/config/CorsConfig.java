package project.poem.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração para habilitar o CORS (Cross-Origin Resource Sharing) na aplicação.
 * CORS é um mecanismo que permite que recursos da web (fontes) em uma página da web
 * sejam solicitados de outra fonte fora do domínio da página original.
 * Isso é necessário porque os navegadores implementam a política de mesma origem
 * por razões de segurança.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Este método configura o CORS para a aplicação.
     * Ele é chamado automaticamente pelo Spring MVC.
     *
     * @param registry Registro para configurar o CORS.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica esta configuração a todas as URLs da aplicação.
            .allowedOrigins("http://localhost:3000") // Permite requisições originadas deste domínio (seu frontend React, provavelmente).
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite estes métodos HTTP.
            .allowedHeaders("*") // Permite todos os cabeçalhos na requisição.
            .allowCredentials(true); // Permite o envio de cookies junto com a requisição.
    }
}
