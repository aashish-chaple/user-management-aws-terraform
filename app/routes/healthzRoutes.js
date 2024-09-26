import express from 'express';
import { healthCheck, nonGetHealthCheck } from '../controllers/healthzController.js';

const router = express.Router();

// Health check route
router.get('/healthz', healthCheck);

// Catch any other HTTP methods (e.g., POST, PUT)
router.all('/healthz', nonGetHealthCheck);

export default router;