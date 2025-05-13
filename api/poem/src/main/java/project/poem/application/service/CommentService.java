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

/**
 * Serviço responsável pela lógica de negócios relacionada aos comentários em poemas.
 */
@Service
public class CommentService {

    private final CommentRepository commentRepo;
    private final PoemRepository poemRepo;
    @SuppressWarnings("unused")
    private final UserRepository userRepository;

    /**
     * Construtor para injetar as dependências necessárias.
     *
     * @param commentRepo    Repositório para acessar os dados dos comentários.
     * @param poemRepo       Repositório para acessar os dados dos poemas.
     * @param userRepository Repositório para acessar os dados dos usuários.
     */
    public CommentService(CommentRepository commentRepo, PoemRepository poemRepo, UserRepository userRepository) {
        this.commentRepo = commentRepo;
        this.poemRepo = poemRepo;
        this.userRepository = userRepository;
    }

    /**
     * Lista todos os comentários associados a um poema específico.
     * Este método é executado em uma transação somente leitura.
     *
     * @param poemId O ID do poema para o qual os comentários devem ser listados.
     * @return Uma lista de objetos CommentDto representando os comentários do poema.
     */
    @Transactional(readOnly = true)
    public List<CommentDto> listByPoemId(Long poemId) {
        return commentRepo.findByPoemId(poemId).stream().map(this::toDto).toList();
    }

    /**
     * Cria um novo comentário.
     * Este método é executado em uma transação.
     *
     * @param dto Objeto CommentDto contendo os dados do novo comentário.
     * @return Um objeto CommentDto representando o comentário criado.
     * @throws IllegalArgumentException Se o poema associado ao comentário não for encontrado.
     * @throws SecurityException          Se o usuário logado não for o autor do comentário e não for um administrador.
     */
    @Transactional
    public CommentDto create(CommentDto dto) {
        Comment c = new Comment();
        c.setAuthor(dto.getAuthor());
        c.setContent(dto.getContent());
        c.setCommentDate(dto.getCommentDate());

        // Busca o poema pelo ID fornecido no DTO.
        Poem poem = poemRepo.findById(dto.getPoemId())
                .orElseThrow(() -> new IllegalArgumentException("Poema não encontrado com id: " + dto.getPoemId()));
        c.setPoem(poem);

        // Obtém o usuário autenticado a partir do contexto de segurança.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loggedUser = auth.getName();
        // Verifica se o usuário logado é o autor do comentário ou se possui a role de administrador.
        if (!loggedUser.equals(dto.getAuthor()) && !auth.getAuthorities().toString().contains("ROLE_ADMIN")) {
            throw new SecurityException("Usuário não autorizado a comentar neste poema.");
        }

        // Salva o novo comentário no banco de dados e o converte para DTO antes de retornar.
        return toDto(commentRepo.save(c));
    }

    /**
     * Atualiza um comentário existente.
     * Este método é executado em uma transação.
     *
     * @param id  O ID do comentário a ser atualizado.
     * @param dto Objeto CommentDto contendo os novos dados do comentário.
     * @return Um objeto CommentDto representando o comentário atualizado.
     * @throws IllegalArgumentException Se o comentário com o ID fornecido não for encontrado.
     * @throws SecurityException          Se o usuário logado não for o autor do comentário e não for um administrador.
     */
    @Transactional
    public CommentDto update(Long id, CommentDto dto) {
        // Busca o comentário a ser atualizado pelo ID.
        Comment comment = commentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comentário não encontrado com id: " + id));

        // Obtém o usuário autenticado.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loggedUser = auth.getName();
        // Verifica se o usuário logado é o autor do comentário ou um administrador.
        if (!loggedUser.equals(comment.getAuthor()) && !auth.getAuthorities().toString().contains("ROLE_ADMIN")) {
            throw new SecurityException("Usuário não autorizado a editar este comentário.");
        }

        // Atualiza os dados do comentário com os valores do DTO.
        comment.setAuthor(dto.getAuthor());
        comment.setContent(dto.getContent());
        comment.setCommentDate(dto.getCommentDate());

        // Salva as alterações no banco de dados e converte o comentário atualizado para DTO.
        return toDto(commentRepo.save(comment));
    }

    /**
     * Deleta um comentário pelo seu ID.
     * Este método é executado em uma transação.
     *
     * @param id O ID do comentário a ser deletado.
     * @throws IllegalArgumentException Se o comentário com o ID fornecido não for encontrado.
     * @throws SecurityException          Se o usuário logado não for o autor do comentário e não for um administrador.
     */
    @Transactional
    public void delete(Long id) {
        // Busca o comentário a ser deletado.
        Comment comment = commentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comentário não encontrado com id: " + id));

        // Obtém o usuário autenticado.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String loggedUser = auth.getName();
        // Verifica a autorização para deletar o comentário.
        if (!loggedUser.equals(comment.getAuthor()) && !auth.getAuthorities().toString().contains("ROLE_ADMIN")) {
            throw new SecurityException("Usuário não autorizado a excluir este comentário.");
        }

        // Deleta o comentário do banco de dados.
        commentRepo.deleteById(id);
    }

    /**
     * Converte uma entidade Comment para um objeto CommentDto.
     *
     * @param c A entidade Comment a ser convertida.
     * @return Um objeto CommentDto representando a entidade Comment.
     */
    private CommentDto toDto(Comment c) {
        CommentDto dto = new CommentDto();
        dto.setId(c.getId());
        dto.setAuthor(c.getAuthor());
        dto.setContent(c.getContent());
        dto.setCommentDate(c.getCommentDate());
        dto.setPoemId(c.getPoem().getId());
        return dto;
    }

    /**
     * Verifica se o usuário com o nome de usuário fornecido é o autor do comentário com o ID fornecido.
     * Este método NÃO é executado em uma transação, pois é usado em uma anotação de segurança `@PreAuthorize`.
     *
     * @param username  O nome de usuário a ser verificado.
     * @param commentId O ID do comentário a ser verificado.
     * @return true se o usuário for o autor do comentário, false caso contrário.
     * @throws IllegalArgumentException Se o comentário com o ID fornecido não for encontrado.
     */
    public boolean isAuthorOfComment(String username, Long commentId) {
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comentário não encontrado com id: " + commentId));
        return comment.getAuthor().equals(username);
    }
}
