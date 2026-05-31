// Seeder Monetization — Products & Plans (runtime fetch)
// Fetches products and linked selling plans from the Seeder Open API at startup.

export interface Plan {
  plan_id: string;
  name: string;
  purchase_type: string;
  interval?: string;
}

export interface ProductPlan {
  product_id: string;
  product_slug: string;
  name: string;
  price: number;
  currency: string;
  plans: Plan[];
}

let cachedProducts: ProductPlan[] = [];

export async function loadProductsPlans(): Promise<void> {
  const baseURL = process.env.SEEDER_PAY_BASE;
  const skKey = process.env.SEEDER_SK_KEY;
  if (!baseURL || !skKey) {
    throw new Error('SEEDER_PAY_BASE and SEEDER_SK_KEY must be set');
  }

  const appID = process.env.SEEDER_APP_ID || '';
  const payEnv = process.env.SEEDER_PAY_ENV || 'production';

  let url = baseURL + '/pay/products/plans?pay_env=' + payEnv;
  if (appID) url += '&app_id=' + appID;

  const res = await fetch(url, {
    headers: { Authorization: 'Bearer ' + skKey }
  });

  if (!res.ok) {
    throw new Error('products/plans api returned ' + res.status);
  }

  const json = await res.json();
  cachedProducts = json.data || [];
}

export function getProductsPlans(): ProductPlan[] {
  return cachedProducts;
}

export function getProductBySlug(slug: string): ProductPlan | undefined {
  return cachedProducts.find(p => p.product_slug === slug);
}
