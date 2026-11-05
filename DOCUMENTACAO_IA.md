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


