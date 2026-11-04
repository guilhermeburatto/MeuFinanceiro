# Plano de Desenvolvimento e Estado do Projeto - MeuFinanceiro

> **Objetivo deste documento:** Registrar o contexto completo, decisões técnicas, etapas concluídas, estado atual e próximos passos do projeto **MeuFinanceiro**. Este arquivo permite que o estudante e qualquer agente de IA retomem o desenvolvimento exatamente de onde parou, mantendo o alinhamento pedagógico e técnico.

---

## 1. Contexto do Projeto

* **Disciplina:** Laboratório de Programação (Ciência da Computação - Centro Universitário Unifacvest).
* **Finalidade:** Sistema web de controle financeiro pessoal para registro de receitas, despesas, categorias, saldos e gráficos de acompanhamento.
* **Repositório Oficial:** [https://github.com/guilhermeburatto/MeuFinanceiro](https://github.com/guilhermeburatto/MeuFinanceiro) (Branch principal: `main`).
* **Equipe:** Grupo de exatamente duas pessoas.
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
| **Banco de Dados** | PostgreSQL 16 (`postgres:16-alpine`) | Provisionado via Docker Compose com volume persistente nomeado (`meufinanceiro_postgres_data`). |
| **ORM** | Prisma ORM | Modelagem tipada, migrações seguras e prevenção de SQL Injection. |
| **Precisão Monetária** | `Decimal(10, 2)` no banco/Prisma | Evita dízimas e imprecisões do ponto flutuante do JavaScript em valores financeiros. |
| **Frontend** | React (SPA via Vite) | Biblioteca moderna pretendida pelo grupo para construção da interface. |
| **Autenticação** | Sem autenticação inicial (usuário único local) | Mantém o escopo focado nas regras de negócio financeiras, sem complexidade de JWT/sessão desnecessária. |
| **Integridade de Dados** | Restrição de exclusão de categoria | Impede a exclusão de categorias que já possuam movimentações vinculadas. |

---

## 4. Histórico de Etapas e Tarefas Concluídas

### ✅ Etapa 0: Ambiente, Infraestrutura e Governança (CONCLUÍDA)
* **Tarefa 0.1:** Inicialização do repositório Git local, criação do `.gitignore` protegendo `.env` e `node_modules`, criação da estrutura de pastas (`docs/`, `backend/`, `frontend/`), criação do `README.md`, do `DOCUMENTACAO_IA.md` e de `docs/arquitetura.md`.
* **Tarefa 0.2:** Criação do `docker-compose.yml` para o PostgreSQL 16 Alpine com volume persistente, criação do `.env.example`, subida do container na porta 5432, teste de prontidão com `pg_isready` e adição do print do Trello (`03-11.png`).
* **Repositório Remoto:** Conexão com o GitHub em `https://github.com/guilhermeburatto/MeuFinanceiro` e envio do histórico para a branch `main`.

### 🔄 Etapa 1: Backend Base e Modelagem de Dados (EM ANDAMENTO)
* **Tarefa 1.1 (Concluída):**
  - Inicialização de `backend/package.json` com `"type": "module"`.
  - Instalação de `express`, `cors`, `dotenv` e `nodemon` (dev).
  - Criação de `backend/src/server.js` com middlewares e endpoint `GET /api/status`.
  - Configuração do script `npm run dev`.
  - Teste validado pelo estudante no navegador (`http://localhost:3000/api/status`).
  - Commit semântico: `chore: inicializar backend com express e nodemon` e push sincronizado com o GitHub.

---

## 5. Estado Atual do Sistema

* **Container PostgreSQL:** Ativo no Docker (`meufinanceiro_postgres`), aceitando conexões em `localhost:5432`.
* **Servidor Backend:** Estruturado e testado localmente na porta `3000`.
* **Git/GitHub:** Repositório local e remoto perfeitamente sincronizados na branch `main`.
* **Documentação de IA:** `DOCUMENTACAO_IA.md` atualizado com todas as iterações e prompts até a Tarefa 1.1.

---

## 6. Próxima Tarefa Planejada

### 🎯 Tarefa 1.2: Configuração do Prisma ORM e Modelagem do Banco de Dados
**O que será feito:**
1. Instalar o `prisma` (dependência de desenvolvimento) e o `@prisma/client` na pasta `backend/`.
2. Inicializar o Prisma configurado para PostgreSQL (`npx prisma init --datasource-provider postgresql`).
3. Modelar as entidades no arquivo `backend/prisma/schema.prisma`:
   * Enum `TipoMovimentacao`: `RECEITA` e `DESPESA`.
   * Model `Categoria`: `id`, `nome`, `tipo`, `cor` (opcional), `criadoEm`, relação com `Movimentacao[]`.
   * Model `Movimentacao`: `id`, `descricao`, `valor` (`Decimal(10,2)`), `data`, `tipo`, `categoriaId`, relação com `Categoria` com regra `onDelete: Restrict`.
4. Executar a primeira migração com o comando:
   ```powershell
   npx prisma migrate dev --name init_schema
   ```
   *(Este comando criará fisicamente as tabelas dentro do container PostgreSQL que já está rodando no Docker).*
5. Criar um script de *seed* (`backend/prisma/seed.js`) para pré-cadastrar automaticamente categorias essenciais (ex: Alimentação, Transporte, Moradia, Salário, etc.).
6. Atualizar a documentação, registrar o commit semântico (`feat: modelar schema do banco com prisma e criar migracao inicial`) e enviar para o GitHub (`git push`).

---

## 7. Visão Geral das Próximas Etapas

* **Etapa 2: API REST de Categorias e Movimentações (Backend)**
  * CRUD completo de Categorias com validações.
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
