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
} from 'lucide-react';
import { obterStatus, dashboardService, categoriaService, movimentacaoService } from './services/api';
import './App.css';

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
      setResumo(resumoRes);

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
            Movimentações
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'categorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('categorias')}
          >
            <Tags size={18} />
            Categorias
          </button>
        </div>
      </nav>

      {/* 3. Área de Conteúdo Dinâmico */}
      <main className="main-content">
        {/* Aviso amigável caso o backend esteja desligado */}
        {backendStatus === 'offline' && (
          <div className="info-card" style={{ borderColor: 'var(--danger)', backgroundColor: '#fff5f5' }}>
            <div className="info-header" style={{ color: 'var(--danger)' }}>
              <AlertCircle size={20} />
              <h3 style={{ color: 'var(--danger)', fontSize: '1rem' }}>Servidor Backend não detectado</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Para ver os dados reais do banco PostgreSQL, certifique-se de que o backend esteja em execução no terminal:
              <br />
              <code style={{ marginTop: '0.5rem', display: 'inline-block' }}>cd backend; npm run dev</code>
            </p>
          </div>
        )}

        {/* ABA: DASHBOARD */}
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
                    <p>Nenhuma movimentação financeira encontrada.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ABA: MOVIMENTAÇÕES */}
        {activeTab === 'movimentacoes' && (
          <div>
            <div className="info-card">
              <div className="info-header">
                <ArrowLeftRight size={22} color="var(--primary)" />
                <h3>Histórico de Movimentações</h3>
                <span className="badge-tag">Conectado à API</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Visualização das movimentações sincronizadas em tempo real com o PostgreSQL via Prisma ORM. Os formulários completos de inclusão, edição e filtros interativos serão implementados na <strong>Etapa 4</strong>.
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

        {/* ABA: CATEGORIAS */}
        {activeTab === 'categorias' && (
          <div>
            <div className="info-card">
              <div className="info-header">
                <Tags size={22} color="var(--primary)" />
                <h3>Categorias do Sistema</h3>
                <span className="badge-tag">{categorias.length} Categorias</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Categorias cadastradas no banco de dados com suporte à diferenciação de tipo (Receitas e Despesas) e paleta de cores para gráficos. O formulário de inclusão/edição e validação de exclusão protegida com feedback amigável faz parte da <strong>Etapa 4</strong>.
              </p>

              <div className="categories-preview-grid">
                {categorias.map((cat) => (
                  <div
                    key={cat.id}
                    className="cat-card"
                    style={{ borderLeftColor: cat.cor || 'var(--primary)' }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cat.nome}</span>
                    <span className={`cat-type ${cat.tipo}`}>{cat.tipo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

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
