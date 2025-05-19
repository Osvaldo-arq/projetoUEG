package project.poem.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.poem.application.dto.CommentDto;
import project.poem.application.service.CommentService;

/**
 * Controlador REST para operações relacionadas a comentários em poemas.
 * Este controlador expõe endpoints sob o caminho base "/api/comments".
 */
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    /**
     * Construtor para injetar a dependência de CommentService.
     *
     * @param commentService O serviço responsável pela lógica de negócios dos comentários.
     */
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * Endpoint para listar os comentários de um poema específico.
     *
     * @param poemId O ID do poema para o qual os comentários devem ser listados.
     * @return ResponseEntity contendo a lista de CommentDto com status 200 (OK).
     */
    @GetMapping("/poem/{poemId}")
    public ResponseEntity<List<CommentDto>> listByPoem(@PathVariable Long poemId) {
        return ResponseEntity.ok(commentService.listByPoemId(poemId));
    }

    /**
     * Endpoint para criar um novo comentário.
     * A anotação `@PreAuthorize` garante que apenas o autor do comentário ou um administrador possa criar o comentário.
     *
     * @param dto Objeto CommentDto contendo os dados do novo comentário.
     * @return ResponseEntity contendo o CommentDto criado com status 200 (OK).
     */
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CommentDto> create(@RequestBody CommentDto dto, org.springframework.security.core.Authentication authentication) {
        dto.setAuthor(authentication.getName());      // Define o autor com base no usuário autenticado
        dto.setCommentDate(java.time.LocalDate.now()); // Define a data atual
        return ResponseEntity.ok(commentService.create(dto));
    }


    /**
     * Endpoint para atualizar um comentário existente.
     * A anotação `@PreAuthorize` garante que apenas o autor do comentário ou um administrador possa atualizar o comentário.
     *
     * @param id    O ID do comentário a ser atualizado.
     * @param dto   Objeto CommentDto contendo os novos dados do comentário.
     * @return ResponseEntity contendo o CommentDto atualizado com status 200 (OK).
     */
    @PreAuthorize("hasRole('ROLE_ADMIN') or @commentService.isAuthorOfComment(authentication.name, #dto.id)")
    @PutMapping("/{id}")
    public ResponseEntity<CommentDto> update(@PathVariable Long id, @RequestBody CommentDto dto) {
        return ResponseEntity.ok(commentService.update(id, dto));
    }

    /**
     * Endpoint para deletar um comentário.
     * A anotação `@PreAuthorize` garante que apenas o autor do comentário ou um administrador possa deletar o comentário.
     *
     * @param id O ID do comentário a ser deletado.
     * @return ResponseEntity com status 204 (No Content) indicando sucesso na deleção.
     */
    @PreAuthorize("hasRole('ROLE_ADMIN') or @commentService.isAuthorOfComment(authentication.name, #id)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
