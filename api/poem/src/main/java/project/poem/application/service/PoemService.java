package project.poem.application.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.poem.application.dto.PoemDto;
import project.poem.domain.model.Poem;
import project.poem.domain.repository.PoemLikeRepository;
import project.poem.domain.repository.PoemRepository;

/**
 * Serviço responsável pela lógica de negócios relacionada aos poemas.
 */
@Service
public class PoemService {

    private final PoemRepository poemRepo;
    private final PoemLikeRepository poemLikeRepository;

    /**
     * Construtor para injetar a dependência de PoemRepository.
     *
     * @param poemRepo O repositório para acessar os dados dos poemas.
     */
    public PoemService(PoemRepository poemRepo, PoemLikeRepository poemLikeRepository) {
        this.poemRepo = poemRepo;
        this.poemLikeRepository = poemLikeRepository;
    }

    /**
     * Lista todos os poemas no sistema.
     * Este método é executado em uma transação somente leitura.
     *
     * @return Uma lista de objetos PoemDto representando todos os poemas.
     */
    @Transactional(readOnly = true)
    public List<PoemDto> listAll() {
        return poemRepo.findAll().stream().map(this::toDto).toList();
    }

    /**
     * Busca um poema pelo seu ID.
     * Este método é executado em uma transação somente leitura.
     *
     * @param id O ID do poema a ser buscado.
     * @return Um objeto PoemDto representando o poema encontrado.
     * @throws IllegalArgumentException Se nenhum poema for encontrado com o ID fornecido.
     */
    @Transactional(readOnly = true)
    public PoemDto getById(Long id) {
        Poem p = poemRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Poem not found: " + id));
        return toDto(p);
    }

    /**
     * Cria um novo poema ou atualiza um poema existente.
     * Se o DTO possuir um ID, tenta atualizar o poema existente; caso contrário, cria um novo.
     * Este método é executado em uma transação.
     *
     * @param dto Objeto PoemDto contendo os dados do poema a ser criado ou atualizado.
     * @return Um objeto PoemDto representando o poema criado ou atualizado.
     */
    @Transactional
    public PoemDto createOrUpdate(PoemDto dto) {
        Poem poem = dto.getId() != null
                    ? poemRepo.findById(dto.getId()).orElse(new Poem()) // Busca para atualizar ou cria novo se não achar
                    : new Poem(); // Cria um novo poema se o ID não estiver presente

        poem.setTitle(dto.getTitle());
        poem.setText(dto.getText());
        poem.setAuthor(dto.getAuthor());
        poem.setImageUrl(dto.getImageUrl());
        poem.setPostDate(dto.getPostDate());

        return toDto(poemRepo.save(poem));
    }

    /**
     * Deleta um poema pelo seu ID.
     * Este método é executado em uma transação.
     *
     * @param id O ID do poema a ser deletado.
     * @throws IllegalArgumentException Se nenhum poema for encontrado com o ID fornecido.
     */
    @Transactional
    public void deleteById(Long id) {
        if (!poemRepo.existsById(id)) {
            throw new IllegalArgumentException("Poem not found: " + id);
        }
        poemRepo.deleteById(id);
    }

    /**
     * Converte uma entidade Poem para um objeto PoemDto.
     *
     * @param p A entidade Poem a ser convertida.
     * @return Um objeto PoemDto representando a entidade.
     */
    private PoemDto toDto(Poem p) {
        PoemDto dto = new PoemDto();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setText(p.getText());
        dto.setAuthor(p.getAuthor());
        dto.setImageUrl(p.getImageUrl());
        dto.setPostDate(p.getPostDate());
        return dto;
    }
    /**
     * Lista todos os poemas curtidos por um usuário.
     *
     * @param userId ID do usuário autenticado
     * @return Lista de PoemDto representando os poemas curtidos
     */
    @Transactional(readOnly = true)
    public List<PoemDto> listLikedForUser(Long userId) {
        return poemLikeRepository.findAll().stream()
                .filter(pl -> pl.getUser().getId().equals(userId))
                .map(pl -> toDto(pl.getPoem()))
                .collect(Collectors.toList());
    }
}