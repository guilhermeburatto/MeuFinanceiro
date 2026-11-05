import prisma from '../lib/prisma.js';

// Lista movimentações com filtros opcionais (tipo, categoriaId, dataInicio, dataFim)
export const listar = async (req, res) => {
  try {
    const { tipo, categoriaId, dataInicio, dataFim } = req.query;

    const where = {};

    // Filtro por tipo (RECEITA / DESPESA)
    if (tipo) {
      const tipoNormalizado = tipo.toUpperCase();
      if (!['RECEITA', 'DESPESA'].includes(tipoNormalizado)) {
        return res.status(400).json({ erro: 'O parâmetro tipo deve ser RECEITA ou DESPESA.' });
      }
      where.tipo = tipoNormalizado;
    }

    // Filtro por categoria
    if (categoriaId) {
      const catId = parseInt(categoriaId, 10);
      if (isNaN(catId)) {
        return res.status(400).json({ erro: 'O parâmetro categoriaId deve ser um número inteiro.' });
      }
      where.categoriaId = catId;
    }

    // Filtro por período de datas
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

    return res.json(movimentacoes);
  } catch (error) {
    console.error('Erro ao listar movimentações:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar movimentações.' });
  }
};

// Busca uma movimentação por ID
export const buscarPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const movimentacao = await prisma.movimentacao.findUnique({
      where: { id },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            cor: true
          }
        }
      }
    });

    if (!movimentacao) {
      return res.status(404).json({ erro: 'Movimentação não encontrada.' });
    }

    return res.json(movimentacao);
  } catch (error) {
    console.error('Erro ao buscar movimentação por ID:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar movimentação.' });
  }
};

// Cria uma nova movimentação (receita ou despesa)
export const criar = async (req, res) => {
  try {
    const { descricao, valor, data, tipo, categoriaId } = req.body;

    // Validação da descrição
    if (!descricao || typeof descricao !== 'string' || descricao.trim() === '') {
      return res.status(400).json({ erro: 'O campo descricao é obrigatório.' });
    }

    // Validação do valor (deve ser numérico e positivo)
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      return res.status(400).json({ erro: 'O campo valor deve ser um número maior que zero.' });
    }

    // Validação do tipo
    if (!tipo || !['RECEITA', 'DESPESA'].includes(tipo.toUpperCase())) {
      return res.status(400).json({ erro: 'O campo tipo é obrigatório e deve ser RECEITA ou DESPESA.' });
    }
    const tipoNormalizado = tipo.toUpperCase();

    // Validação da data
    if (!data) {
      return res.status(400).json({ erro: 'O campo data é obrigatório (ex: YYYY-MM-DD).' });
    }
    const dataFormatada = new Date(data);
    if (isNaN(dataFormatada.getTime())) {
      return res.status(400).json({ erro: 'Data inválida.' });
    }

    // Validação da categoria
    const catId = parseInt(categoriaId, 10);
    if (isNaN(catId)) {
      return res.status(400).json({ erro: 'O campo categoriaId deve ser um número inteiro válido.' });
    }

    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id: catId }
    });

    if (!categoriaExistente) {
      return res.status(404).json({ erro: 'A categoria informada não existe.' });
    }

    // Validação de coerência: o tipo da categoria deve bater com o tipo da movimentação
    if (categoriaExistente.tipo !== tipoNormalizado) {
      return res.status(400).json({
        erro: `Incoerência de tipos: a categoria "${categoriaExistente.nome}" é do tipo ${categoriaExistente.tipo}, mas a movimentação é do tipo ${tipoNormalizado}.`
      });
    }

    const novaMovimentacao = await prisma.movimentacao.create({
      data: {
        descricao: descricao.trim(),
        valor: valorNumerico,
        data: dataFormatada,
        tipo: tipoNormalizado,
        categoriaId: catId
      },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            cor: true
          }
        }
      }
    });

    return res.status(201).json(novaMovimentacao);
  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    return res.status(500).json({ erro: 'Erro interno ao criar movimentação.' });
  }
};

// Atualiza uma movimentação existente
export const atualizar = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const { descricao, valor, data, tipo, categoriaId } = req.body;

    const movimentacaoExistente = await prisma.movimentacao.findUnique({
      where: { id }
    });

    if (!movimentacaoExistente) {
      return res.status(404).json({ erro: 'Movimentação não encontrada.' });
    }

    const dadosAtualizacao = {};

    if (descricao !== undefined) {
      if (typeof descricao !== 'string' || descricao.trim() === '') {
        return res.status(400).json({ erro: 'A descrição não pode ser vazia.' });
      }
      dadosAtualizacao.descricao = descricao.trim();
    }

    if (valor !== undefined) {
      const valorNum = parseFloat(valor);
      if (isNaN(valorNum) || valorNum <= 0) {
        return res.status(400).json({ erro: 'O valor deve ser um número positivo.' });
      }
      dadosAtualizacao.valor = valorNum;
    }

    if (data !== undefined) {
      const dataObj = new Date(data);
      if (isNaN(dataObj.getTime())) {
        return res.status(400).json({ erro: 'Data inválida.' });
      }
      dadosAtualizacao.data = dataObj;
    }

    let tipoFinal = movimentacaoExistente.tipo;
    if (tipo !== undefined) {
      const tipoNorm = tipo.toUpperCase();
      if (!['RECEITA', 'DESPESA'].includes(tipoNorm)) {
        return res.status(400).json({ erro: 'O tipo deve ser RECEITA ou DESPESA.' });
      }
      tipoFinal = tipoNorm;
      dadosAtualizacao.tipo = tipoNorm;
    }

    let categoriaIdFinal = movimentacaoExistente.categoriaId;
    if (categoriaId !== undefined) {
      const catId = parseInt(categoriaId, 10);
      if (isNaN(catId)) {
        return res.status(400).json({ erro: 'O categoriaId deve ser um número válido.' });
      }
      categoriaIdFinal = catId;
      dadosAtualizacao.categoriaId = catId;
    }

    // Se categoria ou tipo foram alterados, valida existência e coerência
    if (categoriaId !== undefined || tipo !== undefined) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: categoriaIdFinal }
      });
      if (!categoria) {
        return res.status(404).json({ erro: 'A categoria informada não existe.' });
      }
      if (categoria.tipo !== tipoFinal) {
        return res.status(400).json({
          erro: `Incoerência de tipos: a categoria "${categoria.nome}" é do tipo ${categoria.tipo}, mas a movimentação é do tipo ${tipoFinal}.`
        });
      }
    }

    const movimentacaoAtualizada = await prisma.movimentacao.update({
      where: { id },
      data: dadosAtualizacao,
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            cor: true
          }
        }
      }
    });

    return res.json(movimentacaoAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar movimentação:', error);
    return res.status(500).json({ erro: 'Erro interno ao atualizar movimentação.' });
  }
};

// Exclui uma movimentação
export const excluir = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const movimentacao = await prisma.movimentacao.findUnique({
      where: { id }
    });

    if (!movimentacao) {
      return res.status(404).json({ erro: 'Movimentação não encontrada.' });
    }

    await prisma.movimentacao.delete({
      where: { id }
    });

    return res.json({ mensagem: 'Movimentação excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir movimentação:', error);
    return res.status(500).json({ erro: 'Erro interno ao excluir movimentação.' });
  }
};
