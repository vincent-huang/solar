// Seeder Monetization — Webhook Handler
// Generated for product: ABC Pro 版

import { Request, Response } from 'express';
import crypto from 'crypto';

interface WebhookPayload {
  webhook_id: string;
  event: string;
  timestamp: string;
  seller_id: string;
  data: {
    order_id: string;
    product_id: string;
    product_name: string;
    buyer_id: string;
    amount: number;
    currency: string;
    paid_at?: string;
  };
}

interface SubscriptionData {
  subscription_id: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  buyer_id: string;
  status: string;
  amount: number;
  currency: string;
  current_period_start: string;
  current_period_end: string;
}

interface CustomerData {
  buyer_id: string;
  email?: string;
  name?: string;
  order_id?: string;
  total_spent: number;
  order_count: number;
}

/**
 * Express route handler for Seeder webhook events.
 * Must be used with express.raw({ type: 'application/json' }) middleware
 * so that req.body is a Buffer for HMAC verification.
 * Register: app.post('/api/webhooks/seeder', express.raw({ type: 'application/json' }), handleSeederWebhook)
 */
export async function handleSeederWebhook(req: Request, res: Response) {
  // 1. Parse raw body (Buffer from express.raw) for HMAC verification
  const rawBody = req.body instanceof Buffer ? req.body : Buffer.from(JSON.stringify(req.body));
  const signature = req.headers['seeder-webhook-signature'] as string;
  if (!verifySignature(rawBody, signature)) {
    return res.status(401).json({ error: 'invalid signature' });
  }

  // 2. Parse the verified raw body to JSON
  const payload: WebhookPayload = JSON.parse(rawBody.toString('utf8'));
  const { event, data } = payload;

  // 3. Handle events (data shape varies by event type)
  const eventData = data as any;
  switch (event) {
    case 'order.paid':
      await handleOrderPaid(eventData);
      break;
    case 'order.refunded':
      await handleOrderRefunded(eventData);
      break;
    case 'subscription.created':
      await handleSubscriptionCreated(eventData);
      break;
    case 'subscription.trial_started':
      await handleSubscriptionTrialStarted(eventData);
      break;
    case 'subscription.trial_will_end':
      await handleSubscriptionTrialWillEnd(eventData);
      break;
    case 'subscription.renewed':
      await handleSubscriptionRenewed(eventData);
      break;
    case 'subscription.payment_failed':
      await handleSubscriptionPaymentFailed(eventData);
      break;
    case 'subscription.updated':
      await handleSubscriptionUpdated(eventData);
      break;
    case 'subscription.cancelled':
      await handleSubscriptionCancelled(eventData);
      break;
    case 'subscription.expired':
      await handleSubscriptionExpired(eventData);
      break;
    case 'customer.created':
      await handleCustomerCreated(eventData);
      break;
    default:
      console.log('[Seeder Webhook] Unknown event:', event);
  }

  res.json({ received: true, event });
}

function verifySignature(rawBody: Buffer, signature: string): boolean {
  const secret = process.env.SEEDER_WEBHOOK_SECRET;
  if (!secret) return true; // Skip in dev

  const parts = signature.split(',').map(s => s.split('=')[1]);
  if (parts.length !== 2) return false;
  const [timestamp, sig] = parts;
  const payload = timestamp + '.' + rawBody.toString('utf8');
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

async function handleOrderPaid(data: WebhookPayload['data']) {
  console.log('[Seeder Webhook] Order paid:', data.order_id, 'by buyer:', data.buyer_id);
  // TODO: Grant entitlements — create/update subscription record for buyer
  // Product ID: prod_19e7d900d01e869dc149a50e8835accbc3de4499545
}

async function handleOrderRefunded(data: WebhookPayload['data']) {
  console.log('[Seeder Webhook] Order refunded:', data.order_id);
  // TODO: Revoke entitlements
}

async function handleSubscriptionCreated(data: SubscriptionData) {
  console.log('[Seeder Webhook] Subscription created:', data.subscription_id, 'for buyer:', data.buyer_id);
  // TODO: Provision access for the new subscription
}

async function handleSubscriptionTrialStarted(data: SubscriptionData) {
  console.log('[Seeder Webhook] Trial started:', data.subscription_id, 'for buyer:', data.buyer_id);
  // TODO: Provision trial access, record trial start
}

async function handleSubscriptionTrialWillEnd(data: SubscriptionData) {
  console.log('[Seeder Webhook] Trial will end:', data.subscription_id, 'for buyer:', data.buyer_id);
  // TODO: Notify buyer that trial is ending soon
}

async function handleSubscriptionRenewed(data: SubscriptionData) {
  console.log('[Seeder Webhook] Subscription renewed:', data.subscription_id, 'for buyer:', data.buyer_id);
  // TODO: Extend access period
}

async function handleSubscriptionPaymentFailed(data: SubscriptionData) {
  console.log('[Seeder Webhook] Payment failed:', data.subscription_id, 'for buyer:', data.buyer_id);
  // TODO: Notify buyer of payment failure, restrict access if needed
}

async function handleSubscriptionUpdated(data: SubscriptionData) {
  console.log('[Seeder Webhook] Subscription updated:', data.subscription_id, 'for buyer:', data.buyer_id);
  // TODO: Adjust access based on new plan (upgrade/downgrade)
}

async function handleSubscriptionCancelled(data: SubscriptionData) {
  console.log('[Seeder Webhook] Subscription cancelled:', data.subscription_id, 'for buyer:', data.buyer_id);
  // TODO: Schedule entitlement revocation
}

async function handleSubscriptionExpired(data: SubscriptionData) {
  console.log('[Seeder Webhook] Subscription expired:', data.subscription_id, 'for buyer:', data.buyer_id);
  // TODO: Revoke entitlements
}

async function handleCustomerCreated(data: CustomerData) {
  console.log('[Seeder Webhook] Customer created:', data.buyer_id);
  // TODO: Initialize customer profile, send welcome email
}

/**
 * Proxy a cancel subscription request from the frontend to the Seeder API.
 * The subscription will remain active until the end of the billing period, then
 * transition to "cancelled" and fire a subscription.cancelled webhook.
 * Register: app.post('/api/subscriptions/:subscriptionId/cancel', handleCancelSubscription)
 */
export async function handleCancelSubscription(req: Request, res: Response) {
  const subscriptionId = req.params.subscriptionId;
  const baseURL = process.env.SEEDER_PAY_BASE || 'https://pay.ligris.ai';
  const skKey = process.env.SEEDER_SK_KEY || '';
  if (!skKey) {
    return res.status(500).json({ error: 'seeder api not configured' });
  }

  try {
    const resp = await fetch(baseURL + '/pay/subscriptions/' + subscriptionId + '/cancel', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + skKey }
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'failed to reach seeder api' });
  }
}
