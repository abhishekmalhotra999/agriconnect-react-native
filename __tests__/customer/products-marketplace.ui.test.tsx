import React from 'react';
import {Text, View} from 'react-native';
import {act, fireEvent, render, waitFor} from '@testing-library/react-native';
import Products from '../../src/screens/Customer/Products';
import {getMarketplaceProducts} from '../../src/api/marketplace.api';

jest.mock('../../src/utils/util', () => ({
  normalize: (value: number) => value,
  topInsets: () => 0,
  bottomInsets: () => 0,
  capitalize: (value: string) => value,
  getImageSource: (value: unknown) => value,
  headerHeight: () => 50,
}));

jest.mock('../../src/containers/header', () => () => null);

jest.mock('../../src/hooks/useStatusBarStyle', () => () => null);

jest.mock('../../src/contexts/ScrollContext', () => ({
  useScrollContext: () => ({
    registerScrollRef: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      const cleanup = callback();
      return cleanup;
    }, [callback]);
  },
}));

jest.mock('../../src/components/UI/AnimatedScrollView', () => {
  const React = require('react');
  const {ScrollView} = require('react-native');

  return ({children, headerContent, onMomentumScrollEnd, testID}: any) => (
    React.createElement(
      ScrollView,
      {testID, onMomentumScrollEnd},
      headerContent,
      children,
    )
  );
});

jest.mock('../../src/components/UI/SearchBar', () => {
  const React = require('react');
  const {TextInput} = require('react-native');

  return ({placeholder, value, onChangeText}: any) => (
    React.createElement(TextInput, {
      testID: 'search-input',
      placeholder,
      value,
      onChangeText,
    })
  );
});

jest.mock('../../src/components/Customer/Product/ProductList', () => {
  const React = require('react');
  const {View, Text} = require('react-native');

  return ({productLists}: any) => (
    React.createElement(
      View,
      null,
      React.createElement(Text, {testID: 'products-count'}, String(productLists.length)),
      React.createElement(
        Text,
        {testID: 'products-order'},
        productLists.map((item: any) => item.name).join('|'),
      ),
      ...productLists.map((item: any) =>
        React.createElement(Text, {key: String(item.id)}, item.name),
      ),
    )
  );
});

jest.mock('../../src/api/marketplace.api', () => ({
  getMarketplaceProducts: jest.fn(),
}));

const mockedGetMarketplaceProducts = getMarketplaceProducts as jest.Mock;

const createProduct = (
  id: number,
  name: string,
  options?: {category?: string; unitPrice?: number; stockQuantity?: number},
) => ({
  id,
  name,
  price: 'R100',
  discountedPrice: 'R90',
  image: {},
  category: options?.category || 'General',
  unitPrice: options?.unitPrice ?? 100,
  stockQuantity: options?.stockQuantity ?? 10,
  shortDescription: `${name} short`,
  description: `${name} description`,
  inStock: (options?.stockQuantity ?? 10) > 0,
  rating: 0,
  ratingCount: 0,
});

describe('marketplace products screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows newly added published product in marketplace list', async () => {
    mockedGetMarketplaceProducts.mockResolvedValueOnce([
      createProduct(1, 'Existing Product'),
      createProduct(2, 'Newly Added Product'),
    ]);

    const screen = render(
      <Products navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Newly Added Product')).toBeTruthy();
    });
  });

  it('filters products by search query', async () => {
    mockedGetMarketplaceProducts.mockResolvedValueOnce([
      createProduct(1, 'Tomato Seeds'),
      createProduct(2, 'Wheat Flour'),
    ]);

    const screen = render(
      <Products navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Tomato Seeds')).toBeTruthy();
      expect(screen.getByText('Wheat Flour')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByTestId('search-input'), 'tomato');

    await waitFor(() => {
      expect(screen.getByTestId('products-count').props.children).toBe('1');
      expect(screen.getByTestId('products-order').props.children).toBe(
        'Tomato Seeds',
      );
    });
  });

  it('loads next batch when user swipes near bottom', async () => {
    mockedGetMarketplaceProducts.mockResolvedValueOnce(
      Array.from({length: 10}, (_, index) =>
        createProduct(index + 1, `Product ${index + 1}`),
      ),
    );

    const screen = render(
      <Products navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('products-count').props.children).toBe('8');
    });

    fireEvent(screen.getByTestId('products-scroll'), 'momentumScrollEnd', {
      nativeEvent: {
        layoutMeasurement: {height: 500},
        contentOffset: {y: 700},
        contentSize: {height: 1100},
      },
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByTestId('products-count').props.children).toBe('10');
    });
  });

  it('filters by category and resets to show all products', async () => {
    mockedGetMarketplaceProducts.mockResolvedValueOnce([
      createProduct(1, 'Tomato Seeds', {category: 'Seeds'}),
      createProduct(2, 'Wheat Flour', {category: 'Grains'}),
    ]);

    const screen = render(
      <Products navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Tomato Seeds')).toBeTruthy();
      expect(screen.getByText('Wheat Flour')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('filter-category-seeds'));

    await waitFor(() => {
      expect(screen.getByTestId('products-count').props.children).toBe('1');
      expect(screen.getByTestId('products-order').props.children).toBe(
        'Tomato Seeds',
      );
    });

    fireEvent.press(screen.getByTestId('filter-reset'));

    await waitFor(() => {
      expect(screen.getByTestId('products-count').props.children).toBe('2');
      expect(screen.getByTestId('products-order').props.children).toBe(
        'Tomato Seeds|Wheat Flour',
      );
    });
  });

  it('applies in-stock and trusted filters', async () => {
    mockedGetMarketplaceProducts.mockResolvedValueOnce([
      createProduct(1, 'Out of Stock Product', {stockQuantity: 0}),
      createProduct(2, 'Low Stock Product', {stockQuantity: 5}),
      createProduct(3, 'Trusted Stock Product', {stockQuantity: 30}),
    ]);

    const screen = render(
      <Products navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Out of Stock Product')).toBeTruthy();
      expect(screen.getByText('Trusted Stock Product')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('filter-in-stock'));

    await waitFor(() => {
      expect(screen.getByTestId('products-count').props.children).toBe('2');
      expect(screen.getByTestId('products-order').props.children).toBe(
        'Low Stock Product|Trusted Stock Product',
      );
    });

    fireEvent.press(screen.getByTestId('filter-trusted'));

    await waitFor(() => {
      expect(screen.getByTestId('products-count').props.children).toBe('1');
      expect(screen.getByTestId('products-order').props.children).toBe(
        'Trusted Stock Product',
      );
    });
  });

  it('sorts products by selected price order', async () => {
    mockedGetMarketplaceProducts.mockResolvedValueOnce([
      createProduct(1, 'Mid Price', {unitPrice: 150}),
      createProduct(2, 'High Price', {unitPrice: 300}),
      createProduct(3, 'Low Price', {unitPrice: 90}),
    ]);

    const screen = render(
      <Products navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('products-order').props.children).toBe(
        'Mid Price|High Price|Low Price',
      );
    });

    fireEvent.press(screen.getByTestId('sort-price-asc'));

    await waitFor(() => {
      expect(screen.getByTestId('products-order').props.children).toBe(
        'Low Price|Mid Price|High Price',
      );
    });

    fireEvent.press(screen.getByTestId('sort-price-desc'));

    await waitFor(() => {
      expect(screen.getByTestId('products-order').props.children).toBe(
        'High Price|Mid Price|Low Price',
      );
    });
  });
});
