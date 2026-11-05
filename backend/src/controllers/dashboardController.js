import prisma from '../lib/prisma.js';

// Retorna o resumo financeiro consolidado do período selecionado
export const obterResumo = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;

    const where = {};

    // Filtro por período se informado
    if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) {
        const dInicio = new Date(dataInicio);
        if (isNaN(dInicio.getTime())) {
          return res.status(400).json({ erro: 'O parâmetro dataInicio deve ser uma data válida (ex: YYYY-MM-DD).' });
        }
        where.data.gte = dInicio;
      }
      if (dataFim) {
        const dFim = new Date(dataFim);
        if (isNaN(dFim.getTime())) {
          return res.status(400).json({ erro: 'O parâmetro dataFim deve ser uma data válida (ex: YYYY-MM-DD).' });
        }
        where.data.lte = dFim;
      }
    }

    // Busca todas as movimentações do período incluindo dados da categoria
    const movimentacoes = await prisma.movimentacao.findMany({
      where,
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            cor: true
          }
        }
      },
      orderBy: { data: 'desc' }
    });

    let totalReceitas = 0;
    let totalDespesas = 0;

    // Agrupamento de despesas por categoria
    const mapaDespesasPorCategoria = {};
    // Agrupamento de receitas por categoria
    const mapaReceitasPorCategoria = {};

    for (const mov of movimentacoes) {
      const valor = Number(mov.valor);

      if (mov.tipo === 'RECEITA') {
        totalReceitas += valor;

        const catId = mov.categoriaId;
        if (!mapaReceitasPorCategoria[catId]) {
          mapaReceitasPorCategoria[catId] = {
            categoriaId: catId,
            nome: mov.categoria.nome,
            cor: mov.categoria.cor || '#38A169',
            total: 0
          };
        }
        mapaReceitasPorCategoria[catId].total += valor;
      } else if (mov.tipo === 'DESPESA') {
        totalDespesas += valor;

        const catId = mov.categoriaId;
        if (!mapaDespesasPorCategoria[catId]) {
          mapaDespesasPorCategoria[catId] = {
            categoriaId: catId,
            nome: mov.categoria.nome,
            cor: mov.categoria.cor || '#E53E3E',
            total: 0
          };
        }
        mapaDespesasPorCategoria[catId].total += valor;
      }
    }

    // Formata a distribuição de despesas por categoria com percentuais
    const despesasPorCategoria = Object.values(mapaDespesasPorCategoria)
      .map((item) => ({
        ...item,
        total: Number(item.total.toFixed(2)),
        percentual: totalDespesas > 0 ? Number(((item.total / totalDespesas) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.total - a.total);

    // Formata a distribuição de receitas por categoria com percentuais
    const receitasPorCategoria = Object.values(mapaReceitasPorCategoria)
      .map((item) => ({
        ...item,
        total: Number(item.total.toFixed(2)),
        percentual: totalReceitas > 0 ? Number(((item.total / totalReceitas) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.total - a.total);

    const saldo = Number((totalReceitas - totalDespesas).toFixed(2));

    // Seleciona as últimas 5 movimentações do período para exibição rápida
    const ultimasMovimentacoes = movimentacoes.slice(0, 5);

    return res.json({
      periodo: {
        dataInicio: dataInicio || null,
        dataFim: dataFim || null
      },
      totais: {
        receitas: Number(totalReceitas.toFixed(2)),
        despesas: Number(totalDespesas.toFixed(2)),
        saldo,
        quantidadeMovimentacoes: movimentacoes.length
      },
      despesasPorCategoria,
      receitasPorCategoria,
      ultimasMovimentacoes
    });
  } catch (error) {
    console.error('Erro ao gerar resumo do dashboard:', error);
    return res.status(500).json({ erro: 'Erro interno ao processar dados do dashboard.' });
  }
};
