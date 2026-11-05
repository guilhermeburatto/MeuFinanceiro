import { Router } from 'express';
import { obterResumo } from '../controllers/dashboardController.js';

const router = Router();

// Endpoint de resumo consolidado para o Dashboard
router.get('/resumo', obterResumo);

export default router;
