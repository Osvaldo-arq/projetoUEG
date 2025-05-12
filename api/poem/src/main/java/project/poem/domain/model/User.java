package project.poem.domain.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

/**
 * Entidade JPA que representa um usuário no sistema.
 * Mapeia para a tabela "users" no banco de dados e implementa a interface UserDetails
 * do Spring Security para integração com o sistema de autenticação.
 */
@Entity
@Table(name = "users",  indexes = {@Index(name = "idx_users_email", columnList = "email")})
public class User implements UserDetails {

    /**
     * Identificador único do usuário.
     * Gerado automaticamente como uma identidade pelo banco de dados.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome de usuário para autenticação.
     */
    private String username;

    /**
     * Senha do usuário, que deve ser armazenada de forma criptografada.
     */
    private String password;

    /**
     * Endereço de email do usuário.
     */
    private String email;

    /**
     * Role (papel) do usuário no sistema.
     * Mapeado para uma coluna string na tabela usando a enumeração {@link Role}.
     */
    @Enumerated(EnumType.STRING)
    private Role role;  // Referencia a enumeração Role definida no projeto.

    // Getters e setters

    /**
     * Obtém o ID do usuário.
     * @return O ID do usuário.
     */
    public Long getId() {
        return id;
    }

    /**
     * Define o ID do usuário.
     * @param id O ID do usuário a ser definido.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Obtém o nome de usuário para autenticação.
     * Implementação do método da interface UserDetails.
     * @return O nome de usuário.
     */
    @Override
    public String getUsername() {
        return username;
    }

    /**
     * Define o nome de usuário.
     * @param username O nome de usuário a ser definido.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Obtém a senha do usuário.
     * Implementação do método da interface UserDetails.
     * @return A senha do usuário.
     */
    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Define a senha do usuário.
     * @param password A senha do usuário a ser definida.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Obtém o email do usuário.
     * @return O email do usuário.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Define o email do usuário.
     * @param email O email do usuário a ser definido.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Obtém a role do usuário.
     * @return A role do usuário (um valor da enumeração {@link Role}).
     */
    public Role getRole() {      // singular
        return role;
    }

    /**
     * Define a role do usuário.
     * @param role A role do usuário a ser definida (um valor da enumeração {@link Role}).
     */
    public void setRole(Role role) {
        this.role = role;
    }

    // Métodos obrigatórios da interface UserDetails para integração com Spring Security.

    /**
     * Retorna as autoridades (roles) concedidas ao usuário.
     * No caso, retorna uma coleção contendo uma única autoridade baseada na role do usuário,
     * com o prefixo "ROLE_" exigido pelo Spring Security.
     * @return Uma coleção de objetos GrantedAuthority.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Cria uma SimpleGrantedAuthority com o nome da role do usuário, precedido por "ROLE_".
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    /**
     * Indica se a conta do usuário expirou.
     * Por padrão, retorna true (a conta não está expirada).
     * A lógica real de expiração pode ser implementada aqui.
     * @return true se a conta não expirou, false caso contrário.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true; // Lógica para verificar se a conta não expirou
    }

    /**
     * Indica se a conta do usuário está bloqueada.
     * Por padrão, retorna true (a conta não está bloqueada).
     * A lógica real de bloqueio de conta pode ser implementada aqui.
     * @return true se a conta não está bloqueada, false caso contrário.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true; // Lógica para verificar se a conta não está bloqueada
    }

    /**
     * Indica se as credenciais (senha) do usuário expiraram.
     * Por padrão, retorna true (as credenciais não expiraram).
     * A lógica real de expiração de credenciais pode ser implementada aqui.
     * @return true se as credenciais não expiraram, false caso contrário.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Lógica para verificar se as credenciais não expiraram
    }

    /**
     * Indica se o usuário está habilitado.
     * Por padrão, retorna true (o usuário está habilitado).
     * A lógica real para desabilitar usuários pode ser implementada aqui.
     * @return true se o usuário está habilitado, false caso contrário.
     */
    @Override
    public boolean isEnabled() {
        return true; // Lógica para verificar se a conta está habilitada
    }
}