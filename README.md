# Poemas API (Status Atual)

Uma API REST para um sistema de poemas, com autenticação de usuários, gerenciamento de perfis, poemas e comentários.

## 🛠️ Tecnologias Utilizadas

* **☕ Java:** Linguagem de programação principal.  
* **🌱 Spring Boot:** Framework para desenvolvimento rápido de microserviços.  
* **🛡️ Spring Security:** Segurança e autorização baseada em roles.  
* **🔑 JWT (JSON Web Tokens):** Autenticação stateless com tokens.  
* **💾 JPA / Hibernate:** Mapeamento objeto-relacional e persistência.  
* **🐬 MySQL:** Banco de dados relacional.

## 📂 Estrutura de Pastas
```
poem-api/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── project/poem/
│   │   │       ├── api/controller/                          # Controladores REST da API
│   │   │       │   ├── AuthController.java                 
│   │   │       │   ├── ProfileController.java
│   │   │       │   ├── PoemController.java
│   │   │       │   └── CommentController.java
│   │   │       ├── application/
│   │   │       │   ├── dto/                                 # Data Transfer Objects
│   │   │       │   │   ├── LoginDto.java
│   │   │       │   │   ├── UserDto.java
│   │   │       │   │   ├── ProfileDto.java
│   │   │       │   │   ├── PoemDto.java
│   │   │       │   │   └── CommentDto.java
│   │   │       │   └── service/                             # Lógica de negócios da aplicação
│   │   │       │       ├── UserService.java
│   │   │       │       ├── ProfileService.java
│   │   │       │       ├── PoemService.java
│   │   │       │       └── CommentService.java
│   │   │       ├── domain/
│   │   │       │   ├── model/                               # Modelos de domínio (entidades)
│   │   │       │   │   ├── User.java
│   │   │       │   │   ├── Profile.java
│   │   │       │   │   ├── Poem.java
│   │   │       │   │   └── Comment.java
│   │   │       │   └── repository/                          # Repositórios JPA para acesso aos dados
│   │   │       │       ├── UserRepository.java
│   │   │       │       ├── ProfileRepository.java
│   │   │       │       ├── PoemRepository.java
│   │   │       │       └── CommentRepository.java
│   │   │       ├── infrastructure/
│   │   │       │   ├── config/SecurityConfig.java           # Classes de configuração da aplicação
│   │   │       │   └── security/                            # Classes relacionadas à segurança
│   │   │       │       ├── JwtTokenProvider.java
│   │   │       │       └── JwtAuthenticationFilter.java
│   │   │       └── PoemApplication.java                     # Classe principal do Spring Boot
│   │   └── resources/
│   │       └── application.properties                       # Arquivo de configuração da aplicação
```

## ✨ Funcionalidades Implementadas

* **✍️ Registro de Usuário:** Permite que novos usuários se registrem no sistema.  
* **🚪 Login de Usuário:** Permite que usuários registrados façam login e obtenham um token JWT.  
* **🔒 Autenticação JWT:** Protege endpoints da API, exigindo um token JWT válido para acesso.  
* **🚦 Controle de Acesso Baseado em Roles:** Proteção de endpoints com base nas roles `USER` e `ADMIN`.  
* **👤 CRUD de Profile:** Operações de criar, ler e deletar perfis vinculados por e-mail.  
* **📜 CRUD de Poemas:** Operações de criar, listar, buscar, atualizar e deletar poemas.  
* **💬 CRUD de Comentários:** Operações de criar, listar, atualizar e deletar comentários de poemas, com controle de autorização (autor/ADMIN).  
* **📆 Datas no formato `dd/MM/yyyy`:** Para campos `postDate` e `commentDate`.

## ⚙️ Endpoints da API

### 🔑 Autenticação (`/api/auth`)
* **POST `/register`:** Registra um novo usuário (username, password, confirmPassword, email, role).  
* **POST `/login`:** Autentica usuário (username, password) e retorna token JWT.

### 📜 Poemas (`/api/poems`)
* **GET `/api/poems`:** Lista todos os poemas.  
* **GET `/api/poems/{id}`:** Retorna poema por ID.  
* **POST `/api/poems`:** Cria ou atualiza um poema (title, text, author, imageUrl, postDate).  
* **DELETE `/api/poems/{id}`:** Deleta um poema por ID.

### 👤 Perfis (`/api/profile`)
* **GET `/api/profile`:** Lista todos os perfis.  
* **GET `/api/profile/{email}`:** Busca perfil por e-mail.  
* **POST `/api/profile`:** Cria ou atualiza um perfil (firstName, lastName, phone, userEmail).

### 💬 Comentários (`/api/comments`)
* **GET `/api/comments/poem/{poemId}`:** Lista comentários de um poema.  
* **POST `/api/comments`:** Cria comentário (author, content, commentDate, poemId).  
* **PUT `/api/comments/{id}`:** Atualiza um comentário (somente autor ou ADMIN).  
* **DELETE `/api/comments/{id}`:** Deleta um comentário (somente autor ou ADMIN).

> **Todos** os endpoints (exceto `/api/auth/**`) exigem autenticação JWT e roles `USER` ou `ADMIN`.

## 🛡️ Segurança

- JWT no header:  
  `Authorization: Bearer <token>`  
- Validação pelo filtro `JwtAuthenticationFilter`.  
- Controle de acesso via `@PreAuthorize` em cada controller.

## ⚙️ Configuração

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/poemdb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=""
spring.datasource.password=""
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

jwt.secret=""
jwt.expiration=""
```

## 🚀 Como Executar

1. Clone o repositório e acesse a pasta:  
   ```bash
   git clone <URL>
   cd poem-api
   ```
2. Build e run:  
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
3. Teste com o script `test_api.sh`.

## ⏭️ Próximos Passos

- Ajustes na logica  