# 🎤 Roteiro de Ensaio para Apresentação Presencial (10 Minutos)

**Projeto:** MeuFinanceiro - Sistema Web de Controle Financeiro Pessoal  
**Disciplina:** Laboratório de Programação  
**Curso:** Ciência da Computação - Centro Universitário Unifacvest  
**Data da Apresentação:** 09/11/2026  
**Tempo Total:** 10 minutos cronometrados  
**Apresentadores:** Guilherme Buratto Fernandes Walter & Jeferson Gomes Martins  

---

## ⏱️ Distribuição de Tempo da Apresentação

```text
[00:00 - 02:00] (2 min) ➔ Abertura, Contexto e Arquitetura do Sistema (Guilherme)
[02:00 - 06:00] (4 min) ➔ Demonstração Prática ao Vivo da Aplicação (Guilherme e Jeff)
[06:00 - 08:00] (2 min) ➔ Metodologia, Decisões de Engenharia e Uso Crítico de IA (Jeff)
[08:00 - 10:00] (2 min) ➔ Considerações Finais e Espaço para Perguntas do Professor
```

---

## 🛠️ Checklist de Preparação Prévia (10 minutos antes de apresentar)

Antes de iniciar a fala perante a turma e o professor, certifique-se de que o ambiente local já está 100% pronto na máquina:

* [ ] **Docker Desktop aberto:** Container `meufinanceiro_postgres` em execução e saudável (`docker ps`).
* [ ] **Terminal 1 (Backend):** Executando com sucesso em `cd backend && npm run dev` (escutando na porta 3000).
* [ ] **Terminal 2 (Frontend):** Executando com sucesso em `cd frontend && npm run dev` (disponível na porta 5173).
* [ ] **Navegador aberto em 3 abas essenciais:**
  1. `http://localhost:5173` (Aplicação MeuFinanceiro pronta para uso);
  2. [Repositório GitHub](https://github.com/guilhermeburatto/MeuFinanceiro) (mostrando os commits semânticos e o `README.md`);
  3. Quadro do Trello da dupla (mostrando todas as etapas concluídas na coluna *Done*).
* [ ] **Dados de Demonstração Pré-carregados:** Garantir que o comando `npm run seed` foi executado no backend e que já existem algumas receitas e despesas lançadas para visualização imediata do gráfico Donut.

---

## 📜 Script Minuto a Minuto com Divisão de Falas

### 🟢 BLOCO 1: Abertura, Contexto e Arquitetura [00:00 - 02:00] (2 minutos)
**Responsável pela fala:** Guilherme Buratto

> **Fala do Guilherme:**
> 
> *"Boa noite, professor e colegas. Meu nome é Guilherme e, juntamente com o meu colega Jeferson, desenvolvemos o **MeuFinanceiro**, uma aplicação web full stack para gerenciamento e controle de finanças pessoais, desenvolvida como projeto semestral da disciplina de Laboratório de Programação.*
> 
> *O objetivo central do projeto foi criar uma ferramenta simples, porém robusta e intuitiva, que permitisse a qualquer pessoa registrar receitas e despesas, entender sua distribuição orçamentária por categorias e tomar decisões financeiras com base em dados consolidados em tempo real.*
> 
> *Para garantir escalabilidade e organização profissional, adotamos uma arquitetura totalmente desacoplada dividida em três camadas:*
> 1. *No **Frontend**, uma Single Page Application construída com **React 19** e empacotada com **Vite**, utilizando **Recharts** para gráficos vetoriais interativos e CSS moderno responsivo.*
> 2. *No **Backend**, uma API REST desenvolvida em **Node.js 24** com **Express**, utilizando **Prisma ORM 6** para manipulação tipada do banco e controle estrito de regras de negócio.*
> 3. *Na **Infraestrutura**, um banco relacional **PostgreSQL 16 Alpine** provisionado de forma isolada via **Docker Compose**.*
> 
> *Toda a gestão do projeto seguiu a metodologia ágil com quadro Kanban no Trello e versionamento no GitHub com histórico rastreável através de Commits Semânticos.*
> 
> *Agora, vamos demonstrar o sistema funcionando na prática."*

---

### 🟡 BLOCO 2: Demonstração Prática ao Vivo do Sistema [02:00 - 06:00] (4 minutos)
**Responsáveis:** Guilherme Buratto e Jeferson Gomes

#### Parte 2.1: Dashboard Analítico e Categorias (Guilherme) [02:00 - 03:30]
*(Guilherme projeta a tela na aba Dashboard)*

> **Fala do Guilherme:**
> 
> *"Aqui na tela inicial temos o **Dashboard**. O sistema exibe de imediato o badge de conectividade do backend no topo, garantindo que o usuário saiba se o servidor está ativo.*
> 
> *Nos cards superiores temos as três métricas essenciais formatadas em Real brasileiro: Total de Receitas, Total de Despesas e o Saldo Atual consolidado, que muda de cor dinamicamente para verde ou vermelho dependendo da saúde financeira.*
> 
> *Logo abaixo, temos o gráfico de rosca (Donut Chart) desenvolvido com Recharts. Notem que cada fatia corresponde exatamente à cor hexadecimal cadastrada para a categoria no banco de dados. Ao passar o mouse, o tooltip informa o valor monetário e a porcentagem exata que aquele gasto representa.*
> 
> *Um recurso visual muito prático que implementamos é esse alternador no cabeçalho do card: com um clique, podemos mudar a perspectiva gráfica de **Despesas** para **Receitas**, analisando a origem dos nossos ganhos sem recarregar a página.*
> 
> *Acessando a aba **Categorias**, temos a listagem completa das categorias ativas com filtros rápidos por tipo e um modal interativo onde podemos criar uma nova categoria escolhendo entre 12 cores pré-definidas ou usando o seletor livre.*
> 
> *Passo a palavra ao Jeff para demonstrar o gerenciamento de movimentações e as validações."*

#### Parte 2.2: Movimentações e Filtros Avançados (Jeff) [03:30 - 04:45]
*(Jeff assume os controles e clica na aba Movimentações)*

> **Fala do Jeff:**
> 
> *"Obrigado, Gui. Na aba **Movimentações**, construímos um sistema flexível para controle contábil. Ao clicar em '+ Novo Lançamento', abre-se o formulário modal.*
> 
> *Notem uma regra de negócio e usabilidade crucial que implementamos: ao alternar o seletor entre 'Despesa' e 'Receita', o menu suspenso de categorias filtra dinamicamente na hora, exibindo apenas as categorias pertinentes àquele tipo. Isso impede que o usuário cometa o erro de cadastrar uma despesa na categoria 'Salário', por exemplo.*
> 
> *(Cadastra uma despesa rápida: Ex: 'Supermercado Mensal' / R$ 250,00 / Categoria Alimentação).*
> 
> *Ao salvar, a lista é atualizada instantaneamente e o saldo no Dashboard é recalculado automaticamente sem necessidade de refresh manual.*
> 
> *Além disso, criamos uma barra de filtros avançados combinando filtro por tipo, dropdown de categoria específica e seleção de intervalo de datas (De / Até). A barra exibe uma linha de resumo instantâneo com a contagem de lançamentos e o somatório dos valores que atendem ao filtro ativo."*

#### Parte 2.3: Trava de Integridade e Responsividade Mobile (Guilherme e Jeff) [04:45 - 06:00]
*(Momento chave da apresentação - atendimento ao Requisito 3.4 e Usabilidade)*

> **Fala do Guilherme:**
> 
> *"Professor, gostaríamos de destacar um dos requisitos mais importantes do trabalho: a **Proteção de Integridade Referencial (Requisito 3.4)**.*
> 
> *No nosso banco de dados, configuramos o relacionamento da movimentação com a categoria usando a cláusula `onDelete: Restrict`. Vamos demonstrar o que acontece se tentarmos excluir a categoria 'Alimentação', que acabamos de usar:*
> 
> *(Guilherme vai na aba Categorias e clica no ícone de lixeira da categoria Alimentação, confirmando o diálogo)*
> 
> *Observem: a API intercepta a violação de integridade, bloqueia a deleção com status HTTP 400 e a nossa interface captura esse erro exibindo um banner explicativo amigável em vermelho, alertando que a categoria não pode ser excluída porque possui lançamentos vinculados.*
> 
> *Por fim, se abrirmos o DevTools (`F12`) e simularmos um smartphone (ex: iPhone ou Galaxy), todo o layout se reorganiza fluidamente: os modais mantêm rolagem interna sem cortar os botões, os extratos adotam o padrão de cartão financeiro móvel e os botões ganham área ampla de toque com micro-interações táteis."*

---

### 🔵 BLOCO 3: Metodologia e Uso Crítico de Inteligência Artificial [06:00 - 08:00] (2 minutos)
**Responsável pela fala:** Jeferson Gomes

> **Fala do Jeff:**
> 
> *"Em cumprimento às diretrizes da disciplina, a Inteligência Artificial desempenhou um papel central e ativo no nosso projeto. No entanto, não a utilizamos como um gerador cego de código, mas sim como uma parceira de Pair Programming e mentora técnica de engenharia de software.*
> 
> *Toda a nossa jornada está formalmente registrada no arquivo **`DOCUMENTACAO_IA.md`**, que conta com mais de 20 seções cronológicas detalhando os prompts exatos, os problemas tratados, os refinamentos manuais da dupla e as justificativas técnicas.*
> 
> *Gostaríamos de destacar três decisões críticas de engenharia tomadas durante o processo:*
> 
> 1. ***Resolução da Colisão de Portas do PostgreSQL (5432 vs 5433):** Durante os primeiros testes no Docker, identificamos que a porta nativa 5432 já estava ocupada por um serviço local do Windows na máquina. Em vez de simplesmente desativar o serviço local, reconfiguramos o `docker-compose.yml` para mapear a porta `5433:5432` no host, garantindo que o container funcione em qualquer máquina sem quebrar o ambiente existente.*
> 2. ***Precisão Financeira com `Decimal(10,2)`:** Na modelagem do banco com Prisma, rejeitamos o uso do tipo `Float` do JavaScript, pois ele sofre com imprecisões de arredondamento causadas pelo padrão IEEE 754 (como a clássica conta `0.1 + 0.2 = 0.30000000000000004`). Adotamos o tipo `Decimal` fixo em duas casas decimais, garantindo exatidão contábil total nas operações.*
> 3. ***Encapsulamento Nativo da Fetch API:** Para a camada de serviços no frontend (`api.js`), optamos por encapsular a `Fetch API` nativa do navegador com tratamento centralizado de erros em vez de instalar o pacote Axios, reduzindo expressivamente o peso final do bundle empacotado pelo Vite.*
> 
> *Essas decisões comprovam que cada sugestão gerada pela IA passou por rigorosa análise crítica e validação técnica da nossa parte."*

---

### 🟣 BLOCO 4: Conclusão e Arguição da Banca [08:00 - 10:00] (2 minutos)
**Responsáveis:** Guilherme Buratto e Jeferson Gomes

> **Fala do Guilherme:**
> 
> *"Para concluir, o desenvolvimento do **MeuFinanceiro** nos proporcionou uma experiência completa do ciclo de vida de desenvolvimento de software moderno: desde a infraestrutura em containers com Docker, passando pela modelagem relacional com Prisma, construção de APIs RESTful estruturadas, até o desenvolvimento de interfaces reativas e responsivas com React 19.*
> 
> *O código-fonte completo, a documentação de IA, as migrações do banco e o histórico de commits semânticos estão disponíveis publicamente no nosso GitHub.*
> 
> *Agradecemos a atenção do professor e dos colegas e estamos abertos para perguntas, dúvidas e demonstrações adicionais que o senhor desejar fazer no sistema. Muito obrigado!"*

---

## 💡 Guia de Sobrevivência: Possíveis Perguntas do Professor e Como Responder

Durante a arguição de 2 minutos, o professor costuma fazer perguntas técnicas. Seguem as respostas alinhadas para a dupla:

### 1. "Por que vocês mapearam a porta do banco para 5433 no Docker?"
* **Resposta:** *"Mapeamos para a porta `5433` no host porque máquinas de desenvolvimento frequentemente possuem instâncias locais do PostgreSQL instaladas e rodando como serviço na porta padrão 5432. O mapeamento `5433:5432` garante que o container Docker suba sem conflito de portas, mantendo a porta interna do container intacta em 5432."*

### 2. "Como funciona a trava de integridade que impede excluir a categoria?"
* **Resposta:** *"No arquivo `schema.prisma`, definimos o relacionamento entre `Movimentacao` e `Categoria` com a diretiva `onDelete: Restrict`. Quando o controller da API tenta executar `prisma.categoria.delete`, o próprio PostgreSQL dispara uma violação de chave estrangeira (código `P2003` do Prisma). Nosso controller captura essa exceção e responde ao cliente com status `HTTP 400 Bad Request` e uma mensagem em português, que é interceptada pelo frontend e renderizada em um banner de notificação não-bloqueante."*

### 3. "Por que escolheram o Recharts para a visualização gráfica?"
* **Resposta:** *"O Recharts foi desenvolvido especificamente para o ecossistema React. Ele renderiza elementos vetoriais SVG puros em vez de canvas estáticos, o que permite animações fluidas, suporte contínuo a telas responsivas através do componente `ResponsiveContainer`, integração natural com o tema da aplicação e personalização dinâmica das cores de cada fatia usando o código hexadecimal armazenado no PostgreSQL."*

### 4. "Por que não implementaram login com JWT ou sessão neste momento?"
* **Resposta:** *"O enunciado acadêmico definiu que o foco principal da disciplina nesta fase era a modelagem relacional, operações de CRUD consistentes, cálculo de saldo, consumo de API REST e uso crítico da IA. A ausência de autenticação foi uma decisão de engenharia deliberada para mantermos o escopo 100% focado e polido nas regras de negócio financeiras, evitando complexidade acidental de tokens e sessões."*

---

## 🎯 Dicas de Ouro para o Dia da Apresentação

1. **Postura e Firmeza:** Fale em tom claro, olhando para o professor e para a turma. Não leia o roteiro palabra por palavra; use-o como guia mental dos pontos que devem ser falados.
2. **Divida a Tela com Inteligência:** Deixe o navegador ocupando a maior parte da tela projetada. Evite mostrar código-fonte linha a linha, a menos que o professor pergunte especificamente sobre alguma implementação. O professor quer ver **o sistema rodando, os requisitos funcionando e a documentação organizada**.
3. **Se algo travar (Plano de Contingência):**
   * Se o backend não responder: confira se o terminal do backend não travou em seleção de texto do Windows (pressione `Enter` no terminal).
   * Se o banco não conectar: execute `docker ps` para garantir que o container está com status *Up*.
