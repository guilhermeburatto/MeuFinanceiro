/**
 * Módulo de Integração HTTP com a API REST do MeuFinanceiro
 * Utiliza a Fetch API nativa moderna com tratamento padronizado de erros e respostas JSON.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Helper genérico para requisições HTTP com tratamento de erros
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Se a resposta não tiver conteúdo (ex: 204 No Content)
    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.erro || data?.mensagem || `Erro na requisição (HTTP ${response.status})`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    // Erros de conexão de rede ou servidor offline
    const networkError = new Error('Não foi possível conectar ao servidor backend. Verifique se o backend está em execução na porta 3000.');
    networkError.status = 0;
    networkError.originalError = error;
    throw networkError;
  }
}

/**
 * Serviços da API
 */

// 1. Diagnóstico do Servidor
export async function obterStatus() {
  return request('/status');
}

// 2. Dashboard Analítico
export const dashboardService = {
  /**
   * Obtém o resumo financeiro com totais, saldo e distribuição por categoria
   * @param {Object} params - { dataInicio, dataFim }
   */
  async obterResumo(params = {}) {
    const query = new URLSearchParams();
    if (params.dataInicio) query.append('dataInicio', params.dataInicio);
    if (params.dataFim) query.append('dataFim', params.dataFim);

    const queryString = query.toString();
    const endpoint = queryString ? `/dashboard/resumo?${queryString}` : '/dashboard/resumo';
    return request(endpoint);
  },
};

// 3. Gestão de Categorias
export const categoriaService = {
  /**
   * Lista categorias cadastradas, com filtro opcional por tipo (RECEITA / DESPESA)
   */
  async listar(tipo) {
    const endpoint = tipo ? `/categorias?tipo=${encodeURIComponent(tipo)}` : '/categorias';
    return request(endpoint);
  },

  async buscarPorId(id) {
    return request(`/categorias/${id}`);
  },

  async criar(dados) {
    return request('/categorias', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  async atualizar(id, dados) {
    return request(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  async excluir(id) {
    return request(`/categorias/${id}`, {
      method: 'DELETE',
    });
  },
};

// 4. Gestão de Movimentações (Receitas e Despesas)
export const movimentacaoService = {
  /**
   * Lista movimentações com suporte a filtros combináveis
   * @param {Object} filtros - { tipo, categoriaId, dataInicio, dataFim }
   */
  async listar(filtros = {}) {
    const query = new URLSearchParams();
    if (filtros.tipo) query.append('tipo', filtros.tipo);
    if (filtros.categoriaId) query.append('categoriaId', filtros.categoriaId);
    if (filtros.dataInicio) query.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) query.append('dataFim', filtros.dataFim);

    const queryString = query.toString();
    const endpoint = queryString ? `/movimentacoes?${queryString}` : '/movimentacoes';
    return request(endpoint);
  },

  async buscarPorId(id) {
    return request(`/movimentacoes/${id}`);
  },

  async criar(dados) {
    return request('/movimentacoes', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },

  async atualizar(id, dados) {
    return request(`/movimentacoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  },

  async excluir(id) {
    return request(`/movimentacoes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  obterStatus,
  dashboard: dashboardService,
  categorias: categoriaService,
  movimentacoes: movimentacaoService,
};
