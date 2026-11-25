
# 🎮 Pokédex — React + Vite

Aplicação web interativa desenvolvida com **React e Vite** como parte da **Atividade 03 da disciplina de Desenvolvimento e Integração de Aplicações Web**, do curso de Engenharia de Software da Pontifícia Universidade Católica de Minas Gerais (PUC Minas).

O projeto tem como objetivo apresentar informações sobre os Pokémon da região de Kanto, permitindo pesquisar, filtrar, consultar atributos e explorar os treinadores e suas equipes por meio de uma interface responsiva.

> 📌 As instruções completas de execução (MongoDB Atlas, backend e frontend) estão no [README da raiz](../README.md).

## 🚀 Atividade 04 — Full Stack: React + Spring Boot + MongoDB

A partir da Atividade 04, a Pokédex deixou de ler o `pokedex-data.json` e passou a consumir uma **API REST em Spring Boot** que persiste os dados no **MongoDB**:

```text
Script_Pokedex.sql → MongoDB → Spring Boot REST API → React + Vite
```

### 📁 Estrutura

```text
pokedex/
├── backend/               # API Spring Boot (Controller / Service / Repository / Model)
├── frontend/              # Frontend React + Vite (este README)
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

Na primeira execução, o backend lê o `Script_Pokedex.sql` (cópia em `backend/src/main/resources`) e popula as coleções **somente se estiverem vazias**:

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

O app abre em `http://localhost:5173`. Para usar outra URL de API, copie `.env.example` para `.env` e ajuste `VITE_API_URL`.

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

## 📌 Sobre o projeto

A Pokédex foi desenvolvida para colocar em prática conceitos de desenvolvimento frontend com React, incluindo:

- Componentização e reutilização de componentes.
- Passagem de dados por props.
- Gerenciamento de estados com `useState`.
- Utilização de `useEffect`.
- Manipulação de eventos.
- Renderização dinâmica de listas com `map()`.
- Pesquisa e filtragem de dados.
- Navegação entre páginas.
- Estilização com CSS.
- Responsividade e alternância de temas.

Na Atividade 03, os dados vinham do arquivo `pokedex-data.json`, sem banco de dados ou backend. Na Atividade 04, eles passam a vir da API (veja a seção acima).

## ✨ Funcionalidades

### 🐾 Pokédex

A página inicial apresenta os Pokémon disponíveis na base de dados, organizados em cards.

Cada Pokémon possui informações como:

- Número de identificação (ID).
- Nome.
- Imagem.
- Tipo ou tipos.
- HP.
- Ataque.
- Defesa.
- Ataque Especial.
- Defesa Especial.
- Velocidade.

### 🔎 Pesquisa de Pokémon

A aplicação permite pesquisar Pokémon pelo nome ou número de identificação.

A listagem é atualizada dinamicamente conforme o usuário digita.

### 🧬 Filtro por tipo

É possível filtrar os Pokémon de acordo com seus tipos, utilizando os dados presentes no arquivo JSON.

O filtro facilita a exploração dos diferentes Pokémon cadastrados.

### 📊 Detalhes dos Pokémon

Ao selecionar um Pokémon, o usuário é direcionado para uma página com informações detalhadas.

A página apresenta:

- Identificação do Pokémon.
- Imagem.
- Nome.
- Tipos.
- Atributos de batalha.
- Barras visuais de estatísticas.

Os atributos exibidos são HP, Attack, Defense, Special Attack, Special Defense e Speed.

### 🧑‍🚀 Treinadores Pokémon

A aplicação também possui uma página dedicada aos treinadores.

Nessa página, o usuário pode:

- Visualizar os treinadores cadastrados.
- Consultar suas informações.
- Expandir os cards.
- Visualizar os Pokémon pertencentes às equipes.
- Navegar para os detalhes dos Pokémon.

### 🎨 Modos de exibição: Claro, Escuro e Retrô

A aplicação oferece três opções de personalização visual: **modo claro, modo escuro e modo retrô**.

- ☀️ **Modo claro:** apresenta uma interface com cores claras e visual limpo.
- 🌙 **Modo escuro:** utiliza tons escuros, proporcionando maior conforto visual em ambientes com pouca iluminação.
- 🕹️ **Modo retrô:** apresenta uma estética inspirada em interfaces e jogos clássicos, com cores e elementos visuais característicos desse estilo.

A preferência selecionada é armazenada no `localStorage`, permitindo que o tema escolhido seja mantido mesmo após recarregar a página.

### 📱 Interface responsiva

O projeto utiliza CSS responsivo para adaptar os elementos da interface a diferentes tamanhos de tela, incluindo computadores, tablets e smartphones.

## 🛠️ Tecnologias utilizadas

- **React** — construção da interface com componentes.
- **Vite** — ambiente de desenvolvimento e ferramenta de build.
- **JavaScript** — implementação das funcionalidades.
- **JSX** — estrutura dos componentes React.
- **CSS3** — estilização, animações e responsividade.
- **React Router DOM** — navegação entre páginas.
- **JSON** — armazenamento dos dados utilizados na aplicação.
- **LocalStorage** — persistência da preferência de tema.
- **Git e GitHub** — versionamento e compartilhamento do projeto.

