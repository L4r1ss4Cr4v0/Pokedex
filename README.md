
# 🎮 Pokédex — React + Vite

Aplicação web interativa desenvolvida com **React e Vite** como parte da **Atividade 03 da disciplina de Desenvolvimento e Integração de Aplicações Web**, do curso de Engenharia de Software da Pontifícia Universidade Católica de Minas Gerais (PUC Minas).

O projeto tem como objetivo apresentar informações sobre os Pokémon da região de Kanto, permitindo pesquisar, filtrar, consultar atributos e explorar os treinadores e suas equipes por meio de uma interface responsiva.

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

A aplicação utiliza os dados disponibilizados no arquivo `pokedex-data.json`, sem necessidade de banco de dados ou servidor backend.

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

### 🌙 Modo claro e escuro

A aplicação oferece alternância entre os temas claro e escuro.

A preferência selecionada é armazenada no `localStorage`, permitindo que o tema seja mantido ao recarregar a página.

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

- **Integrante 1:** [Nome completo]
- **Integrante 2:** [Nome completo]

**Curso:** Engenharia de Software

**Instituição:** Pontifícia Universidade Católica de Minas Gerais — PUC Minas

**Disciplina:** Desenvolvimento e Integração de Aplicações Web

## 📚 Considerações finais

O desenvolvimento da Pokédex permitiu aplicar conceitos fundamentais de React, como componentes, props, estados, eventos e renderização dinâmica de dados.

Além das funcionalidades obrigatórias de pesquisa, filtragem e visualização dos atributos dos Pokémon, o projeto incorpora recursos adicionais, como a página de treinadores, a visualização das equipes e a alternância entre temas claro e escuro.

A aplicação demonstra a utilização de React e Vite na construção de interfaces web interativas, organizadas e responsivas.
