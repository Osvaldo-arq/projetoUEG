package project.poem.application.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.poem.domain.model.Poem;
import project.poem.domain.model.PoemLike;
import project.poem.domain.model.User;
import project.poem.domain.repository.PoemLikeRepository;
import project.poem.domain.repository.PoemRepository;
import project.poem.domain.repository.UserRepository;

/**
 * Serviço responsável pela lógica de negócios relacionada às curtidas de poemas.
 */
@Service
public class LikeService {

    private final PoemLikeRepository likeRepo;
    private final PoemRepository poemRepo;
    private final UserRepository userRepo;

    /**
     * Construtor para injetar as dependências necessárias.
     *
     * @param likeRepo Repositório para acessar os dados de curtidas de poemas.
     * @param poemRepo Repositório para acessar os dados dos poemas.
     * @param userRepo Repositório para acessar os dados dos usuários.
     */
    public LikeService(PoemLikeRepository likeRepo,
                       PoemRepository poemRepo,
                       UserRepository userRepo) {
        this.likeRepo = likeRepo;
        this.poemRepo = poemRepo;
        this.userRepo = userRepo;
    }

    /**
     * Curte um poema.
     * Este método é executado em uma transação.
     * Se o usuário já curtiu o poema, a operação é ignorada silenciosamente.
     *
     * @param poemId O ID do poema a ser curtido.
     * @throws IllegalArgumentException Se o usuário ou o poema não forem encontrados.
     */
    @Transactional
    public void likePoem(Long poemId) {
        // Obtém o usuário autenticado a partir do contexto de segurança.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        // Busca o usuário pelo nome de usuário.
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + username));

        // Busca o poema pelo ID.
        Poem poem = poemRepo.findById(poemId)
                .orElseThrow(() -> new IllegalArgumentException("Poema não encontrado: " + poemId));

        // Verifica se o usuário já curtiu o poema. Se já curtiu, não faz nada.
        if (likeRepo.findByPoemIdAndUserId(poemId, user.getId()).isPresent()) {
            return; // Sai do método sem fazer nada
        }

        // Cria uma nova entidade PoemLike para representar a curtida.
        PoemLike like = new PoemLike();
        like.setPoem(poem);
        like.setUser(user);
        // Define o nome de usuário do liker
        like.setLikerUsername(user.getUsername());
        // Salva a curtida no banco de dados.
        likeRepo.save(like);
    }

    /**
     * Remove a curtida de um poema feita pelo usuário autenticado.
     * Este método é executado em uma transação.
     *
     * @param poemId O ID do poema do qual a curtida será removida.
     * @throws IllegalArgumentException Se o usuário não for encontrado.
     * @throws IllegalStateException    Se o usuário não tiver curtido o poema.
     */
    @Transactional
    public void unlikePoem(Long poemId) {
        // Obtém o usuário autenticado.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        // Busca o usuário pelo nome de usuário
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + username));

        // Busca a curtida do usuário para o poema especificado.
        PoemLike pl = likeRepo.findByPoemIdAndUserId(poemId, user.getId())
                .orElseThrow(() -> new IllegalStateException("Curtida não existe"));

        // Deleta a curtida do banco de dados.
        likeRepo.delete(pl);
    }

    /**
     * Conta o número de curtidas de um poema.
     * Este método é executado em uma transação somente leitura.
     *
     * @param poemId O ID do poema para o qual as curtidas devem ser contadas.
     * @return O número de curtidas do poema.
     * @throws IllegalArgumentException Se o poema não for encontrado.
     */
    @Transactional(readOnly = true)
    public long countLikes(Long poemId) {
        // Garante que o poema existe.
        if (!poemRepo.existsById(poemId)) {
            throw new IllegalArgumentException("Poema não encontrado: " + poemId);
        }
        // Usa o repositório para contar as curtidas do poema.
        return likeRepo.countByPoemId(poemId);
    }

    /**
     * Verifica se um usuário específico curtiu um poema específico.
     * Este método é executado em uma transação somente leitura.
     *
     * @param poemId O ID do poema a ser verificado.
     * @param userId O ID do usuário a ser verificado.
     * @return true se o usuário curtiu o poema, false caso contrário.
     */
    @Transactional(readOnly = true)
    public boolean hasLiked(Long poemId, Long userId) {
        return likeRepo.findByPoemIdAndUserId(poemId, userId).isPresent();
    }
}