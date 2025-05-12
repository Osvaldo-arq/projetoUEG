package project.poem.application.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import project.poem.application.dto.ProfileDto;
import project.poem.domain.model.Profile;
import project.poem.domain.repository.ProfileRepository;
import project.poem.domain.repository.UserRepository;

/**
 * Serviço responsável pela lógica de negócios relacionada aos perfis de usuários.
 */
@Service
public class ProfileService {
    private final ProfileRepository profileRepo;
    private final UserRepository userRepo;

    /**
     * Construtor para injetar as dependências de ProfileRepository e UserRepository.
     *
     * @param profileRepo O repositório para acessar os dados dos perfis.
     * @param userRepo    O repositório para acessar os dados dos usuários.
     */
    public ProfileService(ProfileRepository profileRepo, UserRepository userRepo) {
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
    }

    /**
     * Lista todos os perfis de usuário no sistema.
     * Este método é executado em uma transação somente leitura.
     *
     * @return Uma lista de objetos ProfileDto representando todos os perfis.
     */
    @Transactional(readOnly = true)
    public List<ProfileDto> listAll() {
        return profileRepo.findAll().stream().map(this::toDto).toList();
    }

    /**
     * Busca um perfil de usuário pelo email associado ao usuário.
     * Este método é executado em uma transação somente leitura.
     *
     * @param email O email do usuário para buscar o perfil.
     * @return Um objeto ProfileDto representando o perfil encontrado.
     * @throws IllegalArgumentException Se nenhum perfil for encontrado para o email fornecido.
     */
    @Transactional(readOnly = true)
    public ProfileDto getByEmail(String email) {
        Profile p = profileRepo.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for email " + email));
        return toDto(p);
    }

    /**
     * Cria um novo perfil de usuário ou atualiza um perfil existente para o usuário com o email fornecido.
     * Este método é executado em uma transação.
     *
     * @param dto Objeto ProfileDto contendo os dados do perfil a serem criados ou atualizados.
     * @return Um objeto ProfileDto representando o perfil criado ou atualizado.
     * @throws IllegalArgumentException Se nenhum usuário for encontrado para o email fornecido no DTO.
     */
    @Transactional
    public ProfileDto createOrUpdate(ProfileDto dto) {
        // Busca o usuário pelo email fornecido no DTO.
        var userOpt = userRepo.findByEmail(dto.getUserEmail());
        // Se o usuário não for encontrado, lança uma exceção.
        if (userOpt.isEmpty()) throw new IllegalArgumentException("User not found: " + dto.getUserEmail());

        // Busca um perfil existente para o email do usuário. Se não existir, cria um novo.
        Profile profile = profileRepo.findByUserEmail(dto.getUserEmail()).orElse(new Profile());
        // Atualiza os dados do perfil com os valores do DTO.
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setPhone(dto.getPhone());
        // Associa o perfil ao usuário encontrado.
        profile.setUser(userOpt.get());
        // Salva (cria ou atualiza) o perfil no banco de dados e o converte para DTO antes de retornar.
        return toDto(profileRepo.save(profile));
    }

    /**
     * Deleta um perfil de usuário pelo email associado ao usuário.
     * Este método é executado em uma transação.
     *
     * @param email O email do usuário para deletar o perfil associado.
     * @throws IllegalArgumentException Se nenhum perfil for encontrado para o email fornecido.
     */
    @Transactional
    public void deleteByEmail(String email) {
        // Verifica se existe um perfil para o email fornecido.
        if (profileRepo.findByUserEmail(email).isEmpty())
            throw new IllegalArgumentException("Profile not found: " + email);
        // Deleta o perfil pelo email do usuário.
        profileRepo.deleteByUserEmail(email);
    }

    /**
     * Converte uma entidade Profile para um objeto ProfileDto.
     *
     * @param p A entidade Profile a ser convertida.
     * @return Um objeto ProfileDto representando a entidade.
     */
    private ProfileDto toDto(Profile p) {
        ProfileDto dto = new ProfileDto();
        dto.setFirstName(p.getFirstName());
        dto.setLastName(p.getLastName());
        dto.setPhone(p.getPhone());
        dto.setUserEmail(p.getUserEmail());
        return dto;
    }
}