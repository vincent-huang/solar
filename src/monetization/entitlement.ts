// Seeder Monetization — Entitlement Middleware
// Fetches the buyer's active subscriptions and entitlement keys from the
// Seeder API and stores them on the request object. Your route handlers
// read req.entitlements to implement custom access-control logic.

const SEEDER_PAY_BASE = process.env.SEEDER_PAY_BASE || 'https://pay.ligris.ai';
const SEEDER_SK_KEY = process.env.SEEDER_SK_KEY || '';

export interface SubEntitlement {
  subscription_id: string;
  product_id: string;
  product_name: string;
  status: string;
  current_period_end: string;
  entitlement_keys: string[];
}

export interface EntitlementResult {
  has_access: boolean;
  buyer_id: string;
  buyer_email: string;
  subscriptions: SubEntitlement[];
}

/**
 * Express middleware that fetches the current user's entitlements from the
 * Seeder API and stores them on req.entitlements.
 *
 * Usage:
 *   app.use('/pro', authMiddleware, requireEntitlement());
 *
 * In your route handler:
 *   const entitlements = req.entitlements as EntitlementResult;
 *   if (!entitlements.has_access) {
 *     return res.status(402).json({ error: 'payment_required' });
 *   }
 */
export function requireEntitlement() {
  return async (req: any, res: any, next: any) => {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ error: 'authentication required' });
    }

    try {
      const url = SEEDER_PAY_BASE + '/pay/entitlements?buyer_email=' +
        encodeURIComponent(userEmail);
      const apiRes = await fetch(url, {
        headers: { Authorization: 'Bearer ' + SEEDER_SK_KEY }
      });
      const json = await apiRes.json();
      req.entitlements = (json.data || { subscriptions: [], has_access: false }) as EntitlementResult;
    } catch {
      req.entitlements = { has_access: false, buyer_id: '', buyer_email: userEmail, subscriptions: [] };
    }

    next();
  };
}
