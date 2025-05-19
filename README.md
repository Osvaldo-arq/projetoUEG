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
│   │   │       │   ├── config/                              # Configurações
│   │   │       │       ├── SecurityConfig.java  
│   │   │       │       ├── CorsConfig.java         
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

## 📂 Estrutura de Pastas (Frontend)

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── index.html                # HTML base
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.jsx                   # Componente principal e rotas
│   ├── App.test.js               # Testes do App
│   ├── index.js                  # Ponto de entrada React
│   ├── index.css                 # Estilos globais
│   ├── logo.svg
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── application/              # Serviços de aplicação (use cases)
│   │   ├── AuthService.js        # Lógica de autenticação (login/cadastro)
│   │   ├── CommentService.js     # Consome endpoints de comentários
│   │   ├── LikeService.js        # Consome endpoints de curtidas
│   │   ├── PoemService.js        # Consome endpoints de poemas
│   │   ├── ProfileService.js     # Consome endpoints de perfis
│   │   └── UserService.js        # Consome endpoints de usuários
│   ├── context/
│   │   └── AuthContext.jsx       # Contexto global de autenticação
│   ├── domain/
│   │   └── User.js               # Modelo de usuário
│   ├── infrastructure/
│   │   ├── HttpClient.js         # Wrapper para fetch autenticado
│   │   └── jwt.js                # Utilitários para JWT
│   ├── presentation/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx         # Formulário de login
│   │   │   ├── RegisterForm.jsx      # Formulário de cadastro
│   │   │   ├── Sidebar.jsx           # Barra lateral de navegação
│   │   │   ├── PoemList.jsx          # Lista de poemas (tabela)
│   │   │   ├── PoemForm.jsx          # Formulário de poema
│   │   │   ├── ProfileList.jsx       # Lista de perfis (tabela)
│   │   │   ├── ProfileForm.jsx       # Formulário de perfil
│   │   │   ├── UserList.jsx          # Lista de usuários (tabela)
│   │   │   ├── UserForm.jsx          # Formulário de usuário
│   │   │   ├── PoemsByDate.jsx       # Lista de poemas por data (com paginação)
│   │   │   ├── PoemDetail.jsx        # Detalhes de um poema
│   │   │   └── LikedPoemsPage.jsx    # Lista de poemas curtidos pelo usuário
│   │   ├── layouts/
│   │   │   └── ...                   # (Reservado para layouts reutilizáveis)
│   │   ├── pages/
│   │   │   ├── DashboardUser.jsx     # Dashboard do usuário comum
│   │   │   ├── DashboardAdmin.jsx    # Dashboard do administrador
│   │   │   └── HomePage.jsx          # Página inicial
│   └── styles/
│       ├── global.css
│       ├── DashboardAdmin.module.css
│       ├── DashboardUser.module.css
│       ├── PoemForm.module.css
│       ├── PoemList.module.css
│       ├── ProfileList.module.css
│       ├── Sidebar.module.css
│       ├── UserForm.module.css
│       ├── UserList.module.css
│       └── PoemsByDate.module.css
├── package.json
└── .gitignore
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
* **🧩 Componentes de Interface:**  
  * 📜 `PoemForm.jsx` / `PoemList.jsx` — CRUD de poemas (admin e usuário)  
  * 👤 `ProfileForm.jsx` / `ProfileList.jsx` — CRUD de perfis  
  * 🧑‍💼 `UserForm.jsx` / `UserList.jsx` — CRUD de usuários (admin)  
  * 📅 `PoemsByDate.jsx` — Lista poemas ordenados por data com paginação  
  * 📖 `PoemDetail.jsx` — Exibe detalhes completos de um poema  
  * ❤️ `LikedPoemsPage.jsx` — Lista poemas curtidos pelo usuário autenticado  
  * 📚 `Sidebar.jsx` — Navegação lateral para dashboards  
  * 📊 `DashboardUser.jsx` / `DashboardAdmin.jsx` — Painéis completos para cada tipo de usuário (USER e ADMIN)
* **🔐 Autenticação e Estado:**  
  * 🔒 `AuthContext.jsx` — Gerencia autenticação global e estado do usuário
* **🌐 Comunicação com a API:**  
  * 🧠 `application/` — Serviços de aplicação para consumir a API REST (PoemService, ProfileService etc.)  
  * 🔌 `infrastructure/HttpClient.js` — Wrapper para requisições HTTP com fetch + token
* **🎨 Estilo:**  
  * 🎨 `styles/` — CSS modular individualizado para cada componente ou página (ex: `PoemDetail.module.css`, `DashboardAdmin.module.css`)

## ⚙️ Rotas do Frontend

| Rota              | Componente                    | Descrição                                                  |
|-------------------|-------------------------------|-------------------------------------------------------------|
| `/login`          | `LoginForm.jsx`               | Tela de login                                               |
| `/register`       | `RegisterForm.jsx`            | Tela de cadastro                                            |
| `/user/dashboard` | `DashboardUser.jsx`           | Painel do usuário comum                                     |
| `/admin/dashboard`| `DashboardAdmin.jsx`          | Painel administrativo                                       |
| `/poems/:id`      | `PoemDetail.jsx`              | Exibe detalhes completos de um poema                        |
| `/poems-by-date`  | `PoemsByDate.jsx`             | Lista poemas por data, com paginação                       |
| `/liked-poems`    | `LikedPoemsPage.jsx`          | Lista poemas curtidos pelo usuário autenticado             |
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

* Melhorar estilos e usabilidade.  