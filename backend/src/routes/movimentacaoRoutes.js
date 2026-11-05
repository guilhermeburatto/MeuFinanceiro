import { Router } from 'express';
import {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir
} from '../controllers/movimentacaoController.js';

const router = Router();

// Endpoints da API de Movimentações
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', excluir);

export default router;
