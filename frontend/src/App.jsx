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
  Filter,
  RotateCcw,
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

  // Estados de Feedback (Alertas na interface)
  const [feedbackMensagem, setFeedbackMensagem] = useState(null);

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

  // Estados de Gerenciamento de Movimentações (Tarefa 4.2)
  const [modalMovimentacaoAberto, setModalMovimentacaoAberto] = useState(false);
  const [movimentacaoEmEdicao, setMovimentacaoEmEdicao] = useState(null);
  const [formMovimentacao, setFormMovimentacao] = useState({
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    tipo: 'DESPESA',
    categoriaId: '',
  });
  const [salvandoMovimentacao, setSalvandoMovimentacao] = useState(false);

  // Filtros Avançados de Movimentações
  const [filtroTipoMovimentacao, setFiltroTipoMovimentacao] = useState('TODOS');
  const [filtroCategoriaMovimentacao, setFiltroCategoriaMovimentacao] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');

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
        const nova = await categoriaService.criar({
          nome: formCategoria.nome.trim(),
          tipo: formCategoria.tipo,
          cor: formCategoria.cor,
        });

        setCategorias((anteriores) => [...anteriores, nova].sort((a, b) => a.nome.localeCompare(b.nome)));
        exibirFeedback('success', `Categoria "${nova.nome}" criada com sucesso!`);
      }

      fecharModalCategoria();
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
      exibirFeedback('error', err.message);
    }
  };

  const categoriasFiltradas = categorias.filter((c) => {
    if (filtroTipoCategoria === 'TODOS') return true;
    return c.tipo === filtroTipoCategoria;
  });

  // --- Funções de Ação de Movimentações (Tarefa 4.2) ---

  const abrirModalNovaMovimentacao = () => {
    setMovimentacaoEmEdicao(null);
    // Seleciona por padrão a primeira categoria de despesa disponível
    const primeiraDespesa = categorias.find((c) => c.tipo === 'DESPESA');
    setFormMovimentacao({
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      tipo: 'DESPESA',
      categoriaId: primeiraDespesa ? String(primeiraDespesa.id) : '',
    });
    setModalMovimentacaoAberto(true);
  };

  const abrirModalEditarMovimentacao = (mov) => {
    setMovimentacaoEmEdicao(mov);
    setFormMovimentacao({
      descricao: mov.descricao,
      valor: String(mov.valor),
      data: mov.data.split('T')[0],
      tipo: mov.tipo,
      categoriaId: String(mov.categoriaId),
    });
    setModalMovimentacaoAberto(true);
  };

  const fecharModalMovimentacao = () => {
    setModalMovimentacaoAberto(false);
    setMovimentacaoEmEdicao(null);
  };

  // Ao trocar o tipo no modal, ajusta automaticamente a categoria para uma compatível
  const handleTrocarTipoMovimentacao = (novoTipo) => {
    const categoriasCompativeis = categorias.filter((c) => c.tipo === novoTipo);
    const categoriaAtualAindaValida = categoriasCompativeis.some(
      (c) => String(c.id) === String(formMovimentacao.categoriaId)
    );

    setFormMovimentacao({
      ...formMovimentacao,
      tipo: novoTipo,
      categoriaId: categoriaAtualAindaValida
        ? formMovimentacao.categoriaId
        : categoriasCompativeis.length > 0
        ? String(categoriasCompativeis[0].id)
        : '',
    });
  };

  const handleSalvarMovimentacao = async (e) => {
    e.preventDefault();
    if (!formMovimentacao.descricao.trim()) {
      exibirFeedback('error', 'A descrição do lançamento é obrigatória.');
      return;
    }

    const valorNum = parseFloat(formMovimentacao.valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      exibirFeedback('error', 'O valor deve ser um número maior que zero.');
      return;
    }

    if (!formMovimentacao.data) {
      exibirFeedback('error', 'A data é obrigatória.');
      return;
    }

    if (!formMovimentacao.categoriaId) {
      exibirFeedback('error', 'Selecione uma categoria compatível.');
      return;
    }

    setSalvandoMovimentacao(true);
    try {
      const payload = {
        descricao: formMovimentacao.descricao.trim(),
        valor: valorNum,
        data: formMovimentacao.data,
        tipo: formMovimentacao.tipo,
        categoriaId: parseInt(formMovimentacao.categoriaId, 10),
      };

      if (movimentacaoEmEdicao) {
        const atualizada = await movimentacaoService.atualizar(movimentacaoEmEdicao.id, payload);
        setMovimentacoes((anteriores) =>
          anteriores.map((m) => (m.id === atualizada.id ? atualizada : m))
        );
        exibirFeedback('success', `Lançamento "${atualizada.descricao}" atualizado com sucesso!`);
      } else {
        const nova = await movimentacaoService.criar(payload);
        setMovimentacoes((anteriores) => [nova, ...anteriores]);
        exibirFeedback('success', `Lançamento "${nova.descricao}" registrado com sucesso!`);
      }

      fecharModalMovimentacao();
      carregarDados();
    } catch (err) {
      exibirFeedback('error', err.message || 'Falha ao salvar o lançamento.');
    } finally {
      setSalvandoMovimentacao(false);
    }
  };

  const handleExcluirMovimentacao = async (mov) => {
    const confirmar = window.confirm(
      `Deseja realmente excluir o lançamento "${mov.descricao}" de ${formatarMoeda(mov.valor)}?`
    );
    if (!confirmar) return;

    try {
      await movimentacaoService.excluir(mov.id);
      setMovimentacoes((anteriores) => anteriores.filter((m) => m.id !== mov.id));
      exibirFeedback('success', `Lançamento "${mov.descricao}" excluído com sucesso!`);
      carregarDados();
    } catch (err) {
      exibirFeedback('error', err.message || 'Falha ao excluir lançamento.');
    }
  };

  const limparFiltrosMovimentacao = () => {
    setFiltroTipoMovimentacao('TODOS');
    setFiltroCategoriaMovimentacao('');
    setFiltroDataInicio('');
    setFiltroDataFim('');
  };

  // Filtragem dinâmica de movimentações
  const movimentacoesFiltradas = movimentacoes.filter((mov) => {
    // Filtro por tipo
    if (filtroTipoMovimentacao !== 'TODOS' && mov.tipo !== filtroTipoMovimentacao) {
      return false;
    }
    // Filtro por categoria
    if (filtroCategoriaMovimentacao && String(mov.categoriaId) !== String(filtroCategoriaMovimentacao)) {
      return false;
    }
    // Filtro por data início
    const dataMov = mov.data.split('T')[0];
    if (filtroDataInicio && dataMov < filtroDataInicio) {
      return false;
    }
    // Filtro por data fim
    if (filtroDataFim && dataMov > filtroDataFim) {
      return false;
    }
    return true;
  });

  // Cálculos consolidados da seleção filtrada
  const totalFiltradoReceitas = movimentacoesFiltradas
    .filter((m) => m.tipo === 'RECEITA')
    .reduce((acc, m) => acc + Number(m.valor), 0);

  const totalFiltradoDespesas = movimentacoesFiltradas
    .filter((m) => m.tipo === 'DESPESA')
    .reduce((acc, m) => acc + Number(m.valor), 0);

  const temFiltroAtivo =
    filtroTipoMovimentacao !== 'TODOS' ||
    filtroCategoriaMovimentacao !== '' ||
    filtroDataInicio !== '' ||
    filtroDataFim !== '';

  // Categorias compatíveis com o tipo selecionado no formulário modal
  const categoriasDoTipoSelecionado = categorias.filter(
    (c) => c.tipo === formMovimentacao.tipo
  );

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

        {/* ABA 2: MOVIMENTAÇÕES (INTERATIVAS - TAREFA 4.2) */}
        {activeTab === 'movimentacoes' && (
          <div>
            {/* Banner de Feedback (Sucesso / Erro) */}
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

            {/* Barra de Ações Superior */}
            <div className="section-toolbar">
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Gerenciamento de Lançamentos
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Registre, filtre e acompanhe todas as suas receitas e despesas
                </p>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={abrirModalNovaMovimentacao}
              >
                <Plus size={18} />
                Novo Lançamento
              </button>
            </div>

            {/* Barra de Filtros Avançados */}
            <div className="filter-bar-advanced">
              <div className="filter-row">
                {/* Filtro por Tipo */}
                <div className="filter-group">
                  <button
                    type="button"
                    className={`filter-btn ${filtroTipoMovimentacao === 'TODOS' ? 'active' : ''}`}
                    onClick={() => setFiltroTipoMovimentacao('TODOS')}
                  >
                    Todas ({movimentacoes.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${filtroTipoMovimentacao === 'DESPESA' ? 'active' : ''}`}
                    onClick={() => setFiltroTipoMovimentacao('DESPESA')}
                  >
                    Despesas ({movimentacoes.filter((m) => m.tipo === 'DESPESA').length})
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${filtroTipoMovimentacao === 'RECEITA' ? 'active' : ''}`}
                    onClick={() => setFiltroTipoMovimentacao('RECEITA')}
                  >
                    Receitas ({movimentacoes.filter((m) => m.tipo === 'RECEITA').length})
                  </button>
                </div>

                {/* Filtro por Categoria */}
                <div className="filter-item">
                  <label htmlFor="filter-cat">Categoria:</label>
                  <select
                    id="filter-cat"
                    className="filter-select"
                    value={filtroCategoriaMovimentacao}
                    onChange={(e) => setFiltroCategoriaMovimentacao(e.target.value)}
                  >
                    <option value="">Todas as categorias</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        [{cat.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}] {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Período De / Até */}
                <div className="filter-item">
                  <label htmlFor="filter-inicio">De:</label>
                  <input
                    id="filter-inicio"
                    type="date"
                    className="filter-date-input"
                    value={filtroDataInicio}
                    onChange={(e) => setFiltroDataInicio(e.target.value)}
                  />
                </div>

                <div className="filter-item">
                  <label htmlFor="filter-fim">Até:</label>
                  <input
                    id="filter-fim"
                    type="date"
                    className="filter-date-input"
                    value={filtroDataFim}
                    onChange={(e) => setFiltroDataFim(e.target.value)}
                  />
                </div>

                {/* Botão para Limpar Filtros */}
                {temFiltroAtivo && (
                  <button
                    type="button"
                    className="btn-clear-filters"
                    onClick={limparFiltrosMovimentacao}
                    title="Redefinir todos os filtros"
                  >
                    <RotateCcw size={14} />
                    Limpar Filtros
                  </button>
                )}
              </div>

              {/* Linha de Resumo Consolidado do Filtro */}
              <div className="filter-summary-bar">
                <span>
                  Exibindo <strong>{movimentacoesFiltradas.length}</strong> de {movimentacoes.length} lançamentos
                </span>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span>
                    Receitas: <strong style={{ color: 'var(--success)' }}>+{formatarMoeda(totalFiltradoReceitas)}</strong>
                  </span>
                  <span>
                    Despesas: <strong style={{ color: 'var(--danger)' }}>-{formatarMoeda(totalFiltradoDespesas)}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Tabela / Lista de Lançamentos Interativa */}
            {movimentacoesFiltradas.length > 0 ? (
              <div className="panel-card">
                <div className="transactions-list">
                  {movimentacoesFiltradas.map((mov) => {
                    const isReceita = mov.tipo === 'RECEITA';
                    return (
                      <div key={mov.id} className="transaction-item">
                        <div className="transaction-left">
                          <div className={`transaction-icon ${isReceita ? 'income' : 'expense'}`}>
                            {isReceita ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          </div>
                          <div className="transaction-details">
                            <span className="transaction-desc" style={{ fontSize: '0.95rem' }}>
                              {mov.descricao}
                            </span>
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

                        <div className="transaction-right">
                          <div className={`transaction-amount ${isReceita ? 'income' : 'expense'}`}>
                            {isReceita ? '+' : '-'} {formatarMoeda(mov.valor)}
                          </div>

                          <div className="transaction-actions">
                            <button
                              type="button"
                              className="btn-icon edit"
                              title="Editar Lançamento"
                              onClick={() => abrirModalEditarMovimentacao(mov)}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              className="btn-icon delete"
                              title="Excluir Lançamento"
                              onClick={() => handleExcluirMovimentacao(mov)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="panel-card">
                <div className="empty-state">
                  <p>Nenhuma movimentação encontrada com os filtros selecionados.</p>
                  {temFiltroAtivo && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ marginTop: '0.75rem' }}
                      onClick={limparFiltrosMovimentacao}
                    >
                      <RotateCcw size={14} />
                      Limpar Filtros
                    </button>
                  )}
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

      {/* Modal de Criação / Edição de Movimentação (Tarefa 4.2) */}
      {modalMovimentacaoAberto && (
        <div className="modal-overlay" onClick={fecharModalMovimentacao}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <ArrowLeftRight size={20} color="var(--primary)" />
                {movimentacaoEmEdicao ? 'Editar Lançamento' : 'Novo Lançamento'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={fecharModalMovimentacao}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvarMovimentacao}>
              <div className="modal-body">
                {/* Seletor de Tipo (Despesa ou Receita) */}
                <div className="type-toggle-group">
                  <button
                    type="button"
                    className={`type-toggle-btn ${formMovimentacao.tipo === 'DESPESA' ? 'selected-despesa' : ''}`}
                    onClick={() => handleTrocarTipoMovimentacao('DESPESA')}
                  >
                    <TrendingDown size={18} />
                    Despesa
                  </button>
                  <button
                    type="button"
                    className={`type-toggle-btn ${formMovimentacao.tipo === 'RECEITA' ? 'selected-receita' : ''}`}
                    onClick={() => handleTrocarTipoMovimentacao('RECEITA')}
                  >
                    <TrendingUp size={18} />
                    Receita
                  </button>
                </div>

                {/* Campo Descrição */}
                <div className="form-group">
                  <label htmlFor="mov-desc">Descrição *</label>
                  <input
                    id="mov-desc"
                    type="text"
                    className="form-control"
                    placeholder={
                      formMovimentacao.tipo === 'DESPESA'
                        ? 'Ex: Supermercado, Gasolina, Aluguel...'
                        : 'Ex: Salário, Rendimentos, Freelance...'
                    }
                    value={formMovimentacao.descricao}
                    onChange={(e) =>
                      setFormMovimentacao({ ...formMovimentacao, descricao: e.target.value })
                    }
                    maxLength={255}
                    required
                    autoFocus
                  />
                </div>

                {/* Grid de Valor e Data lado a lado */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label htmlFor="mov-valor">Valor (R$) *</label>
                    <input
                      id="mov-valor"
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="form-control"
                      placeholder="0,00"
                      value={formMovimentacao.valor}
                      onChange={(e) =>
                        setFormMovimentacao({ ...formMovimentacao, valor: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="mov-data">Data *</label>
                    <input
                      id="mov-data"
                      type="date"
                      className="form-control"
                      value={formMovimentacao.data}
                      onChange={(e) =>
                        setFormMovimentacao({ ...formMovimentacao, data: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Campo Categoria (Filtrado pelo Tipo Selecionado) */}
                <div className="form-group">
                  <label htmlFor="mov-cat">
                    Categoria ({formMovimentacao.tipo === 'DESPESA' ? 'Despesas' : 'Receitas'}) *
                  </label>
                  <select
                    id="mov-cat"
                    className="form-control"
                    value={formMovimentacao.categoriaId}
                    onChange={(e) =>
                      setFormMovimentacao({ ...formMovimentacao, categoriaId: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Selecione uma categoria...
                    </option>
                    {categoriasDoTipoSelecionado.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                  {categoriasDoTipoSelecionado.length === 0 && (
                    <small style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>
                      Nenhuma categoria de {formMovimentacao.tipo.toLowerCase()} cadastrada. Cadastre uma categoria primeiro na aba Categorias.
                    </small>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={fecharModalMovimentacao}
                  disabled={salvandoMovimentacao}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={salvandoMovimentacao || !formMovimentacao.categoriaId}
                >
                  {salvandoMovimentacao
                    ? 'Salvando...'
                    : movimentacaoEmEdicao
                    ? 'Salvar Alterações'
                    : 'Registrar Lançamento'}
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