## 📁 Estrutura do projeto

A aplicação está organizada em pastas para separar componentes, páginas, estilos e dados.

```text
Pokedex/
├── public/
│   └── imgs/
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── PokemonCard.jsx
│   │   ├── DisplayList.jsx
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── PokemonHomePage.jsx
│   │   ├── PokemonDetailsPage.jsx
│   │   └── TreinersPage.jsx
│   │
│   ├── css/
│   │   ├── App.css
│   │   ├── Header.css
│   │   ├── PokemonDetails.css
│   │   └── ...
│   │
│   ├── data/
│   │   └── pokedex-data.json
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

**Observação:** a estrutura acima apresenta os principais arquivos e diretórios do projeto.

## 📦 Fonte dos dados

Os dados utilizados pela aplicação foram disponibilizados como material de apoio da Atividade 03.

O arquivo contém informações sobre Pokémon, atributos, tipos, treinadores e relações entre treinadores e Pokémon.

**Arquivo utilizado:**

`src/data/pokedex-data.json`

**Fonte original:**

[Base de dados da Pokédex — GitHub da disciplina](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/ATIVIDADES/ATIVIDADE%2003%20-%20JSON/data/pokedex-data.json)

A aplicação utiliza os dados locais importados do arquivo JSON.

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js.
- npm.
- Git (opcional, para clonar o repositório).

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Acesse a pasta do projeto:

```bash
cd Pokedex
```

Se o projeto já estiver salvo no computador, basta abrir a pasta no terminal.

### 2. Instalar as dependências

```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O Vite exibirá o endereço local de acesso à aplicação.

Normalmente:

```text
http://localhost:5173/
```

Caso a porta esteja ocupada, o Vite poderá utilizar outra porta. Nesse caso, acesse o endereço informado no terminal.

### 4. Gerar a versão de produção

```bash
npm run build
```

O comando gera a pasta `dist`, contendo os arquivos compilados para produção.

### 5. Executar a verificação de código

```bash
npm run lint
```

Esse comando executa o ESLint para verificar possíveis problemas no código.

## 🧭 Navegação

A aplicação utiliza React Router DOM para gerenciar as rotas.

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial da Pokédex |
| `/pokemon/:id` | Detalhes de um Pokémon |
| `/trainers` | Página dos treinadores |

A navegação principal é realizada pelo cabeçalho da aplicação.

## 🧩 Componentização

A interface foi desenvolvida utilizando componentes React para organizar as responsabilidades da aplicação.

Entre os principais componentes estão:

- **Header:** navegação e alternância de tema.
- **PokemonCard:** apresentação das informações dos Pokémon em cards.
- **DisplayList:** renderização da lista de Pokémon.
- **FiltersRow:** interface dos filtros.
- **StatsBar:** representação visual dos atributos.
- **PokemonHomePage:** listagem, pesquisa e filtros.
- **PokemonDetailsPage:** informações detalhadas de um Pokémon.
- **TreinersPage:** visualização dos treinadores e de suas equipes.

Essa organização facilita a manutenção e a reutilização de código.

## 🎨 Interface e identidade visual

O projeto utiliza uma identidade visual inspirada no universo Pokémon, com:

- Cards personalizados.
- Cores relacionadas aos tipos dos Pokémon.
- Efeitos de hover.
- Degradês e sombras.
- Barras visuais de atributos.
- Navegação entre páginas.
- Temas claro e escuro.
- Layout adaptável a diferentes telas.

## 🧪 Testes e validação

Foram executados os seguintes comandos de verificação:

```bash
npm run lint
npm run build
```

Ambos foram concluídos com sucesso durante o desenvolvimento.

Também devem ser verificados manualmente os seguintes comportamentos:

- Pesquisa por nome e ID.
- Filtragem por tipo.
- Tratamento de pesquisas sem resultados.
- Navegação para os detalhes.
- Visualização dos atributos.
- Expansão dos cards de treinadores.
- Alternância entre os temas.
- Exibição em diferentes tamanhos de tela.

## 👥 Integrantes

Projeto desenvolvido em dupla, utilizando a metodologia de **Pair Programming**, conforme solicitado na atividade.

- **Integrante 1:** Mayra Luìza
- **Integrante 2:** Larissa Cravo

**Curso:** Engenharia de Software

**Instituição:** Pontifícia Universidade Católica de Minas Gerais — PUC Minas

**Disciplina:** Desenvolvimento e Integração de Aplicações Web

## 📚 Considerações finais

O desenvolvimento da Pokédex permitiu aplicar conceitos fundamentais de React, como componentes, props, estados, eventos e renderização dinâmica de dados.

Além das funcionalidades obrigatórias de pesquisa, filtragem e visualização dos atributos dos Pokémon, o projeto incorpora recursos adicionais, como a página de treinadores, a visualização das equipes e a alternância entre temas claro e escuro.

A aplicação demonstra a utilização de React e Vite na construção de interfaces web interativas, organizadas e responsivas.
