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
* **Tarefa 2.1:** CRUD completo de Categorias com validações, filtros e proteção de integridade referencial.
* **Tarefa 2.2:** CRUD completo de Movimentações com validações e filtros de período e categoria.
* **Tarefa 2.3:** Endpoints analíticos do Dashboard calculando totais de receitas, despesas, saldo líquido, agrupamento percentual por categoria com cores para gráficos e lista de lançamentos recentes.

### ✅ Etapa 3: Frontend Base e Integração (CONCLUÍDA POR JEFERSON)
* **Tarefa 3.1:** Inicialização do projeto React com Vite e instalação da biblioteca `lucide-react`.
* **Tarefa 3.2:** Criação da camada de integração HTTP modular em `frontend/src/services/api.js`.
* **Tarefa 3.3:** Estrutura de layout responsivo por abas (Dashboard, Movimentações, Categorias), monitor de saúde da API e cards de métricas iniciais.

### ✅ Etapa 4: Telas de Gerenciamento Interativas, Formulários e Gráficos (CONCLUÍDA - GUILHERME)
* **Tarefa 4.1 (Concluída por Guilherme):**
  - Barra de ações com filtros rápidos por tipo (`Todas`, `Despesas`, `Receitas`).
  - Modal interativo de cadastro de novas categorias com validação de nome, tipo e seletor com paleta de 12 cores pré-definidas e customização livre.
  - Modal interativo de edição de categorias existentes com pré-carregamento dos dados.
  - Exclusão com diálogo de confirmação e tratamento da trava de integridade: captura de erro 400 da API com exibição de alerta explicativo na tela para o usuário (atendendo ao requisito acadêmico 3.4).
  - Banners de feedback visual (sucesso e erro) integrados à interface.
* **Tarefa 4.2 (Concluída por Guilherme):**
  - Barra de filtros avançados combinando filtro por tipo (`Todas`, `Receitas`, `Despesas`), filtro por categoria específica e filtro por período de datas (`De` / `Até`).
  - Linha de resumo financeiro instantâneo com contagem de lançamentos e soma dos totais filtrados de receitas e despesas.
  - Modal dinâmico de lançamento com alternância visual entre Despesa e Receita, campos de descrição, valor positivo, data e **seletor inteligente de categorias** (que lista apenas as categorias compatíveis com o tipo escolhido).
  - Ações por linha com botões de edição e exclusão com diálogo de confirmação e recálculo automático do saldo.
* **Tarefa 4.3 (Concluída por Guilherme):**
  - Instalação e integração da biblioteca de visualização de dados `recharts`.
  - Gráfico de rosca dinâmico (Donut Chart) na aba Dashboard com `PieChart`, `Pie`, `Cell`, `Tooltip` e `ResponsiveContainer`.
  - Mapeamento direto das cores hexadecimais cadastradas no PostgreSQL para cada fatia do gráfico.
  - Tooltip interativo customizado exibindo o nome da categoria, valor em Reais (BRL) e a porcentagem exata da despesa.
  - Seletor toggle entre "Despesas" e "Receitas" no card de distribuição do Dashboard.
  - Lista de apoio com barras de preenchimento proporcional e tratamento limpo de estado vazio.

### ✅ Etapa 5: Polimento Visual, Responsividade Mobile e Testes de Usabilidade (CONCLUÍDA POR JEFERSON / JEFF)
* **Tarefa 5.1 (Concluída por Jeferson):**
  - Implementação de regras de responsividade base em `frontend/src/index.css` cobrindo breakpoints de 768px (tablets) e 640px (smartphones).
  - Ajuste de proporções e espaçamentos no cabeçalho (`.header` e `.header-content`), garantindo alinhamento harmonioso do logo e do badge de conectividade da API.
  - Otimização da barra de navegação (`.nav-tabs-content`), distribuindo as abas proporcionalmente no mobile com áreas de toque acessíveis.
  - Reformulação estrutural dos modais (`.modal-container`, `.modal-body` e `.modal-footer`): altura máxima controlada (`90vh`/`94vh`), rolagem vertical com `-webkit-overflow-scrolling: touch` para impedir cortes em telas pequenas ou teclados virtuais, e botões empilhados com largura total no rodapé móvel.
  - Ajustes de usabilidade e clique confortável para os botões de fechar e alertas de feedback (`.feedback-alert`).
