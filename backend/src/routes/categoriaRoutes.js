import { Router } from 'express';
import {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir
} from '../controllers/categoriaController.js';

const router = Router();

// Endpoints da API de Categorias
router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', excluir);

export default router;
