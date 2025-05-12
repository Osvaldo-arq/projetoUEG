package project.poem.domain.model;

/**
 * Enumeração que define os diferentes roles (papéis) que um usuário pode ter no sistema.
 * Atualmente, define dois roles: USER e ADMIN.
 */
public enum Role {
    /**
     * Role padrão para usuários comuns do sistema.
     * Geralmente possui permissões limitadas.
     */
    USER,

    /**
     * Role para administradores do sistema.
     * Geralmente possui permissões elevadas para gerenciar o sistema.
     */
    ADMIN
}