* **Tarefa 5.2 (Concluída por Jeferson):**
  - Adaptação completa das 3 abas essenciais para dispositivos móveis e tablets:
    - **Dashboard:** Grid de métricas financeiras adaptado para 1 coluna no celular; otimização do gráfico Donut com Recharts (`height: 210px`) e toggle de Despesas/Receitas com largura total e toque confortável.
    - **Movimentações:** Reorganização vertical dos filtros avançados (filtros por tipo, categoria e período De/Até); barra de resumo de lançamentos responsiva; formatação da lista de lançamentos em estilo cartão financeiro com divisão sutil e botões de editar e excluir de toque amplo (36px).
    - **Categorias:** Grid adaptável de cards de categorias (1 coluna no smartphone e colunas fluidas em tablets), facilitando a leitura e ações de edição/exclusão.
  - Botões de chamada para ação principal (`+ Nova Categoria`, `+ Novo Lançamento` e `Atualizar Dados`) ocupando 100% de largura no mobile para máximo conforto ergonômico.
* **Tarefa 5.3 (Concluída por Jeferson):**
  - Implementação de acessibilidade de navegação por teclado com indicador visual padronizado `:focus-visible` em todos os botões, links, abas e controles de formulário.
  - Adição de micro-interações táteis de clique (:active com leve redução de escala `scale(0.97)`) em botões, abas e cartões.
  - Barra de rolagem personalizada sutil (`scrollbar-width: thin` e `::-webkit-scrollbar`) integrada aos modais e à aplicação.
  - Bateria de testes exploratórios de ponta a ponta: validação de criação de categorias/movimentações, filtros combinados, recálculo de saldo líquido no Dashboard e comprovação da trava de integridade referencial do Requisito 3.4 (bloqueio 400 ao tentar excluir categoria em uso).

---

## 5. Estado Atual do Sistema

* **Container PostgreSQL:** Ativo no Docker (`meufinanceiro_postgres`), aceitando conexões na porta `5433`.
* **Banco de Dados:** Tabelas `categorias` e `movimentacoes` populadas, íntegras e conectadas.
* **Backend:** 100% pronto e testado em `http://localhost:3000`.
* **Frontend:** 100% pronto, visualmente polido e responsivo para mobile, tablets e desktops (Dashboard com gráficos interativos, Movimentações com filtros e Categorias com validação referencial).
* **Documentação & Roteiro:** `README.md` totalmente estruturado com guia completo de instalação; `docs/roteiro_apresentacao.md` finalizado com ensaio cronometrado de 10 minutos para a banca; `DOCUMENTACAO_IA.md` atualizado com todas as iterações e decisões técnicas.

---

## 6. Etapa 6: Documentação Final, Prints do Trello e Roteiro de Apresentação (CONCLUÍDA - GUILHERME)
**Responsável:** Guilherme Buratto

* **📖 Tarefa 6.2 (Concluída por Guilherme): Revisão e Finalização do README.md e Governança do Repositório**
  - Enriquecimento completo do `README.md` principal da raiz com badges oficiais, stack detalhada com versões exatas, guia de execução passo a passo à prova de falhas para o professor (`docker compose up -d`, `seed`, `dev`), tabela semântica de todos os endpoints REST, schema Prisma e justificativa das decisões críticas de arquitetura.
  - *Commit semântico:* `docs: finalizar documentacao do readme e instrucoes de execucao`

* **🎤 Tarefa 6.3 (Concluída por Guilherme): Elaboração do Roteiro de Apresentação Presencial de 10 Minutos**
  - Criação de `docs/roteiro_apresentacao.md` contendo checklist pré-apresentação, roteiro minuto a minuto cronometrado (Abertura, Demonstração ao Vivo, Metodologia de IA e Arguição), divisão equitativa de falas entre Guilherme e Jeff, roteiro de contingência e guia de respostas técnicas para perguntas da banca avaliadora.
  - *Commit semântico:* `docs: criar roteiro e divisao de fala da apresentacao presencial`

* **📋 Tarefa 6.1 (Pendente de upload das imagens pelo Guilherme): Atualização dos Registros Visuais do Kanban (Trello)**
  - O estudante fará a captura do print atualizado do quadro Trello com os cards em Concluído e salvará em `docs/kanban-prints/`.
