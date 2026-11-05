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

### ✅ Etapa 2: API REST de Categorias e Movimentações (CONCLUÍDA)
* **Tarefa 2.1 (Concluída):**
  - Criação de `backend/src/controllers/categoriaController.js` implementando CRUD completo (`listar`, `buscarPorId`, `criar`, `atualizar`, `excluir`).
  - Suporte a filtro por tipo via query param (`GET /api/categorias?tipo=RECEITA` ou `DESPESA`).
  - Validações de entradas (nome obrigatório, tipo válido, formato de cor hexadecimal `#RRGGBB`).
  - Proteção de integridade referencial: bloqueio de exclusão se houver movimentações vinculadas com mensagem descritiva.
  - Criação de `backend/src/routes/categoriaRoutes.js` e conexão sob `/api/categorias`.
  - Validação automatizada de 5 cenários de teste HTTP.
* **Tarefa 2.2 (Concluída):**
  - Criação de `backend/src/controllers/movimentacaoController.js` implementando CRUD completo de receitas e despesas.
  - Filtros avançados na listagem: por período (`dataInicio` e `dataFim`), por categoria (`categoriaId`) e por tipo (`RECEITA`/`DESPESA`), com dados da categoria incluídos via `include`.
  - Validações de regras de negócio: valor estritamente positivo, data válida, verificação de existência da categoria e validação de coerência de tipo (impede vincular despesa a uma categoria de receita).
  - Criação de `backend/src/routes/movimentacaoRoutes.js` e conexão com `/api/movimentacoes`.
  - Testes automatizados executados e aprovados.
* **Tarefa 2.3 (Concluída):**
  - Criação de `backend/src/controllers/dashboardController.js` calculando os totais de receitas, despesas, saldo líquido, agrupamento percentual e financeiro de despesas por categoria com paleta de cores para os gráficos, e lista das últimas movimentações recentes.
  - Criação de `backend/src/routes/dashboardRoutes.js` e conexão com `/api/dashboard/resumo`.
  - Testes matemáticos automatizados executados e validados.

---

## 5. Estado Atual do Sistema

* **Container PostgreSQL:** Ativo no Docker (`meufinanceiro_postgres`), aceitando conexões na porta `5433`.
* **Banco de Dados:** Tabelas `categorias` e `movimentacoes` criadas via migração e populadas com 12 categorias base e dados de teste.
* **Prisma ORM:** Prisma Client 6.19.3 conectado e operando consultas relacionais e agregações.
* **API REST Backend:** 100% pronta e testada (`/api/status`, `/api/categorias`, `/api/movimentacoes`, `/api/dashboard/resumo`).
* **Documentação de IA:** `DOCUMENTACAO_IA.md` atualizado com todas as iterações e decisões técnicas até a Tarefa 2.3.

---

## 6. Próxima Tarefa Planejada

### 🎯 Tarefa 3.1: Inicialização do Frontend Base com React e Vite
**O que será feito:**
1. Criar a aplicação React moderna dentro da pasta `frontend/` utilizando o Vite (`npm create vite@latest frontend -- --template react`).
2. Instalar dependências essenciais de interface e comunicação:
   - `lucide-react`: ícones modernos para finanças (carteira, setas de entrada/saída, tags, gráficos).
   - Configuração de estilização limpa e responsiva.
3. Configurar proxy reverso no `vite.config.js` para redirecionar `/api` automaticamente para o backend (`http://localhost:3000`), evitando qualquer problema de portas no navegador.
4. Criar um componente de teste que busca os dados de `/api/status` e `/api/dashboard/resumo`, comprovando a comunicação de ponta a ponta (Frontend ➔ Backend ➔ PostgreSQL).
5. Documentar, comitar (`chore: inicializar frontend com react e vite`) e enviar para o GitHub.

---

## 7. Visão Geral das Próximas Etapas

* **Etapa 3: Frontend Base (React + Vite)**
  * Inicialização e configuração do Vite com React (Próxima tarefa).
  * Criação do layout principal (Sidebar de navegação, cabeçalho e estrutura de rotas).
* **Etapa 4: Telas de Gerenciamento**
  * Tela de Categorias (cadastro, listagem e exclusão com feedback de integridade).
  * Tela de Movimentações (formulário com validações, filtros por período e tabela de histórico).
* **Etapa 5: Dashboard Financeiro e Gráficos**
  * Cards de métricas (Receitas, Despesas, Saldo).
  * Gráfico de rosca/pizza para distribuição de despesas por categoria (usando biblioteca leve como Recharts).
* **Etapa 6: Documentação Final e Preparação da Apresentação**
  * Atualização completa de `README.md` e `DOCUMENTACAO_IA.md`.
  * Inserção dos prints finais do Trello em `docs/kanban-prints/`.
  * Simulação do roteiro de apresentação presencial (10 minutos).
