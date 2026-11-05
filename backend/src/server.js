import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import categoriaRoutes from './routes/categoriaRoutes.js';
import movimentacaoRoutes from './routes/movimentacaoRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rota de verificação do status da API
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor MeuFinanceiro operacional',
    timestamp: new Date().toISOString()
  });
});

// Rotas da aplicação
app.use('/api/categorias', categoriaRoutes);
app.use('/api/movimentacoes', movimentacaoRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor MeuFinanceiro rodando na porta ${PORT}`);
  console.log(`Endpoint de teste: http://localhost:${PORT}/api/status`);
  console.log(`Endpoint de categorias: http://localhost:${PORT}/api/categorias`);
  console.log(`Endpoint de movimentações: http://localhost:${PORT}/api/movimentacoes`);
});
