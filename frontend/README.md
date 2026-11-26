# Pokédex — Frontend

Frontend React + Vite da Atividade 04. A interface consulta o backend Spring Boot; não carrega os dados de Pokémon de um arquivo JSON local.

Para configuração completa do MongoDB, backend, autenticação e execução da aplicação, consulte o [README principal](../README.md).

## Funcionalidades

- Pokédex com busca por nome ou número e filtro por tipo.
- Página de detalhes com estatísticas do Pokémon.
- Cadastro, edição, exclusão e envio de imagens (requer login).
- Páginas de treinadores e equipes.
- Aba de insígnias com busca por nome, tipo, líder ou cidade.
- Favoritos por conta e equipe pessoal com até seis Pokémon, ordem editável e salvamento no MongoDB.
- Temas claro, escuro e retrô; layout responsivo.

## Rotas da interface

| Rota | Conteúdo |
| --- | --- |
| `/` | Lista, busca e filtro de Pokémon |
| `/pokemon/:id` | Detalhes de um Pokémon |
| `/pokemon/new` | Cadastro (requer login) |
| `/pokemon/:id/edit` | Edição (requer login) |
| `/trainers` | Treinadores e equipes |
| `/badges` | Insígnias de Kanto e busca |
| `/team` | Favoritos e equipe pessoal (requer login) |
| `/login`, `/register` | Autenticação |

## Executar

Requisitos: Node.js e npm. Com o backend já configurado e rodando em `http://localhost:18084`:

```powershell
cd frontend
npm install
npm run dev
```

O Vite informa o endereço local no terminal (normalmente `http://localhost:5173`). Para apontar a outra API, defina `VITE_API_URL` em `frontend/.env`; veja `frontend/.env.example`.

Verificações do frontend:

```powershell
npm test
npm run lint
npm run build
```

Os testes unitários usam Vitest e Testing Library para verificar a seleção de imagens, chamadas e erros da API e interações dos cards de Pokémon.
