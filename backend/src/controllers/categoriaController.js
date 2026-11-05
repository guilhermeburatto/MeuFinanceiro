import prisma from '../lib/prisma.js';

// Lista todas as categorias, com suporte a filtro opcional por tipo (?tipo=RECEITA ou ?tipo=DESPESA)
export const listar = async (req, res) => {
  try {
    const { tipo } = req.query;

    const where = {};
    if (tipo) {
      const tipoNormalizado = tipo.toUpperCase();
      if (!['RECEITA', 'DESPESA'].includes(tipoNormalizado)) {
        return res.status(400).json({
          erro: 'O parâmetro tipo deve ser RECEITA ou DESPESA.'
        });
      }
      where.tipo = tipoNormalizado;
    }

    const categorias = await prisma.categoria.findMany({
      where,
      orderBy: { nome: 'asc' }
    });

    return res.json(categorias);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar categorias.' });
  }
};

// Busca uma categoria específica por ID
export const buscarPorId = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const categoria = await prisma.categoria.findUnique({
      where: { id }
    });

    if (!categoria) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }

    return res.json(categoria);
  } catch (error) {
    console.error('Erro ao buscar categoria por ID:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar categoria.' });
  }
};

// Cria uma nova categoria
export const criar = async (req, res) => {
  try {
    const { nome, tipo, cor } = req.body;

    // Validações de campos obrigatórios
    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
      return res.status(400).json({ erro: 'O campo nome é obrigatório.' });
    }

    if (!tipo || !['RECEITA', 'DESPESA'].includes(tipo.toUpperCase())) {
      return res.status(400).json({ erro: 'O campo tipo é obrigatório e deve ser RECEITA ou DESPESA.' });
    }

    // Validação opcional de formato de cor hexadecimal (ex: #FFFFFF)
    let corFormatada = cor;
    if (cor) {
      const regexCorHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!regexCorHex.test(cor)) {
        return res.status(400).json({ erro: 'A cor deve estar no formato hexadecimal válido (ex: #E53E3E).' });
      }
      corFormatada = cor.toUpperCase();
    }

    const novaCategoria = await prisma.categoria.create({
      data: {
        nome: nome.trim(),
        tipo: tipo.toUpperCase(),
        cor: corFormatada || null
      }
    });

    return res.status(201).json(novaCategoria);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ erro: 'Erro interno ao criar categoria.' });
  }
};

// Atualiza uma categoria existente
export const atualizar = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const { nome, tipo, cor } = req.body;

    // Verifica se a categoria existe
    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id }
    });

    if (!categoriaExistente) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }

    const dadosAtualizacao = {};

    if (nome !== undefined) {
      if (typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ erro: 'O nome não pode ser vazio.' });
      }
      dadosAtualizacao.nome = nome.trim();
    }

    if (tipo !== undefined) {
      const tipoNormalizado = tipo.toUpperCase();
      if (!['RECEITA', 'DESPESA'].includes(tipoNormalizado)) {
        return res.status(400).json({ erro: 'O tipo deve ser RECEITA ou DESPESA.' });
      }
      dadosAtualizacao.tipo = tipoNormalizado;
    }

    if (cor !== undefined) {
      if (cor !== null && cor !== '') {
        const regexCorHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!regexCorHex.test(cor)) {
          return res.status(400).json({ erro: 'A cor deve estar no formato hexadecimal válido (ex: #E53E3E).' });
        }
        dadosAtualizacao.cor = cor.toUpperCase();
      } else {
        dadosAtualizacao.cor = null;
      }
    }

    const categoriaAtualizada = await prisma.categoria.update({
      where: { id },
      data: dadosAtualizacao
    });

    return res.json(categoriaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ erro: 'Erro interno ao atualizar categoria.' });
  }
};

// Exclui uma categoria, respeitando o bloqueio de integridade se houver movimentações
export const excluir = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const categoria = await prisma.categoria.findUnique({
      where: { id }
    });

    if (!categoria) {
      return res.status(404).json({ erro: 'Categoria não encontrada.' });
    }

    // Regra de integridade: checar se existem movimentações associadas a esta categoria
    const totalMovimentacoes = await prisma.movimentacao.count({
      where: { categoriaId: id }
    });

    if (totalMovimentacoes > 0) {
      return res.status(400).json({
        erro: `Não é possível excluir esta categoria porque existem ${totalMovimentacoes} movimentação(ões) vinculada(s) a ela.`
      });
    }

    await prisma.categoria.delete({
      where: { id }
    });

    return res.json({ mensagem: 'Categoria excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return res.status(500).json({ erro: 'Erro interno ao excluir categoria.' });
  }
};
