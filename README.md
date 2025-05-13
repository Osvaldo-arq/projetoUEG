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
  
* Paginação e filtros.  
* Testes de integração.  

# Poem Frontend (Status Atual)

Este repositório contém o frontend em React para o sistema de poemas. Implementa telas de login, cadastro e dashboards para as roles `USER` e `ADMIN`.

## 🛠️ Tecnologias Utilizadas

* **🌐 React:** Biblioteca principal para UI.  
* **⚙️ React Router DOM:** Roteamento de páginas.  
* **🔗 Fetch API:** Comunicação com o backend via HTTP.  
* **💅 CSS:** Estilos globais simples.  

## 📂 Estrutura de Pastas
```
poem-frontend/
├── public/
│   └── index.html                   # HTML base
├── src/
│   ├── domain/                      # Entidades de domínio
│   │   └── User.js                  # Modelo de usuário
│   ├── application/                 # Serviços de aplicação (use cases)
│   │   └── AuthService.js           # Lógica de login/cadastro
│   ├── infrastructure/              # Adaptadores de infra (HTTP client)
│   │   └── HttpClient.js            # Fetch wrappers
│   ├── presentation/                # Partes visuais e rotas
│   │   ├── components/              # Componentes reutilizáveis
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── pages/                   # Páginas principais
│   │   │   ├── DashboardUser.jsx
│   │   │   └── DashboardAdmin.jsx
│   │   ├── App.jsx                  # Configuração de rotas
│   │   └── index.js                 # Ponto de entrada React
│   └── styles/
│       └── global.css               # Estilos globais
└── .gitignore                       # Arquivos ignorados pelo Git
```

## ✨ Funcionalidades Implementadas

* **🔐 Autenticação:**  
  * Tela de cadastro (role `USER` por padrão).  
  * Tela de login e armazenamento de JWT e `role` no `localStorage`.  
* **🚪 Roteamento Protegido:**  
  * Usuário não autenticado redirecionado para login.  
  * Após login, direcionamento para dashboard conforme `role`.  
* **👤 Dashboards:**  
  * **Dashboard User:** Interface básica para usuários comuns.  
  * **Dashboard Admin:** Interface dedicada para administradores.  

## ⚙️ Rotas do Frontend

| Rota            | Componente         | Descrição                                    |
|-----------------|--------------------|----------------------------------------------|
| `/login`        | `LoginForm.jsx`    | Tela de login                                |
| `/register`     | `RegisterForm.jsx` | Tela de cadastro                             |
| `/dashboard`    | `DashboardUser` ou `DashboardAdmin` | Exibe dashboard de acordo com o `role` |

## 📦 Scripts Disponíveis

No diretório do projeto, execute:

* `npm install` — Instala dependências.  
* `npm start` — Executa em modo desenvolvimento (http://localhost:3000).  
* `npm run build` — Cria build otimizado para produção.

## ⚙️ Configuração

Para apontar ao backend, use:

* Variável de ambiente em `.env`:
  ```env
  REACT_APP_API_URL=http://localhost:8080
  ```

## 🚀 Como Executar

1. Clone o repositório:
   ```bash
   git clone <URL>
   cd poem-frontend
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Inicie em modo de desenvolvimento:
   ```bash
   npm start
   ```
4. Acesse `http://localhost:3000`.

## ⏭️ Próximos Passos

* Adicionar formulários de poema e comentário.  
* Consumir endpoints de CRUD de poemas, perfis, comentários e curtidas.  
* Melhorar estilos e usabilidade.  
* Implementar testes automatizados.  