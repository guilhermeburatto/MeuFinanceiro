# Documentação do Uso de Inteligência Artificial

Este documento cumpre a exigência acadêmica do item 2.6 da disciplina de **Laboratório de Programação** (Unifacvest). Aqui estão registradas as interações com o agente de IA, os prompts utilizados, as análises críticas do grupo, eventuais erros encontrados e as decisões de engenharia adotadas.

---

## 1. Concepção, Análise de Requisitos e Planejamento Arquitetural

* **Data:** 03/11/2026
* **Etapa:** Planejamento Inicial

### 1.1. Problema / Requisito Trabalhado
Compreensão e sistematização das diretrizes acadêmicas presentes em `requisitos_trabalho.txt`, diferenciação entre requisitos obrigatórios do professor e propostas de escopo inicial, definição de arquitetura de software e plano de execução iterativo.

### 1.2. Texto Exato do Prompt Utilizado
```text
Estou desenvolvendo um projeto acadêmico de Laboratório de Programação: um sistema web de gerenciamento financeiro pessoal.

Na pasta deste projeto existe um arquivo chamado requisitos_trabalho.txt. Leia o arquivo inteiro com atenção. Ele contém as diretrizes acadêmicas do professor e a proposta inicial de funcionalidades.

Quero que você atue como meu agente de desenvolvimento e também como orientador técnico. Estou retomando a programação depois de um período sem praticar, então preciso entender o que está sendo desenvolvido.

Nesta primeira etapa, não escreva código, não crie arquivos e não instale dependências.

Quero que você:
1. Analise os requisitos acadêmicos e funcionais do projeto.
2. Identifique as tecnologias exigidas pelo professor e as tecnologias sugeridas.
3. Proponha uma arquitetura para o sistema, explicando como frontend, backend e banco de dados irão se comunicar.
4. Sugira uma estrutura de pastas para o projeto.
5. Divida o desenvolvimento em etapas pequenas e organizadas.
6. Aponte possíveis dificuldades técnicas e decisões que precisamos tomar.

Explique suas recomendações em linguagem clara, considerando que sou estudante e quero aprender durante o desenvolvimento.

Importante: diferencie os requisitos obrigatórios do professor das sugestões de implementação. Não acrescente funcionalidades sem antes conversar comigo.

Ao final, apresente seu planejamento e aguarde minha aprovação antes de executar qualquer alteração no projeto.
```

### 1.3. Refinamentos e Iterações Realizados
* **Prompt de Ajustes pelo Grupo:**
```text
Gostei do planejamento e concordo com as decisões propostas.

Vamos manter o sistema sem login inicialmente e utilizar JavaScript moderno.

Tenho apenas dois ajustes:
- Utilizar Node.js 24.x, respeitando o limite de versão estabelecido pelo professor.
- Utilizar o Trello como nosso quadro Kanban, pois já está criado.

Podemos iniciar a Etapa 0. Porém, quero que você execute uma tarefa por vez, explicando brevemente o que está fazendo e aguardando minha confirmação antes de avançar para a próxima.
...
```

### 1.4. Decisões de Engenharia e Justificativas de Aceitação
* **Arquitetura Desacoplada (SPA + API REST + Banco Relacional):** Garante separação de responsabilidades. O backend lida estritamente com lógica e persistência; o frontend cuida da experiência e apresentação visual.
* **Escopo sem Autenticação Inicial:** Evita complexidade com tokens JWT, cookies, hash de senhas e estados de sessão que não foram demandados no trabalho original, focando no núcleo financeiro do sistema.
* **Adoção de JavaScript Moderno (ES Modules):** Dispensa etapa de transpilação pesada no backend, permitindo foco conceitual na modelagem de dados e na API REST.
* **Versão do Node.js fixada em 24.x:** Respeita o teto da versão estipulada pelo professor (22.x a 24.x).
* **Quadro Kanban no Trello:** Acolhido conforme aceitação permitida no enunciado acadêmico.

---

## 2. Etapa 0 - Inicialização da Governança e Estrutura de Pastas

* **Data:** 03/11/2026
* **Etapa:** Etapa 0 - Tarefa 0.1

### 2.1. Problema / Requisito Trabalhado
Inicialização do repositório Git, criação do `.gitignore` para proteção de credenciais e dependências, estruturação das pastas de projeto (`docs/`, `backend/`, `frontend/`) e arquivos de governança obrigatórios.

### 2.2. Ações Executadas
1. Execução do `git init` para controle de versões local.
2. Criação do `.gitignore` bloqueando `node_modules/`, `.env*`, `dist/` e arquivos temporários.
3. Criação de `docs/kanban-prints/.gitkeep` e `docs/arquitetura.md`.
4. Elaboração do `README.md` com instruções iniciais e metadados.
5. Elaboração do `DOCUMENTACAO_IA.md` para registro contínuo.

### 2.3. Erros Encontrados e Correções
* Durante a verificação do ambiente, detectou-se que o comando `node` não estava acessível na variável de ambiente PATH do sistema Windows. O usuário foi orientado a instalar o Node.js 24.x LTS para o ambiente de execução local.

### 2.4. Decisões de Engenharia
* **Uso de `.gitkeep`:** Permite que o Git versione a pasta `docs/kanban-prints/` mesmo estando inicialmente vazia, garantindo que o colega de grupo e o professor tenham a pasta pronta ao clonar o repositório.
* **Semantic Commits:** Adoção estrita de padrões de commit convencionais (`chore:`, `feat:`, `docs:`, `fix:`).


---

## 3. Etapa 0 - Configuração do Banco de Dados com Docker

* **Data:** 03/11/2026
* **Etapa:** Etapa 0 - Tarefa 0.2

### 3.1. Problema / Requisito Trabalhado
Provisionamento obrigatório do banco de dados PostgreSQL (versão 15 ou 16) utilizando Docker e Docker Compose, garantindo persistência dos dados e facilidade de execução local para o grupo e para o professor.

### 3.2. Texto Exato do Prompt Utilizado
```text
sim
```
*(Confirmação para execução da Tarefa 0.2, conforme planejamento previamente acordado).*

### 3.3. Refinamentos e Ações Executadas
1. Criação do arquivo `docker-compose.yml` especificando o serviço `postgres` com a imagem oficial `postgres:16-alpine`.
2. Configuração de credenciais de desenvolvimento local (`POSTGRES_USER=postgres`, `POSTGRES_DB=meufinanceiro`).
3. Mapeamento de volume nomeado (`meufinanceiro_postgres_data`) apontando para `/var/lib/postgresql/data`, garantindo que os dados não se percam após a reinicialização dos containers.
4. Criação do `.env.example` com o modelo da string de conexão `DATABASE_URL` para o Prisma ORM.
5. Inicialização do container com `docker compose up -d` e verificação da prontidão através do utilitário `pg_isready`.

### 3.4. Registro de Erros e Correções
* Nenhum erro na execução do Docker. O container subiu com sucesso e o serviço respondeu aceitando conexões na porta 5432.
* A imagem `03-11.png` enviada pelo integrante para o diretório `docs/kanban-prints/` foi identificada e incluída no controle de versão.

### 3.5. Decisões de Engenharia
* **Imagem Alpine (`postgres:16-alpine`):** Escolha de imagem enxuta (aproximadamente 110 MB descompactada), reduzindo o tempo de download e consumo de memória sem perder nenhuma funcionalidade do PostgreSQL 16.
* **Volume Persistente Nomeado:** O uso de volume Docker isolado desacopla o ciclo de vida dos dados do ciclo de vida do container. O container pode ser destruído e recriado sem perda de registros financeiros.


---

## 4. Etapa 1 - Inicialização do Backend com Express e Nodemon

* **Data:** 03/11/2026
* **Etapa:** Etapa 1 - Tarefa 1.1

### 4.1. Problema / Requisito Trabalhado
Inicialização do ambiente de desenvolvimento do backend Node.js, configuração do servidor HTTP com o framework Express, suporte a requisições com corpo JSON, configuração de CORS para integração futura com o frontend React e configuração do Nodemon para recarregamento em tempo de desenvolvimento.

### 4.2. Texto Exato dos Prompts Utilizados
```text
Sim
```
*(Aprovação da Tarefa 1.1)*

```text
tá, vamos fazer de novo esse passo, acho que deu problema
```
*(Solicitação de revisão e esclarecimento do processo pelo aluno)*

```text
2
```
*(Opção escolhida para verificar o que já estava montado e executar os testes práticos no navegador)*

### 4.3. Refinamentos e Ações Executadas
1. Criação da pasta `backend/` com `package.json` contendo `"type": "module"` para uso de JavaScript moderno (ES Modules).
2. Instalação das dependências `express`, `cors`, `dotenv` e da ferramenta de desenvolvimento `nodemon`.
3. Criação de `backend/src/server.js` configurando middlewares essenciais e a rota `GET /api/status`.
4. Criação de `backend/.env.example` e verificação da exclusão de `backend/.env` e `backend/node_modules/` pelo `.gitignore`.
5. Orientação ao estudante sobre a navegação para a subpasta `backend/` para execução correta do `npm run dev`.
6. Validação prática realizada pelo aluno com retorno do status `200 OK` e corpo JSON no navegador (`http://localhost:3000/api/status`).

### 4.4. Decisões de Engenharia
* **ES Modules (`"type": "module"`):** Permite a sintaxe padrão `import/export`, padronizando a linguagem entre o backend Node.js e o frontend React (Vite).
* **CORS ativado desde o início:** Evita problemas futuros de bloqueio de requisições cross-origin quando o frontend (porta 5173) se comunicar com a API (porta 3000).
* **Endpoint de Health Check (`/api/status`):** Boa prática de arquitetura para diagnosticar a saúde da API sem depender de conexão com banco de dados.

---

## 5. Etapa 1 - Configuração do Prisma ORM e Modelagem do Banco de Dados

* **Data:** 04/11/2026
* **Etapa:** Etapa 1 - Tarefa 1.2

### 5.1. Problema / Requisito Trabalhado
Integração do Prisma ORM ao backend Node.js para comunicação tipada com o banco de dados PostgreSQL (no container Docker). Modelagem relacional das entidades financeiras (`Categoria` e `Movimentacao`), aplicação de migrações gerenciadas pelo Prisma e carga inicial (*seed*) de categorias padrão recomendadas no enunciado acadêmico.

### 5.2. Texto Exato dos Prompts Utilizados
```text
Analise tudo que foi feito no projeto até agora e liste quais serão os próximos passos de acordo com a documentação disponivel do projeto. Acredito que o próximo passo seja a parte do Prisma
```
*(Confirmação e alinhamento do escopo do Prisma pelo estudante)*

```text
Ok, o docker está aberto.
```
*(Confirmação de que o ambiente Docker local foi iniciado para execução das migrações)*

### 5.3. Refinamentos e Ações Executadas
1. **Fixação da Versão Estável do Prisma:** Durante a instalação inicial via npm, a tag `latest` apontava para o release candidate experimental `prisma@8.0.0-rc.30`. Foi realizada a análise crítica e downgrade direcionado para a versão LTS estável `prisma@6.19.3` e `@prisma/client@6.19.3`, garantindo total compatibilidade com os padrões consolidados do Prisma ORM.
2. **Criação do `.env`:** Criação de `backend/.env` com a string de conexão oficial: `postgresql://postgres:postgrespassword@localhost:5432/meufinanceiro?schema=public`.
3. **Modelagem no `schema.prisma`:**
   - Enum `TipoMovimentacao`: `RECEITA` e `DESPESA`.
   - Model `Categoria`: `id`, `nome`, `tipo`, `cor` (código hexadecimal para os gráficos) e `criadoEm`.
   - Model `Movimentacao`: `id`, `descricao`, `valor` com tipo monetário `Decimal(10,2)`, `data`, `tipo` e chave estrangeira `categoriaId`.
   - Regra de Integridade: `onDelete: Restrict` na relação de categorias para impedir a exclusão acidental de categorias com movimentações vinculadas.
4. **Execução das Migrações:** Execução de `npx prisma migrate dev --name init_schema`, gerando o arquivo `backend/prisma/migrations/20261104140703_init_schema/migration.sql` e gerando as tabelas fisicamente no banco PostgreSQL.
5. **Script de Seed (`backend/prisma/seed.js`):** Criação de rotina automatizada e idempotente populando 12 categorias base (8 de despesas como Alimentação, Moradia, Transporte e 4 de receitas como Salário e Rendimentos), com execução testada e validada via `npx prisma db seed`.
6. **Módulo Singleton:** Criação de `backend/src/lib/prisma.js` exportando a instância única do `PrismaClient` para evitar esgotamento de conexões de pool durante o recarregamento do Nodemon.

### 5.4. Registro de Erros e Correções
* **Erro de Política de Execução no PowerShell:** O comando `npm` e `npx` foi inicialmente bloqueado pela política de scripts do Windows (`ExecutionPolicy`). Solução adotada: invocação transparente via `npm.cmd` e `npx.cmd`.
* **Detecção de Schema Drift pré-existente:** O container Docker possuía resquícios de migrações anteriores sem histórico local. Foi executado `prisma migrate reset --force` para limpar o schema público e reaplicar a migração `init_schema` de forma limpa e rastreável.

### 5.5. Decisões de Engenharia
* **Precisão Decimal para Valores Financeiros:** O uso de `Decimal(10, 2)` evita erros clássicos de ponto flutuante binário do JavaScript (ex: `0.1 + 0.2 = 0.30000000000000004`), assegurando exatidão contábil nas transações.
* **Integridade Referencial com `onDelete: Restrict`:** Cumpre o requisito acadêmico 3.4 (*"respeitando os vínculos com movimentações existentes"*), impedindo a quebra de histórico financeiro no banco de dados caso uma categoria em uso tente ser excluída.
* **Atributo `cor` nas Categorias:** O armazenamento de códigos de cores hexadecimais (ex: `#E53E3E`) na entidade de categoria viabiliza diretamente a renderização de gráficos padronizados no frontend (Dashboard).



---

## 6. Etapa 1 - Resolução de Conflitos, Port Collision e Alinhamento do Prisma

* **Data:** 05/11/2026
* **Etapa:** Etapa 1 - Finalização e Alinhamento

### 6.1. Problema / Requisito Trabalhado
Integração do código submetido pelo colega de trabalho (Jeff), resolução de divergência de histórico no Git (`refusing to merge unrelated histories`), diagnóstico de falha de autenticação no PostgreSQL decorrente de concorrência de porta local e eliminação de artefatos experimentais no Prisma.

### 6.2. Texto Exato dos Prompts Utilizados
```text
Oi... Meu colega de trabalho fez alterações nesse projeto e disse que alguma coisa não deu certo... Baixe o que ele fez pelo github e analise, por favor
```

```text
vamos lá, docker rodando, pode continuar
```

### 6.3. Refinamentos e Ações Executadas
1. **Alinhamento do Histórico do Git:** Sincronização da branch local `main` com `origin/main`, absorvendo os commits e a evolução de modelagem realizada pela dupla.
2. **Diagnóstico de Concorrência de Porta (Port Collision):** Detectou-se que a máquina local possuía um serviço nativo do Windows (`postgresql-x64-16`) em execução na porta `5432`. Ao tentar conectar, as requisições eram interceptadas pelo serviço do Windows em vez do container Docker, resultando em falha de autenticação (`P1000`).
3. **Mapeamento de Porta Isolada (5433:5432):** Ajustou-se o `docker-compose.yml` para expor o container na porta `5433` (`5433:5432`) e atualizou-se a `DATABASE_URL` no `.env` e `.env.example`, garantindo isolamento total do container Docker sem interferir em instalações nativas do sistema operacional.
4. **Remoção de Arquivo Experimental (`prisma.config.ts`):** O arquivo de configuração em TypeScript foi excluído para evitar que o Prisma 6 LTS ignorasse o carregamento padrão de variáveis de ambiente.
5. **Geração do Prisma Client e Carga do Banco:** Executou-se `npx prisma generate`, aplicou-se a migração `20261104140703_init_schema` no container Docker e executou-se com sucesso o script `npm run seed`, populando as 12 categorias base no PostgreSQL.

