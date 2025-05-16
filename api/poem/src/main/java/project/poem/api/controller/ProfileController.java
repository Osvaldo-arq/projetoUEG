package project.poem.api.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.poem.application.dto.ProfileDto;
import project.poem.application.service.ProfileService;

/**
 * Controlador REST para operações relacionadas a perfis de usuários.
 * Este controlador expõe endpoints sob o caminho base "/api/profile".
 */
@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    /**
     * Construtor para injetar a dependência de ProfileService.
     *
     * @param profileService O serviço responsável pela lógica de perfis.
     */
    private final ProfileService profileService;

    /**
     * Construtor para injetar a dependência de ProfileService.
     *
     * @param profileService O serviço responsável pela lógica de perfis.
     */
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * Endpoint para listar todos os perfis.
     * Retorna uma lista de objetos ProfileDto representando os perfis.
     *
     * @return ResponseEntity contendo a lista de perfis.
     */
    @GetMapping
    public ResponseEntity<List<ProfileDto>> listProfiles() {
        return ResponseEntity.ok(profileService.listAll());
    }

    /**
     * Endpoint para obter um perfil específico pelo email do usuário.
     * Retorna um objeto ProfileDto representando o perfil.
     *
     * @param email O email do usuário cujo perfil deve ser retornado.
     * @return ResponseEntity contendo o perfil correspondente ao email fornecido.
     */
    @GetMapping("/{email}")
    public ResponseEntity<ProfileDto> getProfileByEmail(@PathVariable String email) {
        ProfileDto profile = profileService.getByEmail(email);
        if (profile != null) {
            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para criar ou atualizar um perfil.
     * Recebe os dados do perfil no corpo da requisição e tenta criar ou atualizar o perfil correspondente.
     *
     * @param dto Objeto DTO contendo os dados do perfil a ser criado ou atualizado.
     * @return ResponseEntity contendo o perfil criado ou atualizado.
     */
    @PostMapping
    public ResponseEntity<ProfileDto> upsertProfile(@Valid @RequestBody ProfileDto dto) {
        return ResponseEntity.ok(profileService.createOrUpdate(dto));
    }

    /**
     * Endpoint para deletar um perfil pelo email do usuário.
     * Recebe o email do usuário e tenta deletar o perfil correspondente.
     *
     * @param email O email do usuário cujo perfil deve ser deletado.
     * @return ResponseEntity com status 204 (No Content) se a operação for bem-sucedida.
     */
    @DeleteMapping("/{email}")
    public ResponseEntity<Void> deleteProfile(@PathVariable String email) {
        profileService.deleteByEmail(email);
        return ResponseEntity.noContent().build();
    }
}
