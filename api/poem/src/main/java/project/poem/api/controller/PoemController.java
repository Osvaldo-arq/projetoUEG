package project.poem.api.controller;

import java.util.List;

import javax.validation.Valid; // Importa a anotação @Valid para validar o corpo da requisição.

import org.springframework.http.HttpStatus; // Importa o enum HttpStatus para códigos de status HTTP.
import org.springframework.http.ResponseEntity; // Importa a classe ResponseEntity para representar a resposta HTTP.
import org.springframework.security.access.prepost.PreAuthorize; // Importa a anotação @PreAuthorize para controlar o acesso aos métodos.
import org.springframework.security.core.Authentication; // Importa a interface Authentication para obter informações sobre o usuário autenticado.
import org.springframework.security.core.context.SecurityContextHolder; // Importa a classe SecurityContextHolder para acessar o contexto de segurança.
import org.springframework.web.bind.annotation.DeleteMapping; // Importa a anotação @DeleteMapping para mapear requisições HTTP DELETE.
import org.springframework.web.bind.annotation.GetMapping; // Importa a anotação @GetMapping para mapear requisições HTTP GET.
import org.springframework.web.bind.annotation.PathVariable; // Importa a anotação @PathVariable para extrair valores de variáveis da URL.
import org.springframework.web.bind.annotation.PostMapping; // Importa a anotação @PostMapping para mapear requisições HTTP POST.
import org.springframework.web.bind.annotation.RequestBody; // Importa a anotação @RequestBody para acessar o corpo da requisição.
import org.springframework.web.bind.annotation.RequestMapping; // Importa a anotação @RequestMapping para mapear o caminho base do controlador.
import org.springframework.web.bind.annotation.RestController; // Importa a anotação @RestController para indicar que esta classe é um controlador REST.
import org.springframework.web.server.ResponseStatusException;  // Importa a classe ResponseStatusException para tratar exceções de status HTTP.

import project.poem.application.dto.PoemDto; // Importa o DTO PoemDto para transferência de dados de poemas.
import project.poem.application.service.LikeService; // Importa o serviço LikeService para operações relacionadas a curtidas.
import project.poem.application.service.PoemService; // Importa o serviço PoemService para operações relacionadas a poemas.
import project.poem.domain.model.User; // Importa a entidade User do domínio.
import project.poem.domain.repository.UserRepository; // Importa o repositório UserRepository para acessar dados de usuários.

/**
 * Controlador REST para operações relacionadas a poemas.
 * Este controlador expõe endpoints sob o caminho base "/api/poems".
 */
@RestController
@RequestMapping("/api/poems")
public class PoemController {

    private final PoemService poemService; // Serviço para lógica de negócios de poemas.
    private final LikeService likeService; // Serviço para lógica de negócios de curtidas.
    private final UserRepository userRepository; // Repositório para acessar dados de usuários.

    /**
     * Construtor para injetar as dependências de PoemService, LikeService e UserRepository.
     *
     * @param poemService    O serviço PoemService a ser injetado.
     * @param likeService    O serviço LikeService a ser injetado.
     * @param userRepository O repositório UserRepository a ser injetado.
     */
    public PoemController(PoemService poemService, LikeService likeService, UserRepository userRepository) {
        this.poemService = poemService;
        this.likeService = likeService;
        this.userRepository = userRepository;
    }

    /**
     * Endpoint para listar todos os poemas.
     * Mapeado para GET em "/api/poems".
     *
     * @return ResponseEntity contendo a lista de PoemDto com status 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<PoemDto>> listPoems() {
        return ResponseEntity.ok(poemService.listAll());
    }

    /**
     * Endpoint para obter um poema específico por ID.
     * Mapeado para GET em "/api/poems/{id}".
     *
     * @param id O ID do poema a ser obtido.
     * @return ResponseEntity contendo o PoemDto do poema com o ID especificado com status 200 (OK).
     */
    @GetMapping("/{id}")
    public ResponseEntity<PoemDto> getPoem(@PathVariable Long id) {
        return ResponseEntity.ok(poemService.getById(id));
    }