### 6.4. Decisões de Engenharia
* **Exposição na Porta 5433:** Evita conflitos de rede quando desenvolvedores possuem bancos locais instalados em suas máquinas físicas para outras finalidades, mantendo o container Docker autocontido e funcional.
* **Padronização no Prisma 6 LTS sem `prisma.config.ts`:** Reduz a complexidade e alertas desnecessários de compilação em um ambiente puramente baseado em ES Modules JavaScript.


---

## 7. Etapa 2 - Implementação da API REST de Categorias

* **Data:** 05/11/2026
* **Etapa:** Etapa 2 - Tarefa 2.1

### 7.1. Problema / Requisito Trabalhado
Criação dos endpoints HTTP da API REST para gerenciamento de categorias financeiras (`GET`, `POST`, `PUT`, `DELETE`), permitindo a listagem, filtragem por tipo (receita/despesa), cadastro com validações de dados e proteção de integridade referencial na exclusão.

### 7.2. Texto Exato dos Prompts Utilizados
```text
Certo, você verificou se realmente foi nesse etapa que paramos? Ou essa etapa já é a que podemos fazer pois o Jeff já fez as outras? Caso positivo, podemos avançar com a etapa sugerida
```

### 7.3. Refinamentos e Ações Executadas
1. **Verificação do Estado:** Inspeção minuciosa do diretório `backend/src/` confirmando que não existiam rotas ou controladores prévios implementados, ratificando a Tarefa 2.1 como a próxima tarefa do roadmap.
2. **Criação do Controlador (`backend/src/controllers/categoriaController.js`):**
   - Método `listar`: recupera todas as categorias ordenadas alfabeticamente, com filtro opcional por query param (`?tipo=RECEITA` ou `?tipo=DESPESA`).
   - Método `buscarPorId`: busca detalhada por identificador numérico, com tratamento para IDs inválidos (400) e não encontrados (404).
   - Método `criar`: validação obrigatória de nome e tipo, validação de formato de cor hexadecimal `#RRGGBB` e retorno de status 201 Created.
   - Método `atualizar`: atualização parcial ou total de categoria com validação de dados.
   - Método `excluir`: consulta prévia ao banco via Prisma para verificar se existem movimentações vinculadas à categoria antes de permitir a exclusão, retornando status 400 com mensagem informativa caso existam dependências.
3. **Criação do Roteador (`backend/src/routes/categoriaRoutes.js`):** Mapeamento padronizado dos verbos HTTP para os métodos do controlador.
4. **Integração no Servidor (`backend/src/server.js`):** Registro do roteador sob o prefixo `/api/categorias`.
5. **Bateria de Testes:** Execução automatizada de 5 testes HTTP cobrindo listagem, filtragem, criação, edição e exclusão, validando o funcionamento de ponta a ponta.

### 7.4. Decisões de Engenharia
* **Regra de Negócio de Integridade Referencial:** A checagem explícita `prisma.movimentacao.count` antes do `delete` oferece uma resposta clara ao usuário final/frontend, evitando que o banco de dados dispare uma exceção genérica de chave estrangeira não tratada.
* **Validação de Cores Hexadecimais:** A validação com Regex `^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$` garante que as cores cadastradas sejam compatíveis com a estilização e gráficos do frontend React.


---

## 8. Etapa 2 - Implementação da API REST de Movimentações (Receitas e Despesas)

* **Data:** 05/11/2026
* **Etapa:** Etapa 2 - Tarefa 2.2

### 8.1. Problema / Requisito Trabalhado
Criação dos endpoints HTTP da API REST para registro e gerenciamento de movimentações financeiras (receitas e despesas), incluindo validação de regras de negócio essenciais, filtros por período e categoria, e verificação cruzada de integridade referencial.

### 8.2. Texto Exato dos Prompts Utilizados
```text
sim!!
```
*(Autorização para desenvolvimento da Tarefa 2.2)*

### 8.3. Refinamentos e Ações Executadas
1. **Criação do Controlador (`backend/src/controllers/movimentacaoController.js`):**
   - Método `listar`: suporta filtragem combinada por `tipo`, `categoriaId`, `dataInicio` e `dataFim`, trazendo os dados da categoria associada (`include: { categoria: true }`) e ordenados por data decrescente.
   - Método `buscarPorId`: busca de uma movimentação por ID com detalhes da categoria.
   - Método `criar`: validações de campos obrigatórios (descrição não vazia, valor estritamente maior que zero, data válida no calendário).
   - Validação de Coerência de Tipo: verificação se a categoria selecionada possui o mesmo tipo da movimentação (impedindo que uma despesa seja cadastrada em uma categoria de receita como Salário).
   - Método `atualizar`: atualização com revalidação de regras de negócio e integridade caso categoria ou tipo sejam modificados.
   - Método `excluir`: remoção de movimentação por ID.
2. **Criação do Roteador (`backend/src/routes/movimentacaoRoutes.js`):** Mapeamento dos verbos REST (`GET`, `POST`, `PUT`, `DELETE`).
3. **Integração no Servidor (`backend/src/server.js`):** Registro das rotas sob o prefixo `/api/movimentacoes`.
4. **Bateria de Testes:** 8 testes executados validando criação de receitas, criação de despesas, bloqueio de incoerência de tipo (status 400), filtros por tipo e data, e comprovação do bloqueio de integridade na tentativa de exclusão de categoria com movimentação vinculada.

### 8.4. Decisões de Engenharia
* **Regra de Coerência entre Categoria e Movimentação:** Evita inconsistências lógicas no banco de dados. Uma categoria com `tipo: RECEITA` só pode receber lançamentos de receitas, garantindo que os relatórios e filtros funcionem com exatidão matemática.
* **Validação de Valor Positivo:** Valores monetários devem ser informados como números positivos no cadastro. A diferenciação matemática entre ganho e gasto é estabelecida pela coluna `tipo`, evitando ambiguidades de sinal (`+` ou `-`) no armazenamento.


---

## 9. Etapa 2 - Implementação dos Endpoints de Resumo Financeiro (Dashboard)

* **Data:** 05/11/2026
* **Etapa:** Etapa 2 - Tarefa 2.3

### 9.1. Problema / Requisito Trabalhado
Criação do endpoint analítico consolidado para alimentar o painel inicial (Dashboard) do sistema, fornecendo cálculo automatizado de total de receitas, total de despesas, saldo líquido, agrupamento percentual e financeiro de despesas e receitas por categoria, e resumo das movimentações recentes, com suporte a filtro flexível por período de datas.

### 9.2. Texto Exato dos Prompts Utilizados
```text
sim, por favor.
```

```text
podemos iniciar
```
*(Confirmação e autorização para execução da Tarefa 2.3)*

### 9.3. Refinamentos e Ações Executadas
1. **Criação do Controlador (`backend/src/controllers/dashboardController.js`):**
   - Implementação do método `obterResumo` com suporte a query params `dataInicio` e `dataFim`.
   - Consulta ao banco via Prisma trazendo as movimentações do período e suas respectivas categorias.
   - Consolidação de totais com arredondamento preciso em 2 casas decimais.
   - Agrupamento de despesas por categoria calculando a soma e a proporção percentual de cada categoria em relação ao total gasto, já ordenada da maior despesa para a menor.
   - Extração das 5 movimentações mais recentes para pré-visualização rápida.
2. **Criação do Roteador (`backend/src/routes/dashboardRoutes.js`):** Mapeamento de `GET /resumo`.
3. **Integração no Servidor (`backend/src/server.js`):** Registro sob o prefixo `/api/dashboard`.
4. **Bateria de Testes:** Testes automatizados executados via PowerShell validando os cálculos de saldo (R$ 5500 - R$ 720 = R$ 4780), a distribuição percentual por categoria com cores preservadas e a filtragem por intervalo de datas.

