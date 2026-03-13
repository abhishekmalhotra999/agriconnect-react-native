export type RootFlowView =
  | 'ONBOARDING'
  | 'AUTH'
  | 'FARMER_SETUP'
  | 'FARMER_TABS'
  | 'SELLER_TABS'
  | 'CUSTOMER_TABS';

export type CustomerBottomTabInitialRoute = 'Learn' | 'SELLER_TAB';

type ResolveRootFlowArgs = {
  onBoarded: boolean;
  loggedIn: boolean;
  normalizedRole: string;
  farmerOnboardingCompleted: boolean;
};

export const resolveRootFlowView = ({
  onBoarded,
  loggedIn,
  normalizedRole,
  farmerOnboardingCompleted,
}: ResolveRootFlowArgs): RootFlowView => {
  if (!onBoarded) {
    return 'ONBOARDING';
  }

  if (!loggedIn) {
    return 'AUTH';
  }

  const role = String(normalizedRole || '').toLowerCase();
  const isFarmerRole = role === 'farmer';
  const isSellerRole = role === 'farmer' || role === 'technician';

  if (isFarmerRole && !farmerOnboardingCompleted) {
    return 'FARMER_SETUP';
  }

  if (isFarmerRole) {
    return 'FARMER_TABS';
  }

  if (isSellerRole) {
    return 'SELLER_TABS';
  }

  return 'CUSTOMER_TABS';
};

export const resolveCustomerBottomTabInitialRoute = (
  rootFlowView: RootFlowView,
): CustomerBottomTabInitialRoute => {
  if (rootFlowView === 'FARMER_TABS') {
    return 'SELLER_TAB';
  }

  return 'Learn';
};
