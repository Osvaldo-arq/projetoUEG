package project.poem.api.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.poem.application.dto.PoemDto;
import project.poem.application.service.LikeService;
import project.poem.application.service.PoemService;
import project.poem.domain.model.User;
import project.poem.domain.repository.UserRepository; // Import UserRepository

/**
 * Controlador REST para operações relacionadas a poemas.
 * Este controlador expõe endpoints sob o caminho base "/api/poems".
 */
@RestController
@RequestMapping("/api/poems")
public class PoemController {

    private final PoemService poemService;
    private final LikeService likeService;
    private final UserRepository userRepository; // Adiciona UserRepository

    /**
     * Construtor para injetar as dependências necessárias.
     *
     * @param poemService O serviço responsável pela lógica de negócios dos poemas.
     * @param likeService O serviço responsável pela lógica de negócios das curtidas.
     * @param userRepository O repositório para acessar os dados dos usuários.
     */
    public PoemController(PoemService poemService, LikeService likeService, UserRepository userRepository) {
        this.poemService = poemService;
        this.likeService = likeService;
        this.userRepository = userRepository;
    }

    /**
     * Endpoint para listar todos os poemas.
     * Retorna uma lista de objetos PoemDto.
     *
     * @return ResponseEntity contendo a lista de poemas com status 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<PoemDto>> listPoems() {
        return ResponseEntity.ok(poemService.listAll());
    }

    /**
     * Endpoint para obter um poema específico pelo seu ID.
     * Retorna um objeto PoemDto correspondente ao ID fornecido.
     *
     * @param id O ID do poema a ser buscado.
     * @return ResponseEntity contendo o PoemDto com status 200 (OK).
     */
    @GetMapping("/{id}")
    public ResponseEntity<PoemDto> getPoem(@PathVariable Long id) {
        return ResponseEntity.ok(poemService.getById(id));
    }

    /**
     * Endpoint para criar um novo poema ou atualizar um poema existente.
     * Recebe os dados do poema no corpo da requisição.
     *
     * @param dto Objeto PoemDto contendo os dados do poema a ser criado ou atualizado.
     * As anotações `@Valid` garantem que os dados recebidos sejam validados.
     * @return ResponseEntity contendo o PoemDto criado ou atualizado com status 200 (OK).
     */
    @PostMapping
    public ResponseEntity<PoemDto> upsertPoem(@Valid @RequestBody PoemDto dto) {
        return ResponseEntity.ok(poemService.createOrUpdate(dto));
    }

    /**
     * Endpoint para deletar um poema pelo seu ID.
     *
     * @param id O ID do poema a ser deletado.
     * @return ResponseEntity com status 204 (No Content) indicando sucesso na deleção.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePoem(@PathVariable Long id) {
        poemService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para curtir um poema.
     * O usuário deve estar autenticado para realizar esta ação.
     * @param id O ID do poema a ser curtido.
     * @return ResponseEntity com status 200 (OK) indicando sucesso na ação.
     */
    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> likePoem(@PathVariable Long id) {
        likeService.likePoem(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint para descurtir um poema.
     * O usuário deve estar autenticado para realizar esta ação.
     * @param id O ID do poema a ser descurtido.
     * @return ResponseEntity com status 204 (No Content) indicando sucesso na ação.
     */
    @DeleteMapping("/{id}/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> unlikePoem(@PathVariable Long id) {
        likeService.unlikePoem(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint para contar o número de curtidas em um poema.
     * O usuário deve estar autenticado para visualizar esta informação.
     * @param id O ID do poema cujo número de curtidas será contado.
     * @return ResponseEntity contendo o número total de curtidas com status 200 (OK).
     */
    @GetMapping("/{id}/likes")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Long> countLikes(@PathVariable Long id) {
        long total = likeService.countLikes(id);
        return ResponseEntity.ok(total);
    }

    /**
     * Endpoint para verificar se o usuário autenticado curtiu um poema específico.
     * O usuário deve estar autenticado para realizar esta verificação.
     * @param id O ID do poema a ser verificado.
     * @return ResponseEntity contendo um booleano (true se curtiu, false caso contrário) com status 200 (OK).
     */
    @GetMapping("/{id}/likes/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Boolean> hasUserLiked(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        boolean liked = likeService.hasLiked(id, user.getId());
        return ResponseEntity.ok(liked);
    }
}