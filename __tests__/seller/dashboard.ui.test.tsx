import {fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import Dashboard from '../../src/screens/Vendor/Dashboard';
import {getMyMarketplaceProducts} from '../../src/api/marketplace.api';
import {getMyServiceListings} from '../../src/api/services.api';
import {getUserPreferences} from '../../src/api/preferences.api';

jest.mock('../../src/utils/util', () => ({
  normalize: (value: number) => value,
  topInsets: () => 0,
  bottomInsets: () => 0,
  capitalize: (value: string) => value,
  getImageSource: (value: unknown) => value,
  headerHeight: () => 50,
}));

jest.mock('../../src/containers/header', () => () => null);

jest.mock('../../src/contexts/ScrollContext', () => ({
  useScrollContext: () => ({
    registerScrollRef: jest.fn(),
    scrollToTop: jest.fn(),
  }),
}));

jest.mock('../../src/components/Vendor/Dashboard/Chart', () => {
  const {Text} = require('react-native');
  return ({labels, values}: {labels: string[]; values: number[]}) => (
    <Text testID="dashboard-chart-data">
      {JSON.stringify({labels, values})}
    </Text>
  );
});

jest.mock('../../src/api/marketplace.api', () => ({
  getMyMarketplaceProducts: jest.fn(),
}));

jest.mock('../../src/api/services.api', () => ({
  getMyServiceListings: jest.fn(),
}));

jest.mock('../../src/api/preferences.api', () => ({
  getUserPreferences: jest.fn(),
}));

jest.mock('../../src/contexts/UserContext', () => ({
  userContext: () => ({
    user: {
      accountType: 'farmer',
    },
    loggedIn: true,
  }),
}));

describe('seller dashboard UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getMyServiceListings as jest.Mock).mockResolvedValue([]);
  });

  it('renders dynamic inventory and setup details from API data', async () => {
    const mockNavigate = jest.fn();
    (getMyMarketplaceProducts as jest.Mock).mockResolvedValueOnce([
      {
        id: 1,
        name: 'Tomatoes',
        price: 'R10',
        discountedPrice: 'R10',
        image: {},
        category: 'General',
        status: 'published',
        unitPrice: 10,
        stockQuantity: 8,
        shortDescription: '',
        description: '',
        inStock: true,
        rating: 0,
        ratingCount: 0,
      },
      {
        id: 2,
        name: 'Onions',
        price: 'R20',
        discountedPrice: 'R20',
        image: {},
        category: 'General',
        status: 'draft',
        unitPrice: 20,
        stockQuantity: 3,
        shortDescription: '',
        description: '',
        inStock: true,
        rating: 0,
        ratingCount: 0,
      },
      {
        id: 3,
        name: 'Rice',
        price: 'R5',
        discountedPrice: 'R5',
        image: {},
        category: 'General',
        status: 'published',
        unitPrice: 5,
        stockQuantity: 0,
        shortDescription: '',
        description: '',
        inStock: false,
        rating: 0,
        ratingCount: 0,
      },
    ]);

    (getUserPreferences as jest.Mock).mockResolvedValueOnce({
      sellerStatus: 'pending',
      sellerStatusReason: 'Awaiting document review',
      farmerOnboarding: {
        completed: false,
        storeName: 'My Store',
        businessType: 'Retail',
        serviceArea: 'Monrovia',
        contactPhone: '',
        contactEmail: 'store@example.com',
      },
    });

    const screen = render(
      <Dashboard
        navigation={{navigate: mockNavigate, goBack: jest.fn()} as any}
        route={{key: 'Dashboard', name: 'Dashboard'} as any}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading seller data...')).toBeNull();
    });

    expect(screen.getByText('Products')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('Active Listings')).toBeTruthy();
    expect(screen.getByText('Pending Listings')).toBeTruthy();
    expect(screen.getByText('Published')).toBeTruthy();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getByText('Draft')).toBeTruthy();
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getByText('Low Stock (0-5)')).toBeTruthy();
    expect(screen.getByText('Out of Stock')).toBeTruthy();
    expect(screen.getByText('Total Stock Units')).toBeTruthy();

    expect(screen.getByText('Verification')).toBeTruthy();
    expect(screen.getByText('pending')).toBeTruthy();
    expect(screen.getByText('Checklist')).toBeTruthy();
    expect(screen.getByText('4/6')).toBeTruthy();
    expect(screen.getAllByText('Awaiting document review').length).toBeGreaterThan(0);
    expect(screen.getByText('Recent Products')).toBeTruthy();
    expect(screen.getByText('Tomatoes')).toBeTruthy();

    fireEvent.press(screen.getByText('Add Product'));
    expect(mockNavigate).toHaveBeenCalledWith('ManageMyProduct');

    fireEvent.press(screen.getByText('Manage Listings'));
    expect(mockNavigate).toHaveBeenCalledWith('MyProducts');

    fireEvent.press(screen.getByText('My Orders'));
    expect(mockNavigate).toHaveBeenCalledWith('Orders');

    expect(screen.getByTestId('dashboard-chart-data')).toBeTruthy();
  });

  it('shows a failure message when dashboard APIs fail', async () => {
    (getMyMarketplaceProducts as jest.Mock).mockRejectedValueOnce(
      new Error('network fail'),
    );
    (getUserPreferences as jest.Mock).mockRejectedValueOnce(
      new Error('network fail'),
    );

    const screen = render(
      <Dashboard
        navigation={{navigate: jest.fn(), goBack: jest.fn()} as any}
        route={{key: 'Dashboard', name: 'Dashboard'} as any}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load seller dashboard data.'),
      ).toBeTruthy();
    });
  });
});
