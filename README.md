# MeuFinanceiro - Sistema Web de Controle Financeiro Pessoal

![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_Alpine-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3.10-22C55E?style=for-the-badge&logo=chartdotjs&logoColor=white)

Aplicação web full stack intuitiva, moderna e responsiva voltada para o controle e acompanhamento de finanças pessoais. Permite o registro, categorização, filtragem temporal e visualização gráfica de receitas e despesas, fornecendo métricas de saldo e distribuição orçamentária em tempo real.

Projeto desenvolvido para a disciplina de **Laboratório de Programação** do curso de **Ciência da Computação** do **Centro Universitário Unifacvest** (Lages/SC).

---

## 👥 Equipe de Desenvolvimento

* **Guilherme Buratto Fernandes Walter** ([GitHub](https://github.com/guilhermeburatto))
* **Jeferson Gomes Martins** ([GitHub](https://github.com/jefersongmartins))

---

## ✨ Principais Funcionalidades

### 1. 📊 Dashboard Analítico em Tempo Real
* **Cards de Métricas:** Saldo Líquido Atual, Total de Receitas e Total de Despesas formatados em moeda brasileira (`R$`).
* **Gráfico Donut Interativo (Recharts):** Gráfico de rosca dinâmico com fatias mapeadas diretamente para as cores hexadecimais cadastradas no banco de dados.
* **Alternador Despesas / Receitas:** Permite alternar a perspectiva gráfica de gastos ou entradas instantaneamente no cabeçalho do painel.
* **Tooltip Enriquecido:** Exibe o nome da categoria, montante em Reais e porcentagem exata que o grupo representa sobre o total acumulado.
* **Lista de Apoio com Progresso:** Barras de preenchimento proporcional para conferência analítica detalhada.
* **Movimentações Recentes:** Extrato rápido das 5 últimas transações com badges cromáticos de entrada e saída.

### 2. 💸 Gerenciamento Completo de Movimentações (Receitas e Despesas)
* **Cadastro e Edição Modal:** Registro de lançamentos com descrição, valor monetário positivo, data de competência e categoria vinculada.
* **Seletor Inteligente de Categorias:** Ao alternar o tipo da movimentação (Receita ou Despesa), o menu de categorias filtra dinamicamente exibindo apenas as categorias compatíveis com a operação.
* **Filtros Avançados Combinados:**
  * Filtro por tipo (`Todas`, `Receitas`, `Despesas`);
  * Filtro por categoria específica;
  * Filtro por intervalo de datas (`De:` / `Até:`);
  * Botão de limpeza rápida de filtros.
* **Resumo Instantâneo Filtrado:** Contagem de registros e soma dos valores filtrados de receitas e despesas em tempo real.
* **Ações por Linha:** Botões ergonômicos para edição e exclusão com diálogo de confirmação.

### 3. 🏷️ Gerenciamento de Categorias com Trava de Integridade
* **Catálogo de Categorias:** Visualização em grade categorizada por tipo (Despesa ou Receita).
* **Modal de Criação e Edição:** Definição do nome, tipo e cor personalizada através de uma paleta de 12 cores pré-definidas ou seletor nativo.
* **Proteção de Integridade Referencial (Requisito 3.4):** Trava em banco (`onDelete: Restrict`) e captura de erro HTTP 400 com banner explicativo na interface, impedindo que o usuário apague categorias que possuam movimentações vinculadas.

### 4. 📱 Design Responsivo, Ergonomia e Acessibilidade
* **Mobile-First e Breakpoints:** Totalmente adaptado para smartphones (< 640px), tablets (< 768px) e monitores widescreen.
* **Padrão Cartão Financeiro no Extrato Mobile:** Lançamentos com separação ergonômica de descrição, valor e botões de ação amplos (36px).
* **Modais com Rolagem Segura:** Altura controlada (`max-height: 90vh`) com scroll isolado no formulário para evitar que botões de ação fiquem escondidos atrás do teclado virtual.
* **Acessibilidade de Foco:** Indicador visual padronizado com `:focus-visible` para navegação contínua via teclado (`Tab`).
* **Micro-interações:** Sensação tátil ao toque/clique (`:active` com escala `scale(0.97)`).

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Versão | Finalidade |
| :--- | :--- | :--- | :--- |
| **Backend** | Node.js | `24.x` (LTS) | Runtime JavaScript assíncrono de alto desempenho |
| **Framework** | Express | `5.x` | Servidor HTTP e arquitetura de rotas RESTful |
| **ORM** | Prisma ORM | `6.19.x` | Modelagem, migrações relacionais e consultas tipadas |
| **Database** | PostgreSQL | `16 Alpine` | Banco de dados relacional robusto e ACID |
| **Container** | Docker & Docker Compose | `2.x+` | Provisionamento isolado do banco de dados |
| **Frontend** | React | `19.3.x` | Biblioteca declarativa de componentes de interface SPA |
| **Bundler** | Vite | `8.3.x` | Ferramenta de build ultrarrápida e Hot Module Replacement (HMR) |
| **Gráficos** | Recharts | `3.10.x` | Visualização de dados vetorial SVG declarativa |
| **Ícones** | Lucide React | `1.69.x` | Conjunto consistente de ícones vetoriais modernos |
| **Estilos** | CSS3 Moderno | Padrão W3C | Design system com CSS Variables, Flexbox, Grid e Media Queries |

---

## 📂 Estrutura do Repositório

```text
MeuFinanceiro/
├── backend/                          # API RESTful (Node.js + Express + Prisma)
│   ├── prisma/                       # Modelagem relacional e sementes
│   │   ├── migrations/               # Histórico versionado de migrações SQL
│   │   ├── schema.prisma             # Definição dos modelos e conexões
│   │   └── seed.js                   # Script para popular 12 categorias base
│   ├── src/
│   │   ├── controllers/              # Controladores (categoria, movimentacao, dashboard)
│   │   ├── lib/                      # Singleton do Prisma Client
│   │   ├── routes/                   # Definição dos endpoints HTTP
│   │   └── server.js                 # Ponto de entrada da aplicação Express
│   ├── .env.example                  # Template das variáveis de ambiente do backend
│   └── package.json                  # Dependências e scripts do backend
├── frontend/                         # Interface de Usuário SPA (React + Vite)
│   ├── src/
│   │   ├── services/                 # Camada de comunicação HTTP com a API (Fetch API)
│   │   │   └── api.js
│   │   ├── App.jsx                   # Componente central, lógica de estado e modais
│   │   ├── App.css                   # Estilos locais auxiliares
│   │   ├── index.css                 # Design System, variáveis CSS, temas e responsividade
│   │   └── main.jsx                  # Ponto de entrada React DOM
│   ├── .env.example                  # Template da URL base da API
│   └── package.json                  # Dependências e scripts do frontend
├── docs/                             # Documentação técnica e comprovações acadêmicas
│   ├── kanban-prints/                # Registros visuais da evolução ágil no Trello
│   │   └── 03-11.png
│   ├── arquitetura.md                # Diagramas arquiteturais e fluxo de dados
│   └── roteiro_apresentacao.md       # Roteiro cronometrado para a banca presencial (10 min)
├── docker-compose.yml                # Configuração do PostgreSQL 16 (porta mapeada 5433)
├── DOCUMENTACAO_IA.md                # Registro obrigatório de uso e refinamentos com IA
├── PLANO_DE_DESENVOLVIMENTO.md       # Roadmap cronológico e status de cada etapa
├── README.md                         # Apresentação do projeto e instruções de uso
└── requisitos_trabalho.txt           # Especificação acadêmica do trabalho da Unifacvest
```

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar a aplicação completa em ambiente local de desenvolvimento.

### Pré-requisitos
* [Node.js](https://nodejs.org/) versão 24.x (mínimo 22.x);
* [Docker Desktop](https://www.docker.com/) com Docker Compose instalado e ativo;
* [Git](https://git-scm.com/) para clonagem do repositório.

---

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/guilhermeburatto/MeuFinanceiro.git
cd MeuFinanceiro
```

---

### Passo 2: Subir o Banco de Dados PostgreSQL no Docker

O banco de dados roda em um container Docker isolado na porta **`5433`** do host (evitando colisões com eventuais instâncias locais do PostgreSQL na porta 5432):

```bash
docker compose up -d
```

> **Verificação:** Para conferir se o container subiu corretamente, execute `docker ps`. Você verá o container `meufinanceiro_postgres` com status *Up*.

---

### Passo 3: Configurar e Iniciar o Backend

1. Acesse o diretório do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   * Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   * O conteúdo padrão já está pré-configurado para a porta 5433:
     ```env
     PORT=3000
     DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5433/meufinanceiro?schema=public"
     ```

4. Execute as migrações do Prisma para criar as tabelas no PostgreSQL:
   ```bash
   npx prisma migrate dev
   ```

5. *(Opcional, mas altamente recomendado)* Popule o banco com as 12 categorias base de teste:
   ```bash
   npm run seed
   ```

6. Inicie o servidor da API em modo de desenvolvimento (com Nodemon):
   ```bash
   npm run dev
   ```
   > A API estará operando em: **`http://localhost:3000`**  
   > Verifique a saúde da API acessando: **`http://localhost:3000/api/status`**

---

### Passo 4: Configurar e Iniciar o Frontend

Em um **novo terminal**, a partir da raiz do projeto:

1. Acesse a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   * Copie o `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   * Conteúdo padrão:
     ```env
     VITE_API_URL=http://localhost:3000/api
     ```

4. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```

5. Abra o navegador e acesse:
   **`http://localhost:5173`**

---

## 📡 Endpoints da API REST

A API segue as convenções RESTful, comunicando-se exclusivamente via `JSON` com códigos de status HTTP semânticos (200, 201, 400, 404, 500).

| Método | Endpoint | Parâmetros / Query / Body | Descrição | Status Sucesso |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/status` | — | Verifica saúde operacional do servidor | `200 OK` |
| `GET` | `/api/categorias` | `?tipo=RECEITA\|DESPESA` | Lista categorias cadastradas (filtro opcional) | `200 OK` |
| `GET` | `/api/categorias/:id` | `:id` (URL) | Retorna uma categoria específica | `200 OK` |
| `POST` | `/api/categorias` | `{ nome, tipo, cor }` | Cadastra nova categoria com cor hexadecimal | `201 Created` |
| `PUT` | `/api/categorias/:id` | `{ nome, tipo, cor }` | Atualiza dados de uma categoria existente | `200 OK` |
| `DELETE` | `/api/categorias/:id` | `:id` (URL) | Remove categoria (com trava de integridade) | `200 OK` |
| `GET` | `/api/movimentacoes` | `?tipo=&categoriaId=&dataInicio=&dataFim=` | Lista movimentações com múltiplos filtros | `200 OK` |
| `GET` | `/api/movimentacoes/:id`| `:id` (URL) | Retorna uma movimentação por ID | `200 OK` |
| `POST` | `/api/movimentacoes` | `{ descricao, valor, data, tipo, categoriaId }` | Cadastra movimentação validando tipo e valor | `201 Created` |
| `PUT` | `/api/movimentacoes/:id`| `{ descricao, valor, data, tipo, categoriaId }` | Atualiza movimentação financeira | `200 OK` |
| `DELETE` | `/api/movimentacoes/:id`| `:id` (URL) | Exclui lançamento e atualiza saldo | `200 OK` |
| `GET` | `/api/dashboard/resumo`| `?dataInicio=&dataFim=` | Retorna métricas consolidadas e gráficos | `200 OK` |

---

## 💾 Modelagem do Banco de Dados

O banco relacional PostgreSQL gerencia duas entidades centrais através do Prisma ORM:

```prisma
enum TipoMovimentacao {
  RECEITA
  DESPESA
}

model Categoria {
  id            Int              @id @default(autoincrement())
  nome          String           @db.VarChar(100)
  tipo          TipoMovimentacao
  cor           String           @default("#059669") @db.VarChar(7)
  criadoEm      DateTime         @default(now())
  atualizadoEm  DateTime         @updatedAt
  movimentacoes Movimentacao[]

  @@map("categorias")
}

model Movimentacao {
  id           Int              @id @default(autoincrement())
  descricao    String           @db.VarChar(255)
  valor        Decimal          @db.Decimal(10, 2)
  data         DateTime
  tipo         TipoMovimentacao
  categoriaId  Int
  categoria    Categoria        @relation(fields: [categoriaId], references: [id], onDelete: Restrict)
  criadoEm     DateTime         @default(now())
  atualizadoEm DateTime         @updatedAt

  @@map("movimentacoes")
}
```

---

## 🧠 Metodologia Ágil e Engenharia Assistida por IA

O desenvolvimento do MeuFinanceiro seguiu rigorosamente os padrões de engenharia de software e as diretrizes acadêmicas da Unifacvest:

1. **Gestão Visual com Trello (Kanban):** Organização das entregas em colunas (*Backlog*, *A Fazer*, *Em Andamento*, *Revisão* e *Concluído*), com histórico de prints registrado na pasta `docs/kanban-prints/`.
2. **Histórico Rastreável com Semantic Commits:** Todo o histórico de versões adota o padrão formal de commits semânticos com prefixo em inglês e escopo em português:
   * `feat: implementar cadastro e filtros de movimentacoes`
   * `fix: compatibilizar payload de totais do dashboard`
   * `docs: definir escopo da etapa 5 para jeff`
   * `style: ajustar responsividade no mobile`
3. **Uso Crítico de Inteligência Artificial:** Toda a arquitetura, refatorações e soluções foram documentadas detalhadamente em [DOCUMENTACAO_IA.md](DOCUMENTACAO_IA.md), registrando os prompts utilizados, refinamentos manuais da dupla e critérios de aceitação.
4. **Decisões de Engenharia Relevantes:**
   * **Resolução de Colisão de Portas:** Mapeamento `5433:5432` no Docker Compose para permitir a execução paralela sem conflito com serviços PostgreSQL já instalados no sistema operacional hospedeiro.
   * **Precisão Monetária com `Decimal(10,2)`:** Substituição do tipo `Float` por `Decimal` no banco para eliminar imprecisões de arredondamento em ponto flutuante padrão IEEE 754 em transações contábeis.
   * **Integridade Referencial Amigável (`onDelete: Restrict`):** Impedimento automático da exclusão de categorias em uso com emissão de mensagem pedagógica e não-bloqueante na interface.
   * **Cliente HTTP Nativo Leve:** Encapsulamento da `Fetch API` em `api.js` sem necessidade de bibliotecas de terceiros pesadas como Axios.

---

## 📄 Licença e Uso Acadêmico

Projeto desenvolvido estritamente para fins pedagógicos e de avaliação na disciplina de **Laboratório de Programação** (Ciência da Computação - Unifacvest). Todos os direitos reservados aos autores Guilherme Buratto Fernandes Walter e Jeferson Gomes Martins.
