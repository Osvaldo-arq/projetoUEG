package project.poem.application.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.poem.application.dto.CommentDto;
import project.poem.domain.model.Comment;
import project.poem.domain.model.Poem;
import project.poem.domain.repository.CommentRepository;
import project.poem.domain.repository.PoemRepository;
import project.poem.domain.repository.UserRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepo;
    private final PoemRepository poemRepo;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepo, PoemRepository poemRepo, UserRepository userRepository) {
        this.commentRepo = commentRepo;
        this.poemRepo = poemRepo;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentDto> listByPoemId(Long poemId) {
        return commentRepo.findByPoemId(poemId).stream().map(this::toDto).toList();
    }

    @Transactional
    public CommentDto create(CommentDto dto) {
        Comment c = new Comment();
        c.setAuthor(dto.getAuthor());
        c.setContent(dto.getContent());
        c.setCommentDate(dto.getCommentDate());

        Poem poem = poemRepo.findById(dto.getPoemId())
                .orElseThrow(() -> new IllegalArgumentException("Poema não encontrado com id: " + dto.getPoemId()));
        c.setPoem(poem);

        // Verificar se o usuário é o autor do comentário ou se é ADMIN
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loggedUser = auth.getName();
        if (!loggedUser.equals(dto.getAuthor()) && !auth.getAuthorities().toString().contains("ROLE_ADMIN")) {
            throw new SecurityException("Usuário não autorizado a comentar neste poema.");
        }

        return toDto(commentRepo.save(c));
    }

    @Transactional
    public CommentDto update(Long id, CommentDto dto) {
        Comment comment = commentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comentário não encontrado com id: " + id));

        // Verificar se o usuário é o autor do comentário ou se é ADMIN
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loggedUser = auth.getName();
        if (!loggedUser.equals(comment.getAuthor()) && !auth.getAuthorities().toString().contains("ROLE_ADMIN")) {
            throw new SecurityException("Usuário não autorizado a editar este comentário.");
        }

        comment.setAuthor(dto.getAuthor());
        comment.setContent(dto.getContent());
        comment.setCommentDate(dto.getCommentDate());

        return toDto(commentRepo.save(comment));
    }

    @Transactional
    public void delete(Long id) {
        Comment comment = commentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comentário não encontrado com id: " + id));

        // Verificar se o usuário é o autor do comentário ou se é ADMIN
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loggedUser = auth.getName();
        if (!loggedUser.equals(comment.getAuthor()) && !auth.getAuthorities().toString().contains("ROLE_ADMIN")) {
            throw new SecurityException("Usuário não autorizado a excluir este comentário.");
        }

        commentRepo.deleteById(id);
    }

    private CommentDto toDto(Comment c) {
        CommentDto dto = new CommentDto();
        dto.setId(c.getId());
        dto.setAuthor(c.getAuthor());
        dto.setContent(c.getContent());
        dto.setCommentDate(c.getCommentDate());
        dto.setPoemId(c.getPoem().getId());
        return dto;
    }

    // Verificar se o usuário é o autor de um comentário
    public boolean isAuthorOfComment(String username, Long commentId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comentário não encontrado com id: " + commentId));
        return comment.getAuthor().equals(username);
    }
}