### 9.4. Decisões de Engenharia
* **Cálculo Agregado no Backend:** Centralizar a lógica de soma e percentuais na API alivia a carga de processamento do navegador do usuário e garante uma única fonte da verdade contábil para qualquer cliente que venha a consumir a API.
* **Preservação de Códigos de Cores no Resumo:** O payload do dashboard entrega diretamente a cor hexadecimal de cada categoria agrupada, permitindo que bibliotecas de gráficos (como Recharts) renderizem as fatias do gráfico sem necessidade de mapeamentos adicionais no frontend.

---

## 10. Etapa 3 - Inicialização do Frontend Base com React e Vite

* **Data:** 05/11/2026
* **Etapa:** Etapa 3 - Tarefa 3.1 (Executada por Jeferson / Jeff)

### 10.1. Problema / Requisito Trabalhado
Criação e estruturação inicial do projeto frontend utilizando React e Vite na pasta `frontend/`, atendendo aos requisitos acadêmicos da stack tecnológica (React como biblioteca moderna para construção de interface SPA). Instalação das dependências essenciais de desenvolvimento e de interface visual (`lucide-react`) para suporte aos ícones das categorias financeiras e navegação.

### 10.2. Texto Exato dos Prompts Utilizados
```text
Certo, então primeiro iremos executar a nossa alteração no nosso .env. 

Também apartir de agora iremos realizar nossas tarefas mais em "partes", começaremos a subir nossas partes (concretas) para o git para podermos definir melhor oq fizemos em nossos commit, sem aglutinar tudo em um só commit. 

Quando terminar a alteração do .env me informe para iniciarmos a criação do front.
```

```text
Perfeito, iniciamos então. Obs: Não se esqueça de documentar nas devidas documentações do projeto e informar oq fizemos.
```
*(Autorização para início da Tarefa 3.1 com diretriz de trabalho particionado e documentação rigorosa)*

### 10.3. Refinamentos e Ações Executadas
1. **Scaffolding da Aplicação:** Execução do comando `npm.cmd create vite@latest frontend -- --template react`, gerando a estrutura moderna base com suporte a JSX e Fast Refresh.
2. **Instalação de Dependências:** Instalação das dependências de runtime (`react`, `react-dom`) e dev tools (`vite`, `@vitejs/plugin-react`).
3. **Adição de Biblioteca de Ícones:** Instalação do pacote `lucide-react` para uso em botões, métricas e identificadores de categorias (receitas/despesas).
4. **Verificação de Compilação:** Execução de `npm.cmd run build` para validação de integridade dos módulos gerados, confirmando 0 erros e 0 vulnerabilidades.

### 10.4. Decisões de Engenharia
* **Adoção do Vite:** Escolha do Vite em detrimento do legado Create React App (CRA). O Vite utiliza ES Modules nativos no navegador durante o desenvolvimento, oferecendo inicialização instantânea e compilação otimizada para produção via Rollup.
* **Granularidade de Commits:** Divisão da Etapa 3 em entregas atômicas e rastreáveis (`feat: inicializar frontend com react e vite`, `feat: configurar integracao http com backend`, etc.), garantindo histórico limpo e auditável para a avaliação acadêmica.

---

## 11. Etapa 3 - Configuração da Camada de Integração HTTP com o Backend

* **Data:** 05/11/2026
* **Etapa:** Etapa 3 - Tarefa 3.2 (Executada por Jeferson / Jeff)

### 11.1. Problema / Requisito Trabalhado
Criação do cliente HTTP modular no frontend para comunicação assíncrona com os endpoints da API REST Express rodando na porta 3000. Encapsulamento de requisições, tratamento centralizado de mensagens de erro HTTP (ex: código 400 em exclusão de categoria com movimentações vinculadas) e padronização dos métodos de consumo para Dashboard, Categorias e Movimentações.

### 11.2. Texto Exato dos Prompts Utilizados
```text
Ok, vamos prosseguir para a Parte 3.2.
```
*(Autorização do estudante para implementação da camada de serviços HTTP)*

### 11.3. Refinamentos e Ações Executadas
1. **Configuração de Variáveis de Ambiente no Vite:** Criação de `frontend/.env.example` e `frontend/.env` definindo `VITE_API_URL=http://localhost:3000/api`.
2. **Criação do Módulo `frontend/src/services/api.js`:**
   - Implementação da função `request(endpoint, options)` encapsulando a `fetch` API com suporte a cabeçalhos padrão JSON e extração automática de mensagens de erro da API.
   - Mapeamento de `obterStatus()` para `GET /status`.
   - Mapeamento de `dashboardService.obterResumo(params)` para `GET /dashboard/resumo`.
   - Mapeamento de `categoriaService` com operações completas de listagem, busca por ID, criação, atualização e remoção.
   - Mapeamento de `movimentacaoService` com suporte a query params para filtros combinados de período (`dataInicio`/`dataFim`), tipo e categoria.
3. **Verificação de Compilação:** Execução de `npm.cmd run build` confirmando que a compilação do Vite processa o serviço sem pendências ou incompatibilidades sintáticas.

### 11.4. Decisões de Engenharia
* **Uso da Fetch API Nativa Encapsulada:** Evita a necessidade de instalar bibliotecas pesadas de terceiros (como Axios) para operações HTTP básicas, reduzindo o tamanho final do bundle JavaScript do frontend e aproveitando os recursos nativos dos navegadores modernos.
* **Fallback Seguro da URL:** A URL base utiliza `import.meta.env.VITE_API_URL || 'http://localhost:3000/api'`, permitindo tanto a execução imediata sem configuração manual quanto a flexibilidade de apontar para outro endereço caso a API seja hospedada externamente.
* **Tratamento Específico de Erros de Rede:** Caso o backend esteja temporariamente desligado, o serviço lança uma mensagem explicativa orientando o usuário/estudante a iniciar a API na porta 3000 em vez de exibir um erro opaco de *Failed to fetch*.

---

## 12. Etapa 3 - Estruturação do Layout Base e Navegação do Frontend

* **Data:** 05/11/2026
* **Etapa:** Etapa 3 - Tarefa 3.3 (Executada por Jeferson / Jeff)

### 12.1. Problema / Requisito Trabalhado
Construção da interface visual principal do sistema MeuFinanceiro, fornecendo cabeçalho com indicador em tempo real da saúde da API (`/api/status`), barra de navegação responsiva em abas (`Dashboard`, `Movimentações`, `Categorias`), painel analítico com métricas monetárias em Real (BRL), barras de progresso proporcionais para despesas por categoria e listagem sincronizada de movimentações recentes.

### 12.2. Texto Exato dos Prompts Utilizados
```text
Certo Iniciamos a Parte 3.3
```
*(Confirmação e autorização do estudante para desenvolvimento da interface base e navegação)*

### 12.3. Refinamentos e Ações Executadas
1. **Padronização Visual e Design System em `frontend/src/index.css`:**
   - Criação de variáveis CSS para paleta financeira (verde esmeralda para receitas/saldo, vermelho carmesim para despesas, slate moderno para textos e cartões brancos com sombras suaves).
   - Estilização completa para botões, badges de status, cards de métricas, barras de progresso e listas de transações.
2. **Construção do Layout em `frontend/src/App.jsx`:**
   - **Header:** Identificação visual da marca e badge reativo indicando o estado do backend (`Online`, `Desconectado`, `Verificando`).
   - **Navegação:** Sistema de abas com ícones vetoriais da biblioteca `lucide-react` (`LayoutDashboard`, `ArrowLeftRight`, `Tags`).
   - **Dashboard:**
     - Botão de atualização sob demanda chamando `carregarDados()`.
     - Cards de métricas com valores formatados via `Intl.NumberFormat('pt-BR')`.
     - Painel de despesas por categoria com cálculo percentual e indicação cromática com a cor configurada no banco.
     - Painel das 5 movimentações mais recentes com identificação clara de entradas (+) e saídas (-).
   - **Abas de Movimentações e Categorias:** Listagem dinâmica dos registros vindos da API, preparando a interface para os formulários de inserção da Etapa 4.
3. **Validação e Compilação:** Execução de `npm.cmd run build` sem erros (2056 módulos transformados com sucesso em 429ms).

### 12.4. Decisões de Engenharia
* **Indicador Visual de Conexão com o Backend:** Previne que o usuário final ou o professor em dia de apresentação presencial fique confuso caso esqueça de iniciar o container Docker ou o servidor Express, fornecendo feedback amigável imediato.
* **Formatação Monetária Nativa (`Intl.NumberFormat`):** Garante a formatação monetária correta e culturalmente adequada ao padrão brasileiro (`R$ 1.250,00`) sem depender de dependências externas.
* **Componente SPA Reativo com Abas de Estado:** A navegação por abas gerenciada por estado do React (`useState`) dispensa roteadores complexos na fase inicial, mantendo o carregamento ultrarrápido e sem recarregamento de página.

---

## 13. Planejamento da Etapa 4 e Transição de Responsabilidade Técnica

* **Data:** 05/11/2026
* **Etapa:** Planejamento da Etapa 4 (Designada para Guilherme Buratto)

### 13.1. Problema / Requisito Trabalhado
Definição formal das responsabilidades técnicas e requisitos funcionais a serem desenvolvidos pelo integrante da equipe Guilherme Buratto para a **Etapa 4: Telas de Gerenciamento Interativas, Formulários e Gráficos**, assegurando continuidade pedagógica, padrão de versionamento (Semantic Commits) e cumprimento das exigências acadêmicas do trabalho (requisitos 3.1 a 3.5).

### 13.2. Texto Exato dos Prompts Utilizados
```text
Certo, defina oq deverá ser feito pelo Guilherme na Tarefa 4 na documentação.
```
*(Solicitação do estudante para detalhamento formal das tarefas do colega na documentação)*

### 13.3. Refinamentos e Ações Executadas
1. **Especificação da Tarefa 4.1 (Gerenciamento de Categorias no Frontend):**
   - Criação de modais de inserção e edição com validação de campos obrigatórios (`nome`, `tipo`, `cor`).
   - Implementação de captura do erro HTTP 400 da API na exclusão, exibindo alerta visual para o usuário quando a categoria não puder ser apagada por possuir lançamentos vinculados (`onDelete: Restrict`).
2. **Especificação da Tarefa 4.2 (Gerenciamento de Movimentações no Frontend):**
   - Criação de modal de cadastro de receitas e despesas com sincronização de tipo e filtro dinâmico de categorias pertinentes.
   - Construção de tabela completa de histórico com filtros combinados de período (`dataInicio`, `dataFim`), tipo e categoria, além de ações de edição e exclusão.
3. **Especificação da Tarefa 4.3 (Gráficos no Dashboard):**
   - Instalação da biblioteca `recharts` para exibição de gráfico de rosca/pizza (Donut Chart) na aba Dashboard com tooltips em Real e percentuais.
4. **Instruções de Inicialização para o Guilherme:**
   - Comandos explícitos de sincronização (`git pull origin main`) e execução simultânea dos dois ambientes (`backend` na porta 3000 e `frontend` na porta 5173).

### 13.4. Decisões de Engenharia
* **Padronização da Integração através de `api.js`:** Toda a comunicação do frontend na Etapa 4 deverá consumir exclusivamente as funções pré-configuradas em `frontend/src/services/api.js` (`categoriaService`, `movimentacaoService`, `dashboardService`), garantindo desacoplamento entre componentes visuais e chamadas de rede.
* **Transparência no Controle de Versão da Dupla:** Documentar a divisão de trabalho permite ao professor validar a colaboração efetiva de ambos os membros do grupo na disciplina de Laboratório de Programação.






---

## 10. Etapa 4 - Gerenciamento Interativo de Categorias no Frontend

* **Data:** 05/11/2026
* **Etapa:** Etapa 4 - Tarefa 4.1

### 10.1. Problema / Requisito Trabalhado
Transformação da aba de Categorias do frontend em uma interface interativa completa de gerenciamento (CRUD), permitindo a inclusão, edição, filtragem por tipo e exclusão com tratamento amigável da regra de integridade referencial estabelecida no requisito 3.4.

### 10.2. Texto Exato dos Prompts Utilizados
```text
perfeito! vamos para a etapa 4.1
```
*(Confirmação e autorização para execução da Tarefa 4.1 pelo estudante)*

### 10.3. Refinamentos e Ações Executadas
1. **Componente de Modal de Categorias:**
   - Criação de modal responsivo em `frontend/src/App.jsx` suportando tanto a criação de novas categorias quanto a edição de categorias existentes.
   - Campos de formulário: `nome` com validação de preenchimento, `tipo` (`DESPESA` ou `RECEITA`) e seletor visual de cores com paleta rápida de 12 opções e input de cor nativo.
2. **Barra de Ações e Filtros:**
   - Adição de botões para filtrar a grade de categorias por tipo (`Todas`, `Despesas`, `Receitas`), com contadores automáticos para cada filtro.
   - Botão de destaque `+ Nova Categoria`.
3. **Ações por Card de Categoria:**
   - Inclusão de botões de ação (editar e excluir) em cada cartão de categoria.
4. **Tratamento de Exclusão com Feedback de Integridade (Requisito 3.4):**
   - Diálogo nativo de confirmação de exclusão.
   - Captura de erro HTTP 400 da API quando o usuário tenta excluir uma categoria que possui movimentações vinculadas (ex: categoria Alimentação), renderizando um banner de alerta visual na interface com a mensagem explicativa da regra de negócio.
5. **Estilização e Animações:**
   - Adição de estilos em `frontend/src/index.css` para backdrop de modal, containers com animações suaves de entrada (`fadeIn`, `slideUp`), botões de ação e alertas de notificação.
6. **Validação Técnica de Build:**
   - Compilação do frontend testada e aprovada com sucesso via `npm run build` (tempo de 501ms).

### 10.4. Decisões de Engenharia
* **Interface Modal Reutilizável:** O mesmo formulário modal atende aos fluxos de criação e edição, alternando título, texto de submissão e pré-preenchimento com base no estado `categoriaEmEdicao`, reduzindo duplicação de código.
* **Feedback de Erro Não-Bloqueante:** O tratamento de erros de integridade através de banners amigáveis com ícone de alerta e botão de fechar evita o uso de `alert()` invasivos do navegador, proporcionando uma experiência de usuário profissional e moderna.


---

## 11. Etapa 4 - Gerenciamento Interativo de Movimentações no Frontend

* **Data:** 05/11/2026
* **Etapa:** Etapa 4 - Tarefa 4.2

### 11.1. Problema / Requisito Trabalhado
Construção da interface de gerenciamento interativo de receitas e despesas na aba de Movimentações, incluindo formulário modal de cadastro e edição com controle de coerência entre tipo de lançamento e categoria, filtros avançados múltiplos (tipo, categoria e intervalo de datas) e ações por linha com recálculo automático de saldos e métricas.

### 11.2. Texto Exato dos Prompts Utilizados
```text
Sim
```
*(Autorização para execução da Tarefa 4.2)*

### 11.3. Refinamentos e Ações Executadas
1. **Modal de Novo Lançamento e Edição:**
   - Botões seletores de tipo (`Despesa` e `Receita`) com destaque visual e cores indicativas.
   - **Regra de Coerência Dinâmica:** Ao alternar entre Despesa e Receita, o menu suspenso de categorias filtra e exibe estritamente as categorias que pertencem ao tipo selecionado, prevenindo erros de classificação pelo usuário.
   - Campos de formulário com validações: descrição obrigatória, valor monetário positivo (> 0), data com preenchimento padrão na data atual e categoria obrigatória.
