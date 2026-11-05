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

## 6. Próximos Passos e Divisão de Tarefas da Dupla

### ✅ Etapa 3: Frontend Base e Integracao (CONCLUÍDA POR JEFERSON)
* **Tarefa 3.1 (Concluída por Jeff):**
  - Inicialização do projeto React na pasta `frontend/` utilizando o Vite (`react` template).
  - Instalação e verificação das dependências de runtime (`react`, `react-dom`) e dev (`vite`, `@vitejs/plugin-react`).
  - Instalação da biblioteca de ícones vetoriais modernos `lucide-react` para os indicadores financeiros.
  - Teste de compilação em produção (`npm run build`) validado com sucesso sem erros.
* **Tarefa 3.2 (Concluída por Jeff):**
  - Criação da camada de integração HTTP modular em `frontend/src/services/api.js` utilizando Fetch API nativa.
  - Implementação de tratamento unificado de erros de rede e mensagens de validação da API REST.
  - Mapeamento completo dos serviços da API: `obterStatus`, `dashboardService.obterResumo`, `categoriaService` (CRUD) e `movimentacaoService` (CRUD com filtros de período e tipo).
  - Criação de `frontend/.env.example` com a variável `VITE_API_URL=http://localhost:3000/api`.
* **Tarefa 3.3 (Concluída por Jeff):**
  - Criação do layout base profissional e responsivo com navegação fluida por abas (`Dashboard`, `Movimentações`, `Categorias`).
  - Implementação de monitoramento de saúde do backend com badge dinâmico (Online/Offline/Conectando).
  - Construção do painel inicial do Dashboard com cards de métricas (Receitas, Despesas, Saldo Líquido com indicação visual positiva/negativa), distribuição de despesas por categoria com barras de progresso percentuais e lista de movimentações recentes.
  - Pré-visualização integrada de movimentações e categorias sincronizadas em tempo real com a API e banco de dados.

---

## 5. Estado Atual do Sistema

* **Container PostgreSQL:** Ativo no Docker (`meufinanceiro_postgres`), aceitando conexões na porta `5433`.
* **Banco de Dados:** Tabelas `categorias` e `movimentacoes` criadas via migração e populadas com 12 categorias base e dados de teste.
* **Prisma ORM:** Prisma Client 6.19.3 conectado e operando consultas relacionais e agregações.
* **API REST Backend:** 100% pronta e testada (`/api/status`, `/api/categorias`, `/api/movimentacoes`, `/api/dashboard/resumo`).
* **Frontend Base (React + Vite):** 100% operacional, integrado via HTTP com a API, layout responsivo e exibição dinâmica de dados do Dashboard, Movimentações e Categorias.
* **Documentação de IA:** `DOCUMENTACAO_IA.md` rigorosamente atualizado com todas as iterações e decisões técnicas até a Tarefa 3.3.

---

## 6. Próxima Etapa Planejada e Divisão de Tarefas da Dupla

### 🎯 Etapa 4: Telas de Gerenciamento Interativas, Formulários e Gráficos
> **Responsável designado:** Guilherme Buratto.  
> **Orientações para início dos trabalhos:**
> 1. Puxar o código atualizado do repositório remoto:
>    ```powershell
>    git pull origin main
>    ```
> 2. Entrar na pasta `frontend/` e instalar as dependências:
>    ```powershell
>    cd frontend
>    npm install
>    ```
> 3. Subir o backend e o frontend para desenvolvimento local:
>    - Terminal 1 (Backend): `cd backend; npm run dev`
>    - Terminal 2 (Frontend): `cd frontend; npm run dev`

#### 📋 Tarefas a serem desenvolvidas pelo Guilherme:

1. **Tarefa 4.1: Gerenciamento Interativo de Categorias (Frontend)**
   - **Modal de Cadastro:** Criação de modal para nova categoria contendo:
     - Campo `nome` (obrigatório, máximo 100 caracteres).
     - Seletor de `tipo` (`RECEITA` ou `DESPESA`).
     - Seletor de `cor` (seletor de cor hexadecimal com paleta prévia).
   - **Modal de Edição:** Permitir alterar nome, tipo ou cor de categoria existente chamando `categoriaService.atualizar(id, dados)`.
   - **Exclusão com Feedback de Integridade:**
     - Botão de exclusão com diálogo de confirmação.
     - Tratamento da resposta da API: caso a categoria possua movimentações vinculadas (retorno de erro HTTP 400), exibir um alerta/toast explicativo na tela para o usuário informando que a categoria não pode ser excluída pois possui movimentações associadas (atendendo ao requisito acadêmico 3.4).
   - **Commit Semântico:** `feat: implementar gerenciamento interativo de categorias`

2. **Tarefa 4.2: Gerenciamento Interativo de Movimentações (Frontend)**
   - **Modal de Cadastro de Movimentações:**
     - Formulário para inclusão de receitas ou despesas com os campos: `descricao` (texto), `valor` (monetário positivo), `data` (seletor de data, com padrão na data de hoje), `tipo` (`RECEITA` ou `DESPESA`) e `categoriaId`.
     - **Regra de Coerência no Form:** Ao selecionar o tipo (ex: `DESPESA`), o seletor de categorias deve listar apenas as categorias compatíveis (despesas).
   - **Tabela Completa de Movimentações:**
     - Listagem de todas as movimentações com data formatada, descrição, badge da categoria com sua respectiva cor, tipo e valor em verde/vermelho.
     - Filtros dinâmicos no topo da tabela:
       - Filtro por período (`dataInicio` e `dataFim`).
       - Filtro por tipo (`Todas`, `Receitas`, `Despesas`).
       - Filtro por categoria específica.
     - Ações de exclusão e edição por linha da tabela chamando `movimentacaoService`.
   - **Commit Semântico:** `feat: implementar cadastro e filtros de movimentacoes`

3. **Tarefa 4.3: Visualização Gráfica no Dashboard**
   - Instalação de biblioteca moderna e leve de gráficos para React (recomendado: `recharts`).
   - Renderização de gráfico de rosca/pizza (Donut Chart) na aba Dashboard para ilustrar visualmente a fatia percentual de despesas por categoria, utilizando os dados agregados já fornecidos pelo endpoint `/api/dashboard/resumo`.
   - Inclusão de tooltip interativo com o valor em R$ e o percentual de cada categoria.
   - **Commit Semântico:** `feat: adicionar grafico de distribuicao de despesas no dashboard`

---

## 7. Visão Geral das Etapas Seguintes

* **Etapa 5: Validação Integrada, Responsividade e Polimento Final**
  - Testes de ponta a ponta (E2E manual) em todos os fluxos: cadastrar categoria -> cadastrar receita/despesa -> verificar atualização imediata no saldo e no gráfico do dashboard -> tentar excluir categoria em uso e validar mensagem amigável.
  - Verificação de responsividade em diferentes larguras de tela (mobile e desktop).
* **Etapa 6: Documentação Final e Preparação da Apresentação**
  - Atualização final de `README.md` com instruções completas de execução a partir do zero (`docker compose up -d`, `npm run dev`).
  - Inserção dos prints finais de acompanhamento do quadro Kanban no Trello em `docs/kanban-prints/`.
  - Elaboração do roteiro detalhado para a apresentação presencial de 10 minutos (prevista para 09/11/2026).