    /**
     * Endpoint para listar os poemas curtidos pelo usuário autenticado.
     * Mapeado para GET em "/api/poems/liked".
     * Acesso restrito a usuários com role "USER" ou "ADMIN".
     *
     * @return ResponseEntity contendo a lista de PoemDto dos poemas curtidos pelo usuário.
     * @throws ResponseStatusException Se o usuário não estiver autenticado (status 401 - UNAUTHORIZED).
     */
    @GetMapping("/liked")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<PoemDto>> listLiked() {
        // Obtém o objeto Authentication do contexto de segurança.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // Obtém o nome de usuário do usuário autenticado.
        // Busca o usuário no banco de dados pelo nome de usuário.
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED)); // Lança exceção se o usuário não for encontrado.
        return ResponseEntity.ok(poemService.listLikedForUser(user.getId())); // Retorna a lista de poemas curtidos para o usuário.
    }

    /**
     * Endpoint para criar ou atualizar um poema.
     * Mapeado para POST em "/api/poems".
     *
     * @param dto O PoemDto contendo os dados do poema a ser criado ou atualizado.
     * @return ResponseEntity contendo o PoemDto do poema criado ou atualizado.
     */
    @PostMapping
    public ResponseEntity<PoemDto> upsertPoem(@Valid @RequestBody PoemDto dto) { // @Valid para validar o DTO.
        return ResponseEntity.ok(poemService.createOrUpdate(dto));
    }

    /**
     * Endpoint para deletar um poema por ID.
     * Mapeado para DELETE em "/api/poems/{id}".
     *
     * @param id O ID do poema a ser deletado.
     * @return ResponseEntity com status 204 (NO_CONTENT) indicando sucesso na deleção.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePoem(@PathVariable Long id) {
        poemService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para curtir um poema.
     * Mapeado para POST em "/api/poems/{id}/like".
     * Acesso restrito a usuários com role "USER" ou "ADMIN".
     *
     * @param id O ID do poema a ser curtido.
     * @return ResponseEntity com status 200 (OK) indicando sucesso na operação.
     */
    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> likePoem(@PathVariable Long id) {
        likeService.likePoem(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para remover a curtida de um poema.
     * Mapeado para DELETE em "/api/poems/{id}/like".
     * Acesso restrito a usuários com role "USER" ou "ADMIN".
     *
     * @param id O ID do poema do qual a curtida será removida.
     * @return ResponseEntity com status 204 (NO_CONTENT) indicando sucesso na operação.
     */
    @DeleteMapping("/{id}/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> unlikePoem(@PathVariable Long id) {
        likeService.unlikePoem(id);
        return ResponseEntity.noContent().build();
    }

     /**
     * Endpoint para contar o número de curtidas de um poema.
     * Mapeado para GET em "/api/poems/{id}/likes".
     * Acesso restrito a usuários com role "USER" ou "ADMIN".
     *
     * @param id O ID do poema para o qual as curtidas serão contadas.
     * @return ResponseEntity contendo o número de curtidas do poema.
     */
    @GetMapping("/{id}/likes")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Long> countLikes(@PathVariable Long id) {
        return ResponseEntity.ok(likeService.countLikes(id));
    }

    /**
     * Endpoint para verificar se o usuário autenticado curtiu um poema específico.
     * Mapeado para GET em "/api/poems/{id}/likes/user".
     * Acesso restrito a usuários com role "USER" ou "ADMIN".
     *
     * @param id O ID do poema a ser verificado.
     * @return ResponseEntity contendo um booleano indicando se o usuário curtiu o poema.
     * @throws ResponseStatusException Se o usuário não estiver autenticado (status 401 - UNAUTHORIZED).
     */
    @GetMapping("/{id}/likes/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Boolean> hasUserLiked(@PathVariable Long id) {
        // Obtém o objeto Authentication do contexto de segurança.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();  // Obtém o nome de usuário do usuário autenticado.
        // Busca o usuário no banco de dados pelo nome de usuário.
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED)); // Lança exceção se o usuário não for encontrado.
        return ResponseEntity.ok(likeService.hasLiked(id, user.getId())); // Retorna se o usuário curtiu o poema.
    }
}