2. **Barra de Filtros Avançados:**
   - Filtro rápido por tipo (`Todas`, `Despesas`, `Receitas`).
   - Dropdown para filtrar por uma categoria específica.
   - Inputs de data `De` / `Até` para filtragem de período.
   - Botão dinâmico `Limpar Filtros` exibido apenas quando filtros estão ativos.
   - Barra de resumo instantâneo exibindo a quantidade de itens filtrados e a soma consolidada de receitas e despesas que atendem aos filtros.
3. **Ações por Linha e Atualização Reativa:**
   - Botão de edição em cada lançamento pré-carregando os dados no formulário modal.
   - Botão de exclusão com diálogo nativo de confirmação.
   - Ao criar, editar ou excluir, a interface aciona `carregarDados()`, atualizando simultaneamente a lista de lançamentos e os cards do Dashboard.
4. **Validação Técnica de Build:**
   - Build do frontend validado com sucesso sem erros (`npm run build` em 474ms).

### 11.4. Decisões de Engenharia
* **Filtragem no Cliente com Suporte a Filtro de API:** Como a lista completa de movimentações é mantida em memória no estado React, a filtragem instantânea no cliente proporciona uma resposta visual imediata sem latência de rede.
* **Coerência de Tipos Guiada pela Interface:** A filtragem em tempo real das opções de categoria no `<select>` impede na origem que o usuário cometa o erro de vincular um gasto a uma categoria de receita, complementando a trava de segurança já existente na API REST.


---

## 14. Etapa 4 - Visualização Gráfica no Dashboard com Recharts (Frontend)

* **Data:** 05/11/2026
* **Etapa:** Etapa 4 - Tarefa 4.3 (Executada por Guilherme)

### 14.1. Problema / Requisito Trabalhado
Enriquecimento visual e analítico do painel principal (Dashboard) através da implementação de gráfico de rosca interativo (Donut Chart) para representação da distribuição de despesas por categoria, permitindo ao usuário compreender rapidamente a composição de seus gastos com porcentagens, valores em moeda local e cores personalizadas.

### 14.2. Texto Exato dos Prompts Utilizados
```text
sim!!!
```
*(Autorização do estudante para implementação da visualização gráfica na Tarefa 4.3)*

### 14.3. Refinamentos e Ações Executadas
1. **Integração da Biblioteca Recharts:** Instalação do pacote `recharts` no ambiente do frontend (`frontend/package.json`).
2. **Construção do Gráfico de Rosca Interativo:**
   - Utilização dos componentes `ResponsiveContainer`, `PieChart`, `Pie`, `Cell` e `Tooltip`.
   - Aplicação de raio interno (`innerRadius={55}`) e raio externo (`outerRadius={85}`) com espaçamento suave entre as fatias (`paddingAngle={4}`).
   - Mapeamento dinâmico da paleta de cores configurada no banco de dados para cada categoria (`entry.cor`), garantindo coerência visual imediata entre a aba de categorias e o gráfico.
3. **Tooltip Interativo Enriquecido:**
   - Tooltip customizado com efeito hover sobre cada fatia, apresentando o nome da categoria, o montante financeiro formatado em Reais (`R$ 0,00`) e a participação percentual exata no total.
4. **Alternador Dinâmico entre Despesas e Receitas:**
   - Inclusão de botões seletores tipo toggle no cabeçalho do painel (`Despesas` e `Receitas`), permitindo alternar a perspectiva gráfica instantaneamente utilizando os agrupamentos analíticos calculados pelo backend (`despesasPorCategoria` e `receitasPorCategoria`).
5. **Combinação Gráfico + Lista Analítica:**
   - Preservação da lista detalhada com barras de progresso abaixo do gráfico, garantindo excelente legibilidade tanto para leitura rápida visual quanto para conferência analítica item a item.
6. **Tratamento de Estado Vazio:**
   - Exibição de mensagem informativa e amigável quando nenhum lançamento do tipo selecionado existir no período consultado.
7. **Validação Técnica de Build:**
   - Execução bem-sucedida do comando `npm run build` do Vite, transformando 2429 módulos em 647ms sem qualquer erro ou inconsistência.

### 14.4. Decisões de Engenharia
* **Adoção do Recharts (SVG Declarativo):** Proporciona integração idiomática com o modelo declarativo do React, renderizando elementos SVG puros com suporte a responsividade contínua e acessibilidade, evitando custos de renderização imperativa em canvas.
* **Layout Donut em Substituição à Pizza Tradicional:** O gráfico de rosca (Donut Chart) oferece uma estética mais limpa e moderna para dashboards corporativos e financeiros, além de manter proporções fáceis de assimilar sem sobrecarregar visualmente a tela.
* **Aproveitamento Integral do Resumo da API:** Tanto `despesasPorCategoria` quanto `receitasPorCategoria` já eram entregues consolidados pelo endpoint `/api/dashboard/resumo`. A adição do alternador visual no frontend aproveitou essa estrutura sem exigir qualquer chamada de rede adicional.


---

## 15. Planejamento da Etapa 5 e Transição de Responsabilidade Técnica

* **Data:** 05/11/2026
* **Etapa:** Planejamento da Etapa 5 (Designada para Jeferson / Jeff)

### 15.1. Problema / Requisito Trabalhado
Formalização da divisão de responsabilidades técnicas do projeto, designando a **Etapa 5: Polimento Visual, Responsividade Mobile e Testes de Usabilidade** para o integrante Jeferson (Jeff). O objetivo é garantir que o sistema apresente layout fluido e sem quebras em dispositivos móveis e tablets, com transições refinadas e testes funcionais de ponta a ponta, preparando o terreno para o fechamento do projeto por Guilherme na Etapa 6.

### 15.2. Texto Exato dos Prompts Utilizados
```text
A etapa 5 vai ser o jeff, assim que ele finalizar, eu continuo
```
*(Direcionamento do estudante definindo a alternância da dupla e o fluxo de continuidade)*

### 15.3. Refinamentos e Ações Executadas
1. **Atualização do `PLANO_DE_DESENVOLVIMENTO.md`:**
   - Registro de conclusão formal da Etapa 4 por Guilherme Buratto.
   - Detalhamento do roteiro de execução da Etapa 5 por Jeferson (Jeff): comandos de atualização via `git pull origin main`, escopo de responsividade CSS, testes exploratórios e convenção de commit semântico (`feat: aprimorar responsividade e navegabilidade da interface`).
   - Mapeamento da Etapa 6 (Documentação Final, Prints do Trello e Roteiro de Ensaio de 10 minutos) que será conduzida por Guilherme após a entrega do Jeff.
2. **Registro de Governança Acadêmica:**
   - Documentação da alternância de papéis no desenvolvimento contínuo em par (Pair Programming assíncrono).

### 15.4. Decisões de Engenharia
* **Colaboração Equilibrada e Histórico do Git:** A alternância das etapas entre Guilherme e Jeff mantém o histórico de commits do GitHub balanceado, atendendo integralmente ao critério de avaliação acadêmica de trabalho em dupla com contribuições ativas e rastreáveis de ambos os alunos.

---

## 16. Etapa 5 - Responsividade Base do Layout, Header, Navegação e Modais

* **Data:** 06/11/2026
* **Etapa:** Etapa 5 - Tarefa 5.1 (Executada por Jeferson / Jeff)

### 16.1. Problema / Requisito Trabalhado
Estruturação da fundação responsiva da interface web em `frontend/src/index.css`. O layout anterior não possuía regras para telas móveis (< 768px e < 640px), o que gerava compressão inadequada no cabeçalho (logo e status da API), quebra nas abas de navegação, e risco crítico de corte nos formulários modais de cadastro quando abertos em smartphones ou com teclados virtuais ativos.

### 16.2. Texto Exato dos Prompts Utilizados
```text
Certo, antes de iniciaremos a Etapa 5, não se esqueça de separar essa etapa em partes concretas para realizarmos os commit's especificiados corretamente. Também descreva oq iremos realizar nessa fase e possiveis sugestôes.
```

```text
Ok, prosseguimos.
```
*(Planejamento da divisão em 3 partes e autorização de início da Tarefa 5.1)*

