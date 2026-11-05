# Plano de Desenvolvimento e Estado do Projeto - MeuFinanceiro

> **Objetivo deste documento:** Registrar o contexto completo, decisões técnicas, etapas concluídas, estado atual e próximos passos do projeto **MeuFinanceiro**. Este arquivo permite que o estudante e qualquer agente de IA retomem o desenvolvimento exatamente de onde parou, mantendo o alinhamento pedagógico e técnico.

---

## 1. Contexto do Projeto

* **Disciplina:** Laboratório de Programação (Ciência da Computação - Centro Universitário Unifacvest).
* **Finalidade:** Sistema web de controle financeiro pessoal para registro de receitas, despesas, categorias, saldos e gráficos de acompanhamento.
* **Repositório Oficial:** [https://github.com/guilhermeburatto/MeuFinanceiro](https://github.com/guilhermeburatto/MeuFinanceiro) (Branch principal: `main`).
* **Equipe:** 
  * Guilherme Buratto Fernandes Walter
  * Jeferson Gomes Martins
* **Gestão Ágil:** Quadro Kanban mantido via **Trello** (registros visuais arquivados em `docs/kanban-prints/`).
* **Data Prevista de Entrega/Apresentação:** 09/11/2026 (Apresentação presencial de 10 minutos).

---

## 2. Diretrizes e Modo de Trabalho com o Estudante

1. **Foco no Aprendizado:** O estudante está retomando os estudos de programação. Toda explicação deve ser clara, didática e acessível, justificando os conceitos e o *porquê* de cada decisão de engenharia.
2. **Ritmo de Trabalho:** Executar **uma única tarefa por vez**. Sempre aguardar a autorização do estudante antes de iniciar a próxima tarefa ou etapa.
3. **Padrão de Resumo ao Concluir Tarefas:** Ao finalizar uma tarefa, agrupar as informações em 4 seções:
   - *1. Resumo do que foi feito.*
   - *2. Comandos utilizados.*
   - *3. Motivo de cada decisão.*
   - *4. Como você pode verificar se funcionou.*
4. **Padrão de Commits Obrigatório:**
   - **Semantic Commits:** Prefixo em inglês e descrição estritamente em português.
   - *Exemplos:* `feat: implementar cadastro de despesas`, `fix: corrigir cálculo do saldo`, `chore: inicializar backend com express`, `docs: atualizar documentação`.
5. **Atualização Contínua da Documentação:** Manter tanto este arquivo quanto o `DOCUMENTACAO_IA.md` rigorosamente atualizados ao final de cada entrega.

---

## 3. Decisões Arquiteturais e Tecnológicas

| Componente | Escolha Técnica | Motivo / Justificativa |
| :--- | :--- | :--- |
| **Runtime Backend** | Node.js 24.x (`v24.22.2`) | Respeita o teto estabelecido pelo professor (22.x a 24.x). |
| **Padrão de Módulos** | JavaScript Moderno (ES Modules nativo) | Permite sintaxe unificada `import/export` no backend e frontend. |
| **Framework Backend** | Express | Framework minimalista e padrão para APIs REST. |
| **Ferramenta de Dev** | Nodemon | Reinicialização automática da API ao salvar arquivos. |
| **Banco de Dados** | PostgreSQL 16 (`postgres:16-alpine`) | Provisionado via Docker Compose na porta `5433` com volume persistente (`meufinanceiro_postgres_data`). |
| **ORM** | Prisma ORM (v6.19.3) | Modelagem tipada, migrações seguras e prevenção de SQL Injection. |
| **Precisão Monetária** | `Decimal(10, 2)` no banco/Prisma | Evita dízimas e imprecisões do ponto flutuante do JavaScript em valores financeiros. |
| **Frontend** | React (SPA via Vite) | Biblioteca moderna pretendida pelo grupo para construção da interface. |
| **Autenticação** | Sem autenticação inicial (usuário único local) | Mantém o escopo focado nas regras de negócio financeiras, sem complexidade de JWT/sessão desnecessária. |
| **Integridade de Dados** | Restrição de exclusão de categoria | Impede a exclusão de categorias que já possuam movimentações vinculadas (`onDelete: Restrict`). |

---

## 4. Histórico de Etapas e Tarefas Concluídas

### ✅ Etapa 0: Ambiente, Infraestrutura e Governança (CONCLUÍDA)
* **Tarefa 0.1:** Inicialização do repositório Git local, criação do `.gitignore` protegendo `.env` e `node_modules`, criação da estrutura de pastas (`docs/`, `backend/`, `frontend/`), criação do `README.md`, do `DOCUMENTACAO_IA.md` e de `docs/arquitetura.md`.
* **Tarefa 0.2:** Criação do `docker-compose.yml` para o PostgreSQL 16 Alpine com volume persistente, criação do `.env.example`, subida do container, teste de prontidão com `pg_isready` e adição do print do Trello (`03-11.png`).
* **Repositório Remoto:** Conexão com o GitHub em `https://github.com/guilhermeburatto/MeuFinanceiro` e envio do histórico para a branch `main`.

### ✅ Etapa 1: Backend Base e Modelagem de Dados (CONCLUÍDA)
* **Tarefa 1.1:** Inicialização de `backend/package.json` com ES Modules, instalação de `express`, `cors`, `dotenv`, `nodemon`, criação de `server.js` com rota `/api/status`, teste validado no navegador.
* **Tarefa 1.2:** Modelagem do schema Prisma (`Categoria` e `Movimentacao`), execução da migração inicial no PostgreSQL, script de seed populando as 12 categorias base e criação do singleton PrismaClient.
* **Alinhamento e Fix de Porta:** Sincronização do trabalho da dupla, isolamento do Docker na porta `5433` e remoção de artefatos experimentais.

### 🔄 Etapa 2: API REST de Categorias e Movimentações (EM ANDAMENTO)
* **Tarefa 2.1 (Concluída):**
  - Criação de `backend/src/controllers/categoriaController.js` implementando CRUD completo (`listar`, `buscarPorId`, `criar`, `atualizar`, `excluir`).
  - Suporte a filtro por tipo via query param (`GET /api/categorias?tipo=RECEITA` ou `DESPESA`).
  - Validações de entradas (nome obrigatório, tipo válido, formato de cor hexadecimal `#RRGGBB`).
  - Proteção de integridade referencial: bloqueio de exclusão se houver movimentações vinculadas com mensagem descritiva.
  - Criação de `backend/src/routes/categoriaRoutes.js` e conexão sob o prefixo `/api/categorias` em `backend/src/server.js`.
  - Validação automatizada de 5 cenários de teste HTTP cobrindo todas as operações com sucesso.

---

## 5. Estado Atual do Sistema

* **Container PostgreSQL:** Ativo no Docker (`meufinanceiro_postgres`), aceitando conexões na porta `5433`.
* **Banco de Dados:** Tabelas `categorias` e `movimentacoes` criadas via migração e populadas com 12 categorias base via seed.
* **Prisma ORM:** Prisma Client 6.19.3 gerado e conectado ao PostgreSQL.
* **API REST:** Endpoints de Categorias (`/api/categorias`) e Health Check (`/api/status`) 100% operacionais.
* **Documentação de IA:** `DOCUMENTACAO_IA.md` atualizado com todas as iterações e decisões técnicas até a Tarefa 2.1.

---

## 6. Próxima Tarefa Planejada

### 🎯 Tarefa 2.2: Implementação da API REST de Movimentações (Receitas e Despesas)
**O que será feito:**
1. Criar o controlador (`backend/src/controllers/movimentacaoController.js`):
   - `listar`: listagem com filtros dinâmicos por período (data início e data fim) e por categoria (`categoriaId`), ordenados por data decrescente.
   - `buscarPorId`: busca de movimentação específica com dados da categoria inclusos.
   - `criar`: cadastro de receita ou despesa validando valor positivo, data válida, tipo compatível e existência da categoria.
   - `atualizar`: edição de movimentação existente.
   - `excluir`: remoção de movimentação por ID.
2. Criar as rotas (`backend/src/routes/movimentacaoRoutes.js`) e plugar no `server.js` sob `/api/movimentacoes`.
3. Testar todas as operações e validar a gravação e integridade no banco de dados.

---

## 7. Visão Geral das Próximas Etapas

* **Etapa 2: API REST de Categorias e Movimentações (Backend)**
  * CRUD completo de Categorias com validações (Concluído).
  * CRUD completo de Movimentações (Receitas e Despesas).
  * Endpoint de resumo para o Dashboard (cálculo de total de receitas, total de despesas, saldo e despesas por categoria).
* **Etapa 3: Frontend Base (React + Vite)**
  * Configuração do projeto React com Vite e roteamento.
  * Configuração da camada de integração HTTP com o backend.
  * Criação do layout principal (menu e cabeçalho responsivo).
* **Etapa 4: Telas de Gerenciamento**
  * Tela de Categorias (cadastro, listagem e exclusão com feedback de integridade).
  * Tela de Movimentações (formulário com validações, filtros por período e tabela de histórico).
* **Etapa 5: Dashboard Financeiro e Gráficos**
  * Cards de métricas (Receitas, Despesas, Saldo).
  * Gráfico de rosca/pizza para distribuição de despesas por categoria.
* **Etapa 6: Documentação Final e Preparação da Apresentação**
  * Atualização completa de `README.md` e `DOCUMENTACAO_IA.md`.
  * Inserção dos prints finais do Trello em `docs/kanban-prints/`.
  * Simulação do roteiro de apresentação presencial (10 minutos).
