import {
  resolveCustomerBottomTabInitialRoute,
  resolveRootFlowView,
} from '../../src/containers/rootFlow';

describe('root flow routing for farmer journey', () => {
  it('shows onboarding stack for first-time users', () => {
    expect(
      resolveRootFlowView({
        onBoarded: false,
        loggedIn: false,
        normalizedRole: '',
        farmerOnboardingCompleted: false,
      }),
    ).toBe('ONBOARDING');
  });

  it('shows auth stack when onboarding is done but user is not logged in', () => {
    expect(
      resolveRootFlowView({
        onBoarded: true,
        loggedIn: false,
        normalizedRole: 'farmer',
        farmerOnboardingCompleted: false,
      }),
    ).toBe('AUTH');
  });

  it('routes logged-in farmer without setup completion to farmer setup wizard', () => {
    expect(
      resolveRootFlowView({
        onBoarded: true,
        loggedIn: true,
        normalizedRole: 'farmer',
        farmerOnboardingCompleted: false,
      }),
    ).toBe('FARMER_SETUP');
  });

  it('routes logged-in farmer with setup completion to customer tabs with seller entry', () => {
    expect(
      resolveRootFlowView({
        onBoarded: true,
        loggedIn: true,
        normalizedRole: 'farmer',
        farmerOnboardingCompleted: true,
      }),
    ).toBe('FARMER_TABS');
  });

  it('routes vendor and technician to seller tabs', () => {
    expect(
      resolveRootFlowView({
        onBoarded: true,
        loggedIn: true,
        normalizedRole: 'vendor',
        farmerOnboardingCompleted: true,
      }),
    ).toBe('SELLER_TABS');

    expect(
      resolveRootFlowView({
        onBoarded: true,
        loggedIn: true,
        normalizedRole: 'technician',
        farmerOnboardingCompleted: true,
      }),
    ).toBe('SELLER_TABS');
  });

  it('routes customer to customer tabs', () => {
    expect(
      resolveRootFlowView({
        onBoarded: true,
        loggedIn: true,
        normalizedRole: 'customer',
        farmerOnboardingCompleted: true,
      }),
    ).toBe('CUSTOMER_TABS');
  });

  it('chooses seller as initial tab for farmer tabs', () => {
    expect(resolveCustomerBottomTabInitialRoute('FARMER_TABS')).toBe(
      'SELLER_TAB',
    );
  });

  it('keeps learn as initial tab for non-farmer tab views', () => {
    expect(resolveCustomerBottomTabInitialRoute('CUSTOMER_TABS')).toBe('Learn');
    expect(resolveCustomerBottomTabInitialRoute('SELLER_TABS')).toBe('Learn');
  });
});
