import { Router } from 'express';
import { register, performHealthCheck } from '../utils/metrics';

const router = Router();

// Prometheus metrics endpoint
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.send(metrics);
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = await performHealthCheck();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Readiness check
router.get('/ready', (req, res) => {
  // Add readiness checks (e.g., database connection, required services)
  res.json({ ready: true });
});

// Liveness check
router.get('/live', (req, res) => {
  res.json({ alive: true });
});

export default router;
