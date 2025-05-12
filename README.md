# Poemas API(Status Atual)

Uma API REST para um sistema de poemas, com foco atual na autenticação de usuários.

## 🛠️ Tecnologias Utilizadas

* **☕ Java:** Linguagem de programação principal.
* **🌱 Spring Boot:** Framework Java para desenvolvimento rápido de aplicações web.
* **🛡️ Spring Security:** Framework para segurança e autenticação.
* **🔑 JWT (JSON Web Tokens):** Padrão para criação de tokens de acesso seguros.
* **💾 JPA (Java Persistence API) / Hibernate:** Para persistência e mapeamento objeto-relacional.
* **🐬 MySQL:** Banco de dados relacional utilizado para persistir dados.

## 📂 Estrutura de Pastas
```
poem-api/
├── src/
│ ├── main/
│ │ ├─ java/
│ │ │ └── project/
│ │ │ └── poem/
│ │ │ ├── api/
│ │ │ │ └── controller/
│ │ │ │ ├── AuthController.java
│ │ │ │ └── ProfileController.java
│ │ │ ├── application/
│ │ │ │ ├── dto/
│ │ │ │ │ ├── LoginDto.java
│ │ │ │ │ ├── UserDto.java
│ │ │ │ │ └── ProfileDto.java
│ │ │ │ └── service/
│ │ │ │ ├── UserDetailsServices.java
│ │ │ │ ├── UserService.java
│ │ │ │ └── ProfileService.java
│ │ │ ├── domain/
│ │ │ │ ├── model/
│ │ │ │ │ ├── User.java
│ │ │ │ │ ├── Role.java
│ │ │ │ │ └── Profile.java
│ │ │ │ └── repository/
│ │ │ │ ├── UserRepository.java
│ │ │ │ └── ProfileRepository.java
│ │ │ ├── infrastructure/
│ │ │ │ ├── config/
│ │ │ │ │ └── SecurityConfig.java
│ │ │ │ └── security/
│ │ │ │ ├── JwtTokenProvider.java
│ │ │ │ └── JwtAuthenticationFilter.java
│ │ │ └── PoemApplication.java
│ └── resources/
│ └── application.properties

```
## ✨ Funcionalidades Implementadas

* **✍️ Registro de Usuário:** Permite que novos usuários se registrem no sistema.  
* **🚪 Login de Usuário:** Permite que usuários registrados façam login e obtenham um token JWT.  
* **🔒 Autenticação JWT:** Protege endpoints da API, exigindo um token JWT válido para acesso.  
* **🚦 Controle de Acesso Baseado em Roles:** Proteção de endpoints com base nas roles `USER` e `ADMIN`.  
* **👤 CRUD de Profile:** Endpoints para criar, ler, listar e deletar perfis de usuário, vinculados pelo e-mail.

## ⚙️ Endpoints da API

### 🔑 Autenticação (`/api/auth`)

* **POST `/register`:** Registra um novo usuário. Espera um objeto JSON no corpo da requisição com os campos: `username`, `password`, `confirmPassword`, `email`, `role`. Retorna um token JWT em caso de sucesso ou uma mensagem de erro. Os dados do usuário são persistidos no banco de dados MySQL.
* **POST `/login`:** Autentica um usuário existente. Espera um objeto JSON no corpo da requisição com os campos: `username`, `password`. Retorna um token JWT em caso de sucesso ou uma mensagem de erro, após verificar as credenciais no banco de dados MySQL.

### 📜 Poemas (`/api/poems`)

* **GET `/api/poems`:** (Exemplo de endpoint protegido) Acesso permitido a usuários com role `USER` ou `ADMIN` (a lógica real para listar poemas ainda não foi implementada, mas a autenticação e autorização estão funcionando com base nos dados do MySQL).

### 👤 Perfis (`/api/profile`)

* **GET `/api/profile`**  
  - Lista todos os profiles.  
  - Requer token JWT com role `USER` ou `ADMIN`.

* **GET `/api/profile/{email}`**  
  - Busca um profile pelo e-mail.  
  - Requer token JWT com role `USER` ou `ADMIN`.

* **POST `/api/profile`**  
  - Cria ou atualiza um profile.  
  - Body JSON.
  - Requer token JWT com role `USER` ou `ADMIN`.

## 🛡️ Segurança

A API utiliza autenticação baseada em JWT para proteger os endpoints.

* Ao fazer login com sucesso, o usuário recebe um token JWT.
* Para acessar endpoints protegidos, o token JWT deve ser incluído no cabeçalho da requisição com o prefixo `Bearer `. Exemplo: `Authorization: Bearer <seu_token_jwt>`.
* O filtro `JwtAuthenticationFilter` intercepta as requisições, valida o token e autentica o usuário se o token for válido, buscando os detalhes do usuário no banco de dados MySQL.
* As roles dos usuários (`USER`, `ADMIN`) armazenadas no MySQL são utilizadas para demonstrar o controle de acesso.

## ⚙️ Configuração

As configurações da aplicação podem ser encontradas no arquivo `src/main/resources/application.properties` ou `application.yml`. As configurações incluem:

* **🗝️ `jwt.secret`:** Chave secreta para assinar os tokens JWT (é importante manter essa chave segura).
* **⏳ `jwt.expiration`:** Tempo de validade dos tokens JWT em milissegundos.
* **💾 Configurações do Banco de Dados MySQL:**
    * `spring.datasource.url`: URL de conexão com o banco de dados MySQL.
    * `spring.datasource.username`: Nome de usuário para acessar o MySQL.
    * `spring.datasource.password`: Senha para acessar o MySQL.
    * `spring.datasource.driver-class-name`: Driver JDBC do MySQL.
    * `spring.jpa.hibernate.ddl-auto`: (Configuração para gerenciamento do schema - `update` para atualizar o schema existente, `create-drop` para criar e dropar o schema a cada execução, etc.).
* **🌐 Porta do Servidor:** (Padrão: 8080).

**⚠️ Certifique-se de configurar corretamente as credenciais e a URL do seu banco de dados MySQL no arquivo de configuração.**

## 🚀 Como Executar a Aplicação

1.  **Prerequisites:**
    * ✅ Java Development Kit (JDK) instalado.
    * ✅ Maven instalado.
    * ✅ Um servidor MySQL em execução e configurado com o schema necessário (as entidades `User` e `Profile` serão gerenciadas pelo Hibernate, dependendo da configuração `spring.jpa.hibernate.ddl-auto`).

2.  **Clonar o Repositório:**
    ```bash
    git clone []()
    cd [nome do seu repositório]
    ```

3.  **Configurar o Banco de Dados:**
    * 🐬 Crie um banco de dados MySQL (se ainda não existir).
    * ⚙️ Verifique as configurações de conexão no arquivo `application.properties` ou `application.yml` e ajuste-as conforme necessário.

4.  **Construir a Aplicação:**
    ```bash
    mvn clean install
    ```

5.  **Executar a Aplicação:**
    ```bash
    mvn spring-boot:run
    ```

    A API estará disponível em `http://localhost:8080` (ou na porta configurada), conectada ao seu banco de dados MySQL para persistência dos dados dos usuários.

## ⏭️ Próximos Passos

* Implementar a funcionalidade de gerenciamento de poemas (criar, ler, atualizar, deletar), persistindo os dados no MySQL.
* Adicionar tratamento de erros mais robusto.