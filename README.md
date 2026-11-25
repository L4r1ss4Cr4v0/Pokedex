# 🎮 Pokédex — React + Spring Boot + MongoDB

Atividade 04 da disciplina de **Desenvolvimento e Integração de Aplicações Web** (Engenharia de Software — PUC Minas): a Pokédex da Atividade 03 (React + Vite) passou a consumir uma API REST em Spring Boot que persiste os dados no MongoDB. Os detalhes da interface (pesquisa, filtros, modos claro/escuro/retrô, treinadores) estão em [`frontend/README.md`](frontend/README.md).

## 🚀 Full Stack: React + Spring Boot + MongoDB

A partir da Atividade 04, a Pokédex deixou de ler o `pokedex-data.json` e passou a consumir uma **API REST em Spring Boot** que persiste os dados no **MongoDB**:

```text
Script_Pokedex.sql → MongoDB → Spring Boot REST API → React + Vite
```

### 📁 Estrutura

```text
pokedex/
├── frontend/              # React + Vite (Atividade 03 integrada à API)
│   ├── src/
│   ├── package.json
│   └── README.md          # Detalhes da interface (Atividade 03)
├── backend/               # API Spring Boot (Controller / Service / Repository / Model)
│   ├── src/
│   │   ├── main/java/com/pokedex/{controller,service,repository,model,dto,config,exception}
│   │   └── main/resources/{application.properties,Script_Pokedex.sql}
│   ├── pom.xml
│   └── .env.example
├── Script_Pokedex.sql     # Fonte dos dados
└── README.md
```

### 🗄️ Configuração do MongoDB (Atlas)

1. Crie um cluster gratuito no [MongoDB Atlas](https://www.mongodb.com/atlas) e um usuário de banco de dados.
2. Em **Network Access**, libere o seu IP.
3. Copie a connection string (`mongodb+srv://...`) e inclua o nome do banco, por exemplo `/pokedex`.
4. Na pasta `backend`, copie `.env.example` para `.env` e preencha:

```text
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/pokedex?retryWrites=true&w=majority
ADMIN_USER=admin
ADMIN_PASSWORD=troque-esta-senha
JWT_SECRET=troque-por-um-segredo-aleatorio-com-mais-de-32-caracteres
```

`JWT_SECRET` assina os tokens de login (mínimo 32 caracteres; veja **Contas de usuário**). O `.env.example` traz um comando PowerShell para gerar um valor aleatório.

`ADMIN_USER` e `ADMIN_PASSWORD` são **opcionais** e criam uma conta de administrador na primeira execução (veja **Contas de usuário**). Sem elas, basta se cadastrar pela tela **Cadastrar**.

O arquivo `.env` está no `.gitignore`: **as credenciais não vão para o GitHub**. Também é possível definir `MONGODB_URI` como variável de ambiente. Sem ela, a API tenta `mongodb://localhost:27017/pokedex`.

### 🌱 Carga inicial dos dados

Na primeira execução, o backend lê o `Script_Pokedex.sql` (cópia em `backend/src/main/resources`; a original fica na raiz do repositório) e popula as coleções **somente se estiverem vazias**:

| Coleção    | Conteúdo                                                        |
| ---------- | --------------------------------------------------------------- |
| `pokemons` | 151 Pokémon, com `stats` e `types` embutidos no documento       |
| `types`    | 18 tipos                                                        |
| `trainers` | 12 treinadores, com `badges` e a lista `pokemonIds` da equipe   |

Exemplo de documento em `pokemons`:

```json
{
  "_id": 25,
  "name": "Pikachu",
  "stats": { "hp": 35, "attack": 55, "defense": 30, "specialAttack": 50, "specialDefense": 40, "speed": 90 },
  "types": [{ "id": 5, "name": "Electric" }]
}
```

### ▶️ Como executar

**Backend** (Java 17+ e Maven):

```bash
cd backend
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`. Testes: `mvn test`.

**Frontend** (Node.js):

```bash
cd frontend
npm install
npm run dev
```

O app abre em `http://localhost:5173`. Para usar outra URL de API, copie `frontend/.env.example` para `frontend/.env` e ajuste `VITE_API_URL`.

### 🌐 Endpoints

| Método   | Endpoint             | Descrição                                                       |
| -------- | -------------------- | --------------------------------------------------------------- |
| `GET`    | `/api/pokemons`      | Lista os Pokémon (filtros opcionais `?name=char&typeId=2`)      |
| `GET`    | `/api/pokemons/{id}` | Busca um Pokémon pelo ID                                        |
| `POST`   | `/api/pokemons`      | Cadastra um Pokémon (`id` opcional; se omitido, usa o próximo)  |
| `PUT`    | `/api/pokemons/{id}` | Atualiza um Pokémon                                             |
| `DELETE` | `/api/pokemons/{id}` | Remove um Pokémon (e o retira da equipe dos treinadores)        |
| `POST`   | `/api/auth/register` | Cria uma conta de usuário (público)                             |
| `POST`   | `/api/auth/login`    | Entra com usuário e senha e devolve um token JWT (público)      |
| `GET`    | `/api/auth/me`       | Dados do dono do token (exige token)                            |
| `GET`    | `/api/types`         | Lista os tipos                                                  |
| `GET`    | `/api/trainers`      | Lista os treinadores (`/api/trainers/{id}` busca um)            |

Corpo de exemplo para `POST`/`PUT` (no tipo basta informar o `id`):

```json
{
  "name": "Pikachu",
  "stats": { "hp": 35, "attack": 55, "defense": 30, "specialAttack": 50, "specialDefense": 40, "speed": 90 },
  "types": [{ "id": 5 }]
}
```

Erros retornam JSON `{ status, message, errors? }`: `400` (dados inválidos), `401` (sem token válido nas escritas ou login errado), `404` (não encontrado) e `409` (id, nome de Pokémon ou nome de usuário já existente).

### 🔐 Contas de usuário e autenticação (Spring Security + JWT)

- **Cadastro:** `POST /api/auth/register` é público e cria uma conta na coleção `users` do MongoDB (`name`, `username` de 3 a 30 caracteres com letras, números, `.`, `-` ou `_`, e `password` de 6 a 72 caracteres). O usuário é guardado em minúsculas, então `Ana` e `ana` são a mesma conta (`409` se já existir).
- **Senhas:** nunca são guardadas nem devolvidas em texto: o banco guarda só o hash **BCrypt**.
- **Login:** `POST /api/auth/login` (público) recebe `username` e `password` e devolve um **token JWT** (`accessToken`, `tokenType`, `expiresIn` em segundos e os dados do `user`). Usuário ou senha errados retornam `401`, sem revelar qual dos dois falhou.
- **Token:** assinado com HMAC-SHA256 e válido por 120 minutos (`JWT_EXPIRATION_MINUTES`). Leva o usuário (`sub`), o nome e a role. Nas requisições protegidas, envie `Authorization: Bearer <token>`.
- **Leitura pública:** todos os `GET` (`/api/pokemons`, `/api/types`, `/api/trainers`) funcionam sem login.
- **Escrita protegida:** `POST`, `PUT` e `DELETE` em `/api/pokemons` exigem um token válido; sem ele, ou com token inválido ou expirado, a API responde `401`.
- `GET /api/auth/me` devolve `username`, `name` e `role` do dono do token.
- **`JWT_SECRET`:** segredo de assinatura, com pelo menos 32 caracteres, definido no `backend/.env` (nunca no GitHub). Se faltar, a API gera um segredo temporário e os logins caem quando ela reiniciar.
- **Administrador (opcional):** se `ADMIN_PASSWORD` estiver definida, a API cria na primeira execução a conta `ADMIN_USER` (padrão `admin`) com a role `ADMIN`. Hoje contas `USER` e `ADMIN` têm a mesma permissão.
- A API é stateless (sem sessão e sem CSRF). No frontend, o token fica no `sessionStorage` da aba e é apagado ao clicar em **Sair**, ao fechar a aba, quando expira ou quando a API devolve `401`.

Exemplos com `curl` (Linux, macOS ou Git Bash):

```bash
# Criar conta
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Ana Souza","username":"ana","password":"segredo1"}'

# Entrar e obter o token
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" \
  -d '{"username":"ana","password":"segredo1"}'

# Excluir um Pokémon (exige o token)
curl -X DELETE http://localhost:8080/api/pokemons/152 -H "Authorization: Bearer <accessToken>"
```

### 🖼️ Fotos dos Pokémon (normal e modo retrô)

Cada Pokémon pode ter duas imagens enviadas pelo formulário de cadastro/edição:

| Imagem | Onde aparece |
| ------ | ------------ |
| **Normal** | Cards, detalhes e equipe dos treinadores |
| **Retrô** | Os mesmos lugares, quando o usuário liga **Volta no Tempo** |

- **Formatos e limite:** PNG, JPG, GIF ou WebP, de até 2 MB cada. A API confere o tipo pelo conteúdo do arquivo (não só pela extensão), então SVG e outros formatos são recusados.
- **Armazenamento:** os arquivos ficam na coleção `pokemon_images` do MongoDB; o Pokémon guarda só a versão da imagem (`imageVersion` e `retroImageVersion`), usada para o cache do navegador.
- **Sem imagem enviada:** os 151 Pokémon de Kanto continuam com o sprite oficial (normal e retrô); um Pokémon novo mostra a Pokébola e, no modo retrô, a imagem normal se houver.
- **Orientação para a imagem retrô:** o formulário pede uma imagem **pixelada, no estilo antigo da franquia** (Pokémon Red/Blue): sprite pequeno e quadrado (56×56 ou 96×96 px, no máximo 256×256 px), PNG com fundo transparente, sem suavização e com poucas cores. A prévia aparece sem suavização e o formulário avisa quando a imagem é grande demais, não é quadrada ou está em JPG.

Endpoints (`{variant}` é `normal` ou `retro`):

| Método   | Endpoint                              | Descrição                                            |
| -------- | ------------------------------------- | ---------------------------------------------------- |
| `GET`    | `/api/pokemons/{id}/image/{variant}`  | Devolve a imagem (público)                           |
| `PUT`    | `/api/pokemons/{id}/image/{variant}`  | Envia ou troca a imagem (exige token, `multipart/form-data`, campo `file`) |
| `DELETE` | `/api/pokemons/{id}/image/{variant}`  | Remove a imagem (exige token)                        |

Exemplo:

```bash
curl -X PUT http://localhost:8080/api/pokemons/152/image/retro \
  -H "Authorization: Bearer <accessToken>" -F "file=@sprite.png"
```

### ✏️ Cadastro, edição e exclusão na interface

Crie uma conta em **Cadastrar** (`/register`) ou entre em **Entrar** (`/login`). Depois do login:

- **Cadastrar:** botão **+ Novo Pokémon** na tela inicial (`/pokemon/new`).
- **Editar:** botão **Editar** na página de detalhes (`/pokemon/:id/edit`).
- **Excluir:** botão **Excluir** na página de detalhes, com confirmação.

Sem login, esses botões não aparecem e as rotas de cadastro e edição redirecionam para o login.

### ✅ Requisitos da atividade

| Requisito | Onde está |
| --------- | --------- |
| Spring Boot + Spring Web + Spring Data MongoDB | `backend/pom.xml` |
| Controller / Service / Repository / Model | `backend/src/main/java/com/pokedex/` |
| Endpoints `GET/POST/PUT/DELETE /api/pokemons` | `PokemonController` |
| Dados do `Script_Pokedex.sql` no MongoDB | `DatabaseSeeder` + `SqlScriptParser` |
| React consumindo a API (busca, filtro por tipo, detalhes, atributos) | `frontend/src/services/api.js` |
| Cadastrar, editar e excluir pela interface | `PokemonFormPage` e `PokemonDetailsPage` |
| Credenciais fora do GitHub | `backend/.env` (no `.gitignore`) |
| Desafios opcionais: consulta por tipo, treinadores, busca por nome | `?typeId=`, `?name=`, `/api/trainers` |

### 👥 Integrantes

- **Integrante 1:** Mayra Luìza
- **Integrante 2:** Larissa Cravo
