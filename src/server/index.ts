import express from 'express';
import { loadProductsPlans } from '../monetization/products';
import { handleSeederWebhook, handleCancelSubscription } from '../monetization/webhook';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Webhook route — must use raw body parser for HMAC verification
app.post(
  '/api/webhooks/seeder',
  express.raw({ type: 'application/json' }),
  handleSeederWebhook
);

// JSON body parser for other API routes
app.use(express.json());

// Cancel subscription proxy
app.post('/api/subscriptions/:subscriptionId/cancel', handleCancelSubscription);

// Serve static files in production
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  const distPath = path.resolve(__dirname, '../../dist');
  app.use(express.static(distPath));
  // SPA fallback — serve index.html for non-API routes
  app.get('*', (_req: express.Request, res: express.Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

async function start() {
  try {
    await loadProductsPlans();
    console.log('[Seeder] Products & plans loaded');
  } catch (err) {
    console.warn('[Seeder] Failed to load products:', (err as Error).message);
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

start();
