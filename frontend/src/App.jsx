import { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  RefreshCw,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';
import { obterStatus, dashboardService, categoriaService, movimentacaoService } from './services/api';
import './App.css';

// Paleta pré-definida de cores amigáveis para as categorias e gráficos
const PALETA_CORES = [
  '#E53E3E', // Vermelho
  '#DD6B20', // Laranja
  '#D69E2E', // Âmbar
  '#38A169', // Verde Folha
  '#059669', // Verde Esmeralda
  '#319795', // Teal
  '#3182CE', // Azul
  '#2563EB', // Azul Royal
  '#805AD5', // Roxo
  '#D53F8C', // Rosa
  '#718096', // Cinza Slate
  '#4A5568', // Cinza Escuro
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('loading'); // 'loading' | 'online' | 'offline'
  const [statusMessage, setStatusMessage] = useState('Verificando conexão...');
  const [loadingDados, setLoadingDados] = useState(false);

  // Estados dos dados da API
  const [resumo, setResumo] = useState({
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0,
    despesasPorCategoria: [],
    receitasPorCategoria: [],
    movimentacoesRecentes: [],
  });

  const [categorias, setCategorias] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);

  // Estados de Gerenciamento de Categorias (Tarefa 4.1)
  const [filtroTipoCategoria, setFiltroTipoCategoria] = useState('TODOS');
  const [modalCategoriaAberto, setModalCategoriaAberto] = useState(false);
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState(null);
  const [formCategoria, setFormCategoria] = useState({
    nome: '',
    tipo: 'DESPESA',
    cor: '#E53E3E',
  });
  const [salvandoCategoria, setSalvandoCategoria] = useState(false);
  const [feedbackMensagem, setFeedbackMensagem] = useState(null);

  // Formatação de Moeda Brasileira (BRL)
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);
  };

  // Formatação de Data
  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    const dataLimpa = dataIso.split('T')[0];
    const [ano, mes, dia] = dataLimpa.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Exibe mensagem de feedback temporária
  const exibirFeedback = (tipo, texto) => {
    setFeedbackMensagem({ tipo, texto });
    if (tipo === 'success') {
      setTimeout(() => {
        setFeedbackMensagem((atual) => (atual?.texto === texto ? null : atual));
      }, 4000);
    }
  };

  // Carrega e verifica o status da API e os dados do resumo
  const carregarDados = async () => {
    setLoadingDados(true);
    try {
      // 1. Testa conectividade da API
      const statusRes = await obterStatus();
      if (statusRes?.status === 'ok') {
        setBackendStatus('online');
        setStatusMessage('Backend Online (porta 3000)');
      }

      // 2. Carrega resumo analítico do Dashboard
      const resumoRes = await dashboardService.obterResumo();
      if (resumoRes) {
        setResumo({
          totalReceitas: resumoRes.totalReceitas ?? resumoRes.totais?.receitas ?? 0,
          totalDespesas: resumoRes.totalDespesas ?? resumoRes.totais?.despesas ?? 0,
          saldo: resumoRes.saldo ?? resumoRes.totais?.saldo ?? 0,
          despesasPorCategoria: resumoRes.despesasPorCategoria || [],
          receitasPorCategoria: resumoRes.receitasPorCategoria || [],
          movimentacoesRecentes: resumoRes.movimentacoesRecentes ?? resumoRes.ultimasMovimentacoes ?? [],
        });
      }

      // 3. Carrega categorias
      const categoriasRes = await categoriaService.listar();
      setCategorias(categoriasRes || []);

      // 4. Carrega movimentações
      const movimentacoesRes = await movimentacaoService.listar();
      setMovimentacoes(movimentacoesRes || []);
    } catch (err) {
      console.warn('Backend indisponível:', err.message);
      setBackendStatus('offline');
      setStatusMessage('Backend Desconectado (porta 3000)');
    } finally {
      setLoadingDados(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // --- Funções de Ação de Categorias (Tarefa 4.1) ---

  const abrirModalNovaCategoria = () => {
    setCategoriaEmEdicao(null);
    setFormCategoria({
      nome: '',
      tipo: 'DESPESA',
      cor: '#E53E3E',
    });
    setModalCategoriaAberto(true);
  };

  const abrirModalEditarCategoria = (cat) => {
    setCategoriaEmEdicao(cat);
    setFormCategoria({
      nome: cat.nome,
      tipo: cat.tipo,
      cor: cat.cor || (cat.tipo === 'RECEITA' ? '#38A169' : '#E53E3E'),
    });
    setModalCategoriaAberto(true);
  };

  const fecharModalCategoria = () => {
    setModalCategoriaAberto(false);
    setCategoriaEmEdicao(null);
  };

  const handleSalvarCategoria = async (e) => {
    e.preventDefault();
    if (!formCategoria.nome.trim()) {
      exibirFeedback('error', 'O nome da categoria é obrigatório.');
      return;
    }

    setSalvandoCategoria(true);
    try {
      if (categoriaEmEdicao) {
        // Atualização de categoria existente
        const atualizada = await categoriaService.atualizar(categoriaEmEdicao.id, {
          nome: formCategoria.nome.trim(),
          tipo: formCategoria.tipo,
          cor: formCategoria.cor,
        });

        setCategorias((anteriores) =>
          anteriores.map((c) => (c.id === atualizada.id ? atualizada : c))
        );
        exibirFeedback('success', `Categoria "${atualizada.nome}" atualizada com sucesso!`);
      } else {
        // Criação de nova categoria
        const nova = await categoriaService.criar({
          nome: formCategoria.nome.trim(),
          tipo: formCategoria.tipo,
          cor: formCategoria.cor,
        });

        setCategorias((anteriores) => [...anteriores, nova].sort((a, b) => a.nome.localeCompare(b.nome)));
        exibirFeedback('success', `Categoria "${nova.nome}" criada com sucesso!`);
      }

      fecharModalCategoria();
      // Atualiza também os resumos
      carregarDados();
    } catch (err) {
      exibirFeedback('error', err.message || 'Falha ao salvar a categoria.');
    } finally {
      setSalvandoCategoria(false);
    }
  };

  const handleExcluirCategoria = async (cat) => {
    const confirmar = window.confirm(
      `Deseja realmente excluir a categoria "${cat.nome}"?`
    );
    if (!confirmar) return;

    try {
      await categoriaService.excluir(cat.id);
      setCategorias((anteriores) => anteriores.filter((c) => c.id !== cat.id));
      exibirFeedback('success', `Categoria "${cat.nome}" excluída com sucesso!`);
      carregarDados();
    } catch (err) {
      // Aqui tratamos com destaque o erro de integridade referencial vindo da API!
      exibirFeedback('error', err.message);
    }
  };

  // Filtra as categorias conforme a aba selecionada (Todas / Despesas / Receitas)
  const categoriasFiltradas = categorias.filter((c) => {
    if (filtroTipoCategoria === 'TODOS') return true;
    return c.tipo === filtroTipoCategoria;
  });

  return (
    <div className="app-container">
      {/* 1. Cabeçalho Principal */}
      <header className="header">
        <div className="header-content">
          <div className="logo-area">
            <div className="logo-icon">
              <Wallet size={24} />
            </div>
            <div className="logo-text">
              <h1>MeuFinanceiro</h1>
              <span>Controle Financeiro Pessoal</span>
            </div>
          </div>

          {/* Badge Indicador de Saúde do Backend */}
          <div className={`status-badge ${backendStatus}`} title={statusMessage}>
            <span className="status-dot"></span>
            <span>{statusMessage}</span>
          </div>
        </div>
      </header>

      {/* 2. Barra de Navegação por Abas */}
      <nav className="nav-tabs">
        <div className="nav-tabs-content">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'movimentacoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('movimentacoes')}
          >
            <ArrowLeftRight size={18} />
            Movimentações ({movimentacoes.length})
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'categorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('categorias')}
          >
            <Tags size={18} />
            Categorias ({categorias.length})
          </button>
        </div>
      </nav>

      {/* 3. Área de Conteúdo Dinâmico */}
      <main className="main-content">
        {/* Aviso caso o backend esteja desligado */}
        {backendStatus === 'offline' && (
          <div className="info-card" style={{ borderColor: 'var(--danger)', backgroundColor: '#fff5f5' }}>
            <div className="info-header" style={{ color: 'var(--danger)' }}>
              <AlertCircle size={20} />
              <h3 style={{ color: 'var(--danger)', fontSize: '1rem' }}>Servidor Backend não detectado</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Para ver e gerenciar os dados reais do banco PostgreSQL, certifique-se de que o backend esteja em execução:
              <br />
              <code style={{ marginTop: '0.5rem', display: 'inline-block' }}>cd backend; npm run dev</code>
            </p>
          </div>
        )}

        {/* ABA 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Barra de Período e Atualização */}
            <div className="period-bar">
              <div className="period-title">
                <h2>Visão Geral Financeira</h2>
                <p>Acompanhamento de receitas, despesas e saldo consolidado</p>
              </div>
              <button
                type="button"
                className="btn-refresh"
                onClick={carregarDados}
                disabled={loadingDados}
              >
                <RefreshCw size={16} className={loadingDados ? 'status-dot' : ''} />
                {loadingDados ? 'Atualizando...' : 'Atualizar Dados'}
              </button>
            </div>

            {/* Cards de Métricas Principais */}
            <div className="metrics-grid">
              {/* Card Receitas */}
              <div className="metric-card">
                <div className="metric-info">
                  <h3>Receitas</h3>
                  <div className="metric-value income">{formatarMoeda(resumo.totalReceitas)}</div>
                </div>
                <div className="metric-icon-box income">
                  <TrendingUp size={24} />
                </div>
              </div>

              {/* Card Despesas */}
              <div className="metric-card">
                <div className="metric-info">
                  <h3>Despesas</h3>
                  <div className="metric-value expense">{formatarMoeda(resumo.totalDespesas)}</div>
                </div>
                <div className="metric-icon-box expense">
                  <TrendingDown size={24} />
                </div>
              </div>

              {/* Card Saldo Líquido */}
              <div className="metric-card">
                <div className="metric-info">
                  <h3>Saldo Atual</h3>
                  <div className={`metric-value ${resumo.saldo >= 0 ? 'positive' : 'negative'}`}>
                    {formatarMoeda(resumo.saldo)}
                  </div>
                </div>
                <div className="metric-icon-box balance">
                  <Wallet size={24} />
                </div>
              </div>
            </div>

            {/* Painéis Inferiores */}
            <div className="dashboard-grid">
              {/* Despesas por Categoria */}
              <div className="panel-card">
                <div className="panel-header">
                  <h3>
                    <Tags size={18} color="var(--primary)" />
                    Despesas por Categoria
                  </h3>
                </div>

                {resumo.despesasPorCategoria && resumo.despesasPorCategoria.length > 0 ? (
                  <div className="categories-list">
                    {resumo.despesasPorCategoria.map((cat) => (
                      <div key={cat.categoriaId} className="category-item">
                        <div className="category-row">
                          <span className="category-label">
                            <span
                              className="color-dot"
                              style={{ backgroundColor: cat.cor || 'var(--primary)' }}
                            ></span>
                            {cat.nome}
                          </span>
                          <div className="category-amounts">
                            <span>{formatarMoeda(cat.total)}</span>
                            <span className="category-percentage">{cat.percentual}%</span>
                          </div>
                        </div>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${cat.percentual}%`,
                              backgroundColor: cat.cor || 'var(--primary)',
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Nenhuma despesa registrada para o período selecionado.</p>
                  </div>
                )}
              </div>

              {/* Últimas Movimentações */}
              <div className="panel-card">
                <div className="panel-header">
                  <h3>
                    <ArrowLeftRight size={18} color="var(--primary)" />
                    Movimentações Recentes
                  </h3>
                </div>

                {resumo.movimentacoesRecentes && resumo.movimentacoesRecentes.length > 0 ? (
                  <div className="transactions-list">
                    {resumo.movimentacoesRecentes.map((mov) => {
                      const isReceita = mov.tipo === 'RECEITA';
                      return (
                        <div key={mov.id} className="transaction-item">
                          <div className="transaction-left">
                            <div className={`transaction-icon ${isReceita ? 'income' : 'expense'}`}>
                              {isReceita ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            </div>
                            <div className="transaction-details">
                              <span className="transaction-desc">{mov.descricao}</span>
                              <div className="transaction-meta">
                                <span>{formatarData(mov.data)}</span>
                                {mov.categoria && (
                                  <span className="category-pill">
                                    <span
                                      className="color-dot"
                                      style={{ backgroundColor: mov.categoria.cor || '#718096' }}
                                    ></span>
                                    {mov.categoria.nome}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className={`transaction-amount ${isReceita ? 'income' : 'expense'}`}>
                            {isReceita ? '+' : '-'} {formatarMoeda(mov.valor)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Nenhuma movimentação registrada até o momento.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: MOVIMENTAÇÕES */}
        {activeTab === 'movimentacoes' && (
          <div>
            <div className="info-card">
              <div className="info-header">
                <ArrowLeftRight size={22} color="var(--primary)" />
                <h3>Histórico de Movimentações</h3>
                <span className="badge-tag">{movimentacoes.length} Lançamentos</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Visualização das movimentações sincronizadas em tempo real com o PostgreSQL via Prisma ORM. O modal de novo lançamento, filtros avançados e edição por linha serão implementados na <strong>Tarefa 4.2</strong>.
              </p>
            </div>

            {movimentacoes && movimentacoes.length > 0 ? (
              <div className="panel-card">
                <div className="transactions-list">
                  {movimentacoes.map((mov) => {
                    const isReceita = mov.tipo === 'RECEITA';
                    return (
                      <div key={mov.id} className="transaction-item">
                        <div className="transaction-left">
                          <div className={`transaction-icon ${isReceita ? 'income' : 'expense'}`}>
                            {isReceita ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          </div>
                          <div className="transaction-details">
                            <span className="transaction-desc">{mov.descricao}</span>
                            <div className="transaction-meta">
                              <span>{formatarData(mov.data)}</span>
                              {mov.categoria && (
                                <span className="category-pill">
                                  <span
                                    className="color-dot"
                                    style={{ backgroundColor: mov.categoria.cor || '#718096' }}
                                  ></span>
                                  {mov.categoria.nome}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`transaction-amount ${isReceita ? 'income' : 'expense'}`}>
                          {isReceita ? '+' : '-'} {formatarMoeda(mov.valor)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="panel-card">
                <div className="empty-state">
                  <p>Nenhuma movimentação cadastrada até o momento.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABA 3: CATEGORIAS (INTERATIVAS - TAREFA 4.1) */}
        {activeTab === 'categorias' && (
          <div>
            {/* Banner de Feedback (Sucesso / Erro com Trava de Integridade) */}
            {feedbackMensagem && (
              <div className={`feedback-alert ${feedbackMensagem.tipo}`}>
                <div className="feedback-alert-content">
                  {feedbackMensagem.tipo === 'error' ? (
                    <AlertTriangle size={18} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  <span>{feedbackMensagem.texto}</span>
                </div>
                <button
                  type="button"
                  className="feedback-close"
                  onClick={() => setFeedbackMensagem(null)}
                  title="Fechar"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Barra de Ações: Filtros por Tipo e Botão Nova Categoria */}
            <div className="section-toolbar">
              <div className="filter-group">
                <button
                  type="button"
                  className={`filter-btn ${filtroTipoCategoria === 'TODOS' ? 'active' : ''}`}
                  onClick={() => setFiltroTipoCategoria('TODOS')}
                >
                  Todas ({categorias.length})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filtroTipoCategoria === 'DESPESA' ? 'active' : ''}`}
                  onClick={() => setFiltroTipoCategoria('DESPESA')}
                >
                  Despesas ({categorias.filter((c) => c.tipo === 'DESPESA').length})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filtroTipoCategoria === 'RECEITA' ? 'active' : ''}`}
                  onClick={() => setFiltroTipoCategoria('RECEITA')}
                >
                  Receitas ({categorias.filter((c) => c.tipo === 'RECEITA').length})
                </button>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={abrirModalNovaCategoria}
              >
                <Plus size={18} />
                Nova Categoria
              </button>
            </div>

            {/* Grade de Cards de Categoria com Ações de Edição e Exclusão */}
            {categoriasFiltradas.length > 0 ? (
              <div className="categories-preview-grid">
                {categoriasFiltradas.map((cat) => (
                  <div
                    key={cat.id}
                    className="cat-card-interactive"
                    style={{ borderLeftColor: cat.cor || 'var(--primary)' }}
                  >
                    <div className="cat-card-left">
                      <span
                        className="color-dot"
                        style={{ backgroundColor: cat.cor || 'var(--primary)' }}
                      ></span>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>
                          {cat.nome}
                        </span>
                        <span className={`cat-type ${cat.tipo}`} style={{ marginTop: '0.2rem', display: 'inline-block' }}>
                          {cat.tipo}
                        </span>
                      </div>
                    </div>

                    <div className="cat-card-actions">
                      <button
                        type="button"
                        className="btn-icon edit"
                        title="Editar Categoria"
                        onClick={() => abrirModalEditarCategoria(cat)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon delete"
                        title="Excluir Categoria"
                        onClick={() => handleExcluirCategoria(cat)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="panel-card">
                <div className="empty-state">
                  <p>Nenhuma categoria encontrada com o filtro selecionado.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Criação / Edição de Categoria (Tarefa 4.1) */}
      {modalCategoriaAberto && (
        <div className="modal-overlay" onClick={fecharModalCategoria}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Tags size={20} color="var(--primary)" />
                {categoriaEmEdicao ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={fecharModalCategoria}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvarCategoria}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="cat-nome">Nome da Categoria *</label>
                  <input
                    id="cat-nome"
                    type="text"
                    className="form-control"
                    placeholder="Ex: Alimentação, Investimentos..."
                    value={formCategoria.nome}
                    onChange={(e) => setFormCategoria({ ...formCategoria, nome: e.target.value })}
                    maxLength={100}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cat-tipo">Tipo de Categoria *</label>
                  <select
                    id="cat-tipo"
                    className="form-control"
                    value={formCategoria.tipo}
                    onChange={(e) => {
                      const novoTipo = e.target.value;
                      setFormCategoria({
                        ...formCategoria,
                        tipo: novoTipo,
                        cor: novoTipo === 'RECEITA' && formCategoria.cor === '#E53E3E' ? '#38A169' : formCategoria.cor,
                      });
                    }}
                  >
                    <option value="DESPESA">Despesa (gastos/saídas)</option>
                    <option value="RECEITA">Receita (ganhos/entradas)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Cor de Identificação</label>
                  <div className="color-picker-wrapper">
                    <div className="color-swatches">
                      {PALETA_CORES.map((corItem) => (
                        <button
                          key={corItem}
                          type="button"
                          className={`color-swatch-btn ${formCategoria.cor === corItem ? 'selected' : ''}`}
                          style={{ backgroundColor: corItem }}
                          onClick={() => setFormCategoria({ ...formCategoria, cor: corItem })}
                          title={corItem}
                        />
                      ))}
                    </div>

                    <div className="custom-color-row">
                      <input
                        type="color"
                        className="input-color-native"
                        value={formCategoria.cor}
                        onChange={(e) => setFormCategoria({ ...formCategoria, cor: e.target.value.toUpperCase() })}
                        title="Escolha uma cor personalizada"
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {formCategoria.cor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={fecharModalCategoria}
                  disabled={salvandoCategoria}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={salvandoCategoria}
                >
                  {salvandoCategoria ? 'Salvando...' : categoriaEmEdicao ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Rodapé */}
      <footer className="footer">
        <p>
          <strong>MeuFinanceiro</strong> &bull; Laboratório de Programação (Ciência da Computação - Unifacvest) &bull; Equipe: Guilherme Buratto &amp; Jeferson Martins
        </p>
      </footer>
    </div>
  );
}

export default App;
