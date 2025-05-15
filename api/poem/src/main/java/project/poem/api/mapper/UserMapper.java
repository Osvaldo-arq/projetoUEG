package project.poem.api.mapper;

import org.springframework.stereotype.Component;

import project.poem.application.dto.UserDto;
import project.poem.domain.model.User;

@Component // Indica que esta classe é um componente Spring, tornando-a disponível para injeção de dependência.
public class UserMapper {

    /**
     * Converte uma entidade User para um DTO UserDto.
     * @param user A entidade User a ser convertida.
     * @return Um DTO UserDto representando o usuário.
     */
    public UserDto toDto(User user) {
        UserDto dto = new UserDto(); // Cria uma nova instância de UserDto.
        dto.setId(user.getId());             // Copia o ID do usuário.
        dto.setUsername(user.getUsername()); // Copia o nome de usuário.
        dto.setEmail(user.getEmail());           // Copia o email do usuário.
        dto.setRole(user.getRole().name()); // Converte o enum Role para String e copia.
        return dto;                         // Retorna o DTO preenchido.
    }

    /**
     * Converte um DTO UserDto para uma entidade User.
     * @param dto O DTO UserDto a ser convertido.
     * @return Uma entidade User representando o usuário.
     */
    public User toModel(UserDto dto) {
        User user = new User(); // Cria uma nova instância de User.
        user.setId(dto.getId());       // Copia o ID do DTO.
        user.setUsername(dto.getUsername()); // Copia o nome de usuário do DTO.
        user.setEmail(dto.getEmail());         // Copia o email do DTO.
        // Converte a String de volta para o enum Role.  Se a string não corresponder a um valor válido de Role, uma exceção IllegalArgumentException será lançada.
        user.setRole(Enum.valueOf(project.poem.domain.model.Role.class, dto.getRole()));
        return user; // Retorna a entidade User preenchida.
    }
}