### 16.3. Refinamentos e Ações Executadas
1. **Estrutura Protetora dos Modais:**
   - Adição de `max-height: 90vh` no `.modal-container` com layout em flexbox vertical (`display: flex; flex-direction: column`).
   - Configuração de `overflow-y: auto` e rolagem nativa suave (`-webkit-overflow-scrolling: touch`) no `.modal-body`.
   - Fixação dos cabeçalhos e rodapés dos modais com `flex-shrink: 0`, garantindo que os botões "Salvar" e "Cancelar" estejam sempre visíveis e utilizáveis.
2. **Breakpoints Mobile (768px e 640px):**
   - **Header:** Redução proporcional de padding e tipografia, reorganizando logo, subtítulo e status badge para não gerarem quebra desordenada.
   - **Navegação por Abas:** Distribuição proporcional das 3 abas principais (`flex: 1`) com ícones e textos ajustados para toque.
   - **Rodapé dos Modais:** No mobile, os botões passam a se organizar verticalmente (`flex-direction: column-reverse`) com 100% de largura para facilitar o toque com o polegar.
   - **Alertas de Notificação:** Ajuste no `.feedback-alert` e ampliação da área de clique no botão de fechar (`.feedback-close`).
3. **Validação de Build:** Compilação do frontend executada via `npm.cmd run build` com sucesso absoluto (2429 módulos transformados em 4.81s).

### 16.4. Decisões de Engenharia
* **Prevenção de Modais Inacessíveis em Telas Pequenas:** O isolamento do scroll exclusivamente no corpo do formulário (`.modal-body`) impede que o modal estoure a altura da tela do smartphone, problema comum ao interagir com campos de data e selects.
* **Touch Targets Acessíveis:** Botões e áreas de interação no rodapé móvel ganharam largura total e paddings maiores, respeitando as diretrizes de usabilidade para toque em interfaces móveis.

---

## 17. Etapa 5 - Adaptação Responsiva das Abas (Dashboard, Movimentações e Categorias)

* **Data:** 06/11/2026
* **Etapa:** Etapa 5 - Tarefa 5.2 (Executada por Jeferson / Jeff)

### 17.1. Problema / Requisito Trabalhado
Garantir legibilidade, ergonomia e navegabilidade em dispositivos móveis e tablets para as três telas essenciais da aplicação: o painel analítico do Dashboard (cards de saldos e gráfico Recharts), o extrato de lançamentos com filtros avançados e o catálogo de categorias cadastradas.

### 17.2. Texto Exato dos Prompts Utilizados
```text
Ok, começaremos a parte 5.2
```
*(Autorização do estudante para desenvolvimento da Tarefa 5.2)*

### 17.3. Refinamentos e Ações Executadas
1. **Otimização da Aba Dashboard:**
   - Adaptação da grade de métricas monetárias (`.metrics-grid`) para coluna única no mobile, garantindo destaque legível aos valores de Saldo, Receitas e Despesas.
   - Ajuste de dimensões no container do gráfico SVG de rosca (`.chart-container` com altura de 210px), permitindo renderização perfeita em telas estreitas sem corte de fatias ou sobreposição com tooltips.
   - Reorganização do cabeçalho do painel analítico (`.panel-header`) e dos botões alternadores de gráfico (`.chart-toggle-group`) com largura fluida.
2. **Adaptação da Aba Movimentações:**
   - Reestruturação da barra de filtros avançados (`.filter-bar-advanced` e `.filter-row`): empilhamento inteligente com botões de tipo em largura total, campos de seleção de categoria e inputs de data `De:` / `Até:` expandidos para fácil preenchimento.
   - Transformação dos lançamentos da lista (`.transaction-item`): organização em duas zonas (topo: descrição com quebra de linha protegida, categoria e data; base: valor monetário destacado à esquerda e botões de ação à direita com área de clique de 36px).
   - Botão `Novo Lançamento` com largura total no mobile para facilitar o acesso com o polegar.
3. **Adaptação da Aba Categorias:**
   - Transição da grade de categorias (`.categories-preview-grid`) de múltiplas colunas rígidas para 1 coluna no celular e colunas adaptativas em tablets (`minmax(200px, 1fr)`).
   - Botão `Nova Categoria` expandido para largura total no mobile.
4. **Validação de Build:** Compilação do frontend validada via `npm.cmd run build` (2429 módulos transformados em 591ms, 0 erros).

### 17.4. Decisões de Engenharia
* **Padrão Cartão Financeiro no Extrato Mobile:** A divisão do lançamento em duas linhas conectadas por uma sutil linha tracejada evita que valores monetários e botões de ação disputem espaço horizontal com descrições extensas de movimentações, replicando o padrão consagrado em aplicativos de internet banking.
* **Ergonomia e Área de Polegar:** Em smartphones, a mão do usuário alcança predominantemente a base e a largura inferior da tela. Transformar os botões de ação e filtros em elementos de largura total reduz expressivamente o esforço motor do usuário final.

---

## 18. Etapa 5 - Micro-interações, Acessibilidade e Testes de Usabilidade

* **Data:** 06/11/2026
* **Etapa:** Etapa 5 - Tarefa 5.3 (Executada por Jeferson / Jeff)

### 18.1. Problema / Requisito Trabalhado
Finalização do polimento visual da interface através da implementação de micro-interações táteis nos cliques, indicadores de acessibilidade de foco via teclado (`:focus-visible`), barras de rolagem customizadas sutis e execução de testes de ponta a ponta validando os requisitos acadêmicos (em especial a trava de integridade referencial do item 3.4).

### 18.2. Texto Exato dos Prompts Utilizados
```text
Perfeito, inicie a Parte 5.3.
```
*(Autorização do estudante para execução e fechamento da Etapa 5)*

### 18.3. Refinamentos e Ações Executadas
1. **Acessibilidade com `:focus-visible`:**
   - Criação de anel de foco padronizado (`outline: 2px solid var(--primary); outline-offset: 2px`) para todos os elementos interativos acionados via teclado (`Tab`).
   - Foco suave em campos de formulário (`box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.2)`).
2. **Micro-interações de Clique e Feedback Tátil:**
   - Adição do efeito `:active` com ligeira contração (`scale(0.97)` em botões principais e `scale(0.90)` em botões de ícone), fornecendo sensação tátil imediata ao clique ou toque móvel.
   - Suavização de transições globais com curva `cubic-bezier(0.4, 0, 0.2, 1)`.
3. **Barra de Rolagem Elegante:**
   - Estilização de scrollbars finas (`scrollbar-width: thin` e `::-webkit-scrollbar` com 6px) com trilho transparente e cantos arredondados, evitando barras cinzas rústicas nativas do sistema operacional nos modais.
4. **Bateria de Testes de Usabilidade e Regras de Negócio:**
   - *Status do Backend:* Verificado via `GET /api/status` (servidor operacional).
   - *Cálculos do Dashboard:* Verificado via `GET /api/dashboard/resumo` confirmando exatidão contábil (Saldo R$ 5.930,00, Receitas R$ 6.000,00 e Despesas R$ 70,00 agrupadas por categoria com cores hexadecimais preservadas).
   - *Trava de Integridade Referencial (Requisito 3.4):* Testada requisição `DELETE /api/categorias/1` para uma categoria com movimentações vinculadas. O backend bloqueou a exclusão retornando status HTTP 400 com mensagem informativa (`"Não é possível excluir esta categoria porque existem 1 movimentação(ões) vinculada(s) a ela."`), sem corromper a base de dados.
   - *Compilação do Frontend:* `npm.cmd run build` executado com sucesso em 527ms.

### 18.4. Decisões de Engenharia
* **Acessibilidade Aprimorada (`:focus-visible` vs `:focus`):** O seletor `:focus-visible` aplica o contorno de foco exclusivamente quando a navegação é feita via teclado ou tecnologia assistiva, sem poluir visualmente a interface quando o usuário clica com o mouse.
* **Feedback Tátil `:active`:** Micro-interações fornecem confirmação visual imediata de que a ação foi registrada pelo sistema, reduzindo cliques duplos acidentais em dispositivos móveis.

