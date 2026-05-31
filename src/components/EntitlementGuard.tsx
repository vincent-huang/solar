// Entitlement Guard — ABC Pro 版
// Wraps components to check user entitlement before rendering

import React from 'react';

interface EntitlementGuardProps {
  /** Entitlement keys required to access this content */
  requiredKeys?: string[];
  /** Content to show when user lacks access (defaults to upgrade prompt) */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * EntitlementGuard wraps protected content and only renders it
 * when the user has purchased the required product.
 *
 * Usage:
 * <EntitlementGuard requiredKeys={["ABC_PRO", "PRO_FEATURES", "PRO_API"]}>
 *   <ProDashboard />
 * </EntitlementGuard>
 */
export default function EntitlementGuard({
  requiredKeys,
  fallback,
  children,
}: EntitlementGuardProps) {
  // TODO: Replace with actual entitlement check from your auth context
  const user = (window as any).__USER__;

  const hasAccess = user?.entitlements?.some(
    (key: string) => requiredKeys?.includes(key)
  );

  if (!hasAccess) {
    return (
      <>{ fallback || <DefaultUpgradePrompt /> }</>
    );
  }

  return <>{children}</>;
}

function DefaultUpgradePrompt() {
  return (
    <div className="entitlement-guard-fallback">
      <h3>Upgrade Required</h3>
      <p>This feature requires a ABC Pro 版 subscription.</p>
      <button
        className="btn-primary"
        onClick={() => window.location.href = '/pricing'}
      >
        Upgrade Now
      </button>
    </div>
  );
}

export const ENTITLEMENT_KEYS = ["ABC_PRO", "PRO_FEATURES", "PRO_API"];
