import express from 'express';
import cors from 'cors';
import 'dotenv/config';

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

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor MeuFinanceiro rodando na porta ${PORT}`);
  console.log(`Endpoint de teste: http://localhost:${PORT}/api/status`);
});
