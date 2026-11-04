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