---

## 19. Planejamento da Etapa 6 e Transição de Responsabilidade Técnica para Guilherme Buratto

* **Data:** 06/11/2026
* **Etapa:** Planejamento da Etapa 6 (Designada para Guilherme Buratto)

### 19.1. Problema / Requisito Trabalhado
Estruturação das tarefas finais de entrega acadêmica da disciplina de Laboratório de Programação (Unifacvest). Com todo o desenvolvimento de software (backend, modelagem relacional no PostgreSQL, frontend interativo com Vite/React, gráficos analíticos e responsividade mobile) 100% concluído e operacional, a Etapa 6 concentra-se no fechamento da governança visual (Kanban no Trello), enriquecimento das instruções de execução do `README.md` e preparação do roteiro de apresentação presencial de 10 minutos (atendendo ao item 2.7 dos requisitos acadêmicos).

### 19.2. Texto Exato dos Prompts Utilizados
```text
Certo, documente quais serão as próximas tarefas designadas para o guilherme.
```
*(Solicitação do estudante Jeff para detalhamento das tarefas da Etapa 6 para o integrante Guilherme)*

### 19.3. Refinamentos e Ações Executadas
1. **Definição da Tarefa 6.1 (Kanban / Trello):** Mapeamento para captura e inclusão de prints comprobatórios do Trello em `docs/kanban-prints/` demonstrando a passagem dos cartões das Etapas 4 e 5 para *Done*.
2. **Definição da Tarefa 6.2 (README.md Final):** Estruturação do guia definitivo com badges, stack tecnológica detalhada, comandos de inicialização rápida via Docker/npm e tabela de rotas da API REST.
3. **Definição da Tarefa 6.3 (Roteiro da Apresentação Presencial):** Planejamento da criação de `docs/roteiro_apresentacao.md` dividindo os 10 minutos de fala cronometrados entre Guilherme e Jeff, englobando arquitetura, demonstração prática ao vivo e justificativa das decisões técnicas com IA.
4. **Atualização do `PLANO_DE_DESENVOLVIMENTO.md`:** Seção 6 atualizada com instruções claras de sincronização Git e comandos para Guilherme.

### 19.4. Decisões de Engenharia
* **Alinhamento Rigoroso com os Critérios de Avaliação:** A formalização do roteiro de 10 minutos e a atualização dos prints do Trello asseguram pontuação máxima nos itens de *Uso efetivo do Kanban*, *Qualidade da documentação* e *Apresentação à turma*, conforme estipulado no enunciado acadêmico.

---

## 20. Ajuste Visual Fino no Seletor de Categorias e Alinhamento com Inputs de Data

* **Data:** 06/11/2026
* **Etapa:** Polimento e Correção Visual (Executada por Jeferson / Jeff)

### 20.1. Problema / Requisito Trabalhado
Na barra de filtros avançados da tela de Movimentações, o elemento nativo `<select>` apresentava a seta padrão do sistema operacional com posicionamento descolado e margem colada à direita, desalinhada em relação ao espaçamento interno e à orientação visual dos ícones de calendário presentes nos inputs de data (`De:` e `Até:`).

### 20.2. Texto Exato dos Prompts Utilizados
```text
Na tela de movimentações, iremos corrigir essa setinha que está um pouco descolada, iremos corrigir e subir como um fix, ela deve ficar na mesma orientação dos icones de calendário das datas. (Suba para o git com um "fix".
```

### 20.3. Refinamentos e Ações Executadas
1. **Padronização Visual da Seta via SVG Customizado:**
   - Remoção do seletor padrão rústico do sistema operacional com `appearance: none` e `-webkit-appearance: none`.
   - Inserção de ícone SVG chevron vetorial limpo via `background-image`, alinhado centralmente na vertical e com espaçamento lateral à direita (`background-position: right 0.65rem center`).
   - Equalização de altura (`height: 36px`) e preenchimento entre `.filter-select` e `.filter-date-input`, garantindo que ambos compartilhem exatamente a mesma linha base e alinhamento cromático dos ícones.
   - Aplicação da mesma padronização para o `select.form-control` nos modais.
2. **Validação de Build:** `npm.cmd run build` testado e aprovado com 0 erros.

### 20.4. Decisões de Engenharia
* **Substituição de Setas Nativas por Vetores SVG:** Controles de formulário nativos de navegadores (especialmente Windows Chromium) possuem variações estéticas imprevisíveis. O uso de `appearance: none` com vetor SVG em base64 garante consistência visual milimétrica idêntica em qualquer sistema operacional.







---

## 21. Etapa 6 - Finalização do README.md e Governança do Repositório

* **Data:** 06/11/2026
* **Etapa:** Etapa 6 - Tarefa 6.2 (Executada por Guilherme Buratto)

### 21.1. Problema / Requisito Trabalhado
Revisão e reestruturação completa do `README.md` principal do repositório para entrega formal da disciplina de Laboratório de Programação. Era necessário fornecer uma apresentação técnica, elegante e autoexplicativa, munida de badges de status, tabela completa da stack tecnológica com versões exatas, guia definitivo de execução passo a passo para a banca avaliadora (Docker Compose, migrações, seed e frontend), tabela semântica de todos os endpoints REST, modelo relacional Prisma e síntese das decisões críticas de engenharia adotadas.

### 21.2. Texto Exato dos Prompts Utilizados
```text
pode ir para a 6.2, os prints eu adiciono depois
```
*(Instrução do estudante para focar na finalização técnica do README e governança)*

### 21.3. Refinamentos e Ações Executadas
1. **Cabeçalho Profissional com Badges Oficiais:** Inserção de escudos informativos de status para todas as ferramentas e bibliotecas fundamentais do projeto (React 19, Vite, Node 24, Express, PostgreSQL 16 Alpine, Docker Compose, Prisma 6 e Recharts).
2. **Apresentação e Créditos Acadêmicos:** Contextualização formal do projeto para a banca da Unifacvest, listando a equipe de desenvolvimento e links diretos para os perfis do GitHub de ambos os integrantes.
3. **Mapeamento Funcional Completo:** Detalhamento das 4 grandes dimensões do software:
   - Dashboard analítico em tempo real com gráfico Donut interativo, tooltips monetários e alternador Despesas/Receitas;
   - Gerenciamento de movimentações com controle de coerência dinâmica de tipo e filtros avançados múltiplos;
   - Gerenciamento de categorias com paleta cromática e trava de integridade referencial (Requisito 3.4);
   - Responsividade mobile-first, padrão cartão financeiro móvel e acessibilidade `:focus-visible`.
4. **Guia de Instalação e Execução à Prova de Falhas:** Estruturação passo a passo clara dos comandos de clonagem, subida do banco PostgreSQL via Docker Compose, execução de migrações e seed de dados, e inicialização simultânea de backend (`localhost:3000`) e frontend (`localhost:5173`).
5. **Especificação Técnica dos Endpoints REST:** Tabela completa documentando métodos HTTP, rotas, query params, corpos em JSON e status codes de sucesso e erro.
6. **Registro das Decisões Críticas de Engenharia:** Documentação detalhada sobre o isolamento do container PostgreSQL na porta 5433 (prevenindo colisão com serviços locais do Windows), adoção de `Decimal(10,2)` para cálculo contábil e uso do cliente nativo Fetch sem inchaço de dependências.

### 21.4. Decisões de Engenharia
* **Documentação Orientada à Reprodutibilidade:** O `README.md` atua como o cartão de visitas e o guia operacional do projeto. Instruções claras com comandos prontos para cópia garantem que o avaliador acadêmico consiga rodar a solução de ponta a ponta sem atritos ou ambiguidades.
* **Transparência Técnica de Arquitetura:** Documentar explicitamente a solução da colisão de portas (`5433:5432`) e o uso de precisão Decimal comprova o rigor técnico e o pensamento crítico de engenharia adotado pelo grupo durante o desenvolvimento.
