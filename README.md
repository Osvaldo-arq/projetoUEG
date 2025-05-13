# Poemas API (Status Atual)

Uma API REST para um sistema de poemas, com autenticação de usuários, gerenciamento de perfis, poemas, comentários e curtidas.

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
│   │   │       │   ├── CommentController.java
│   │   │       │   └── LikeController.java
│   │   │       ├── application/
│   │   │       │   ├── dto/                                 # Data Transfer Objects
│   │   │       │   │   ├── LoginDto.java
│   │   │       │   │   ├── UserDto.java
│   │   │       │   │   ├── ProfileDto.java
│   │   │       │   │   ├── PoemDto.java
│   │   │       │   │   ├── CommentDto.java
│   │   │       │   │   └── LikeDto.java
│   │   │       │   └── service/                             # Lógica de negócios
│   │   │       │       ├── UserService.java
│   │   │       │       ├── ProfileService.java
│   │   │       │       ├── PoemService.java
│   │   │       │       ├── CommentService.java
│   │   │       │       └── LikeService.java
│   │   │       ├── domain/
│   │   │       │   ├── model/                               # Entidades
│   │   │       │   │   ├── User.java
│   │   │       │   │   ├── Profile.java
│   │   │       │   │   ├── Poem.java
│   │   │       │   │   ├── Comment.java
│   │   │       │   │   └── PoemLike.java
│   │   │       │   └── repository/                          # Repositórios JPA
│   │   │       │       ├── UserRepository.java
│   │   │       │       ├── ProfileRepository.java
│   │   │       │       ├── PoemRepository.java
│   │   │       │       ├── CommentRepository.java
│   │   │       │       └── PoemLikeRepository.java
│   │   │       ├── infrastructure/
│   │   │       │   ├── config/SecurityConfig.java           # Configurações
│   │   │       │   └── security/                            # JWT & filtros
│   │   │       │       ├── JwtTokenProvider.java
│   │   │       │       └── JwtAuthenticationFilter.java
│   │   │       └── PoemApplication.java                     # Classe principal
│   │   └── resources/
│   │       └── application.properties                       # Configuração
```

## ✨ Funcionalidades Implementadas

* **✍️ Registro de Usuário**  
* **🚪 Login de Usuário**  
* **🔒 Autenticação JWT**  
* **🚦 Controle de Acesso por Roles (`USER`, `ADMIN`)**  
* **👤 CRUD de Profile**  
* **📜 CRUD de Poemas**  
* **💬 CRUD de Comentários**  
* **❤️ CRUD de Curtidas em Poemas**  
* **📆 Datas no formato `dd/MM/yyyy`**  

## ⚙️ Endpoints da API

### 🔑 Autenticação (`/api/auth`)
* **POST `/register`** – Registra novo usuário.  
* **POST `/login`** – Autentica usuário e retorna JWT.

### 📜 Poemas (`/api/poems`)
* **GET** `/api/poems` – Lista todos.  
* **GET** `/api/poems/{id}` – Detalha por ID.  
* **POST** `/api/poems` – Cria ou atualiza.  
* **DELETE** `/api/poems/{id}` – Exclui.  

### ❤️ Curtidas (`/api/poems/{id}`)
* **POST** `/api/poems/{id}/like` – Registra curtida.  
* **DELETE** `/api/poems/{id}/like` – Remove curtida.  
* **GET** `/api/poems/{id}/likes` – Conta curtidas.

### 👤 Perfis (`/api/profile`)
* **GET** `/api/profile` – Lista todos.  
* **GET** `/api/profile/{email}` – Busca por e-mail.  
* **POST** `/api/profile` – Cria ou atualiza.

### 💬 Comentários (`/api/comments`)
* **GET** `/api/comments/poem/{poemId}` – Lista por poema.  
* **POST** `/api/comments` – Cria.  
* **PUT** `/api/comments/{id}` – Atualiza.  
* **DELETE** `/api/comments/{id}` – Exclui.

> 🔒 **JWT** obrigatório em todos (exceto `/api/auth/**`).

## 🛡️ Segurança

* Header `Authorization: Bearer <token>`.  
* `@PreAuthorize` em controllers.

## ⚙️ Configuração

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/poemdb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=<usuário>
spring.datasource.password=<senha>
spring.jpa.hibernate.ddl-auto=update

jwt.secret=<chave>
jwt.expiration=86400000
```

## 🚀 Como Executar

```bash
git clone <URL>
cd poem-api
mvn clean install
mvn spring-boot:run
```

Teste com `test_api.sh`.

## ⏭️ Próximos Passos

* Upload de imagens.  
* Paginação e filtros.  
* Testes de integração.  