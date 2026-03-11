import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import MyProducts from '../../src/screens/Vendor/MyProducts';
import {getMyMarketplaceProducts, updateMarketplaceProduct} from '../../src/api/marketplace.api';

jest.mock('../../src/utils/util', () => ({
  normalize: (value: number) => value,
  topInsets: () => 0,
  bottomInsets: () => 0,
  headerHeight: () => 50,
}));

jest.mock('../../src/containers/header', () => () => null);

jest.mock('../../src/components/UI/Button', () => {
  const ReactLocal = require('react');
  const {TouchableOpacity: RNTouchableOpacity, Text: RNText} = require('react-native');

  return ({label, onPress}: any) =>
    ReactLocal.createElement(
      RNTouchableOpacity,
      {testID: 'add-button', onPress},
      ReactLocal.createElement(RNText, null, label),
    );
});

jest.mock('../../src/components/UI/AnimatedScrollView', () => {
  const ReactLocal = require('react');
  const {ScrollView} = require('react-native');

  return ReactLocal.forwardRef(({children, headerContent}: any, ref: any) =>
    ReactLocal.createElement(ScrollView, {ref}, headerContent, children),
  );
});

jest.mock('../../src/components/UI/SearchBar', () => {
  const ReactLocal = require('react');
  const {TouchableOpacity: RNTouchableOpacity, Text: RNText} = require('react-native');

  return ({value, onChangeText}: any) =>
    ReactLocal.createElement(
      RNTouchableOpacity,
      {testID: 'search-trigger', onPress: () => onChangeText?.('mint')},
      ReactLocal.createElement(RNText, {testID: 'search-value'}, value || ''),
    );
});

jest.mock('../../src/components/Vendor/MyProduct/MyProductList', () => {
  const ReactLocal = require('react');
  const {
    View: RNView,
    Text: RNText,
    TouchableOpacity: RNTouchableOpacity,
  } = require('react-native');

  return ({
    myProductLists,
    onEdit,
    onTogglePublish,
  }: any) =>
    ReactLocal.createElement(
      RNView,
      null,
      ReactLocal.createElement(
        RNText,
        {testID: 'seller-list-count'},
        String(myProductLists.length),
      ),
      ReactLocal.createElement(
        RNText,
        {testID: 'seller-list-order'},
        myProductLists.map((item: any) => item.name).join('|'),
      ),
      ...myProductLists.map((item: any) =>
        ReactLocal.createElement(
          RNView,
          {key: String(item.id)},
          ReactLocal.createElement(RNText, null, item.name),
          ReactLocal.createElement(
            RNTouchableOpacity,
            {testID: `edit-${item.id}`, onPress: () => onEdit?.(item)},
            ReactLocal.createElement(RNText, null, 'Edit'),
          ),
          ReactLocal.createElement(
            RNTouchableOpacity,
            {testID: `toggle-${item.id}`, onPress: () => onTogglePublish?.(item)},
            ReactLocal.createElement(RNText, null, 'Toggle'),
          ),
        ),
      ),
    );
});

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void) => {
    const ReactLocal = require('react');
    ReactLocal.useEffect(() => {
      const cleanup = callback();
      return cleanup;
    }, [callback]);
  },
}));

jest.mock('../../src/contexts/ScrollContext', () => ({
  useScrollContext: () => ({registerScrollRef: jest.fn()}),
}));

jest.mock('../../src/contexts/UserContext', () => ({
  userContext: jest.fn(() => ({
    user: {
      accountType: 'farmer',
      profile: {professionType: 'farmer'},
    },
  })),
}));

jest.mock('../../src/api/marketplace.api', () => ({
  getMyMarketplaceProducts: jest.fn(),
  updateMarketplaceProduct: jest.fn(),
}));

jest.mock('../../src/api/services.api', () => ({
  getMyServiceListings: jest.fn(),
}));

const createProduct = (id: number, name: string, status: 'draft' | 'published') => ({
  id,
  name,
  price: 'R100',
  discountedPrice: 'R90',
  image: {},
  category: 'General',
  status,
  unitPrice: 100,
  salePrice: 90,
  stockQuantity: 10,
  imageUrl: 'https://cdn.example.com/p.png',
  shortDescription: `${name} short`,
  description: `${name} description`,
  inStock: true,
  rating: 0,
  ratingCount: 0,
});

describe('seller my products phase-4 behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getMyMarketplaceProducts as jest.Mock).mockResolvedValue([
      createProduct(1, 'Mint Bundle', 'draft'),
      createProduct(2, 'Rice Pack', 'published'),
    ]);
    (updateMarketplaceProduct as jest.Mock).mockResolvedValue({});
  });

  it('filters by status and search query', async () => {
    const screen = render(
      <MyProducts navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('seller-list-count').props.children).toBe('2');
    });

    fireEvent.press(screen.getByTestId('seller-filter-published'));
    await waitFor(() => {
      expect(screen.getByTestId('seller-list-order').props.children).toBe('Rice Pack');
    });

    fireEvent.press(screen.getByTestId('seller-filter-all'));
    fireEvent.press(screen.getByTestId('search-trigger'));

    await waitFor(() => {
      expect(screen.getByTestId('seller-list-order').props.children).toBe('Mint Bundle');
    });
  });

  it('supports inline edit and publish toggle', async () => {
    const navigate = jest.fn();
    const screen = render(
      <MyProducts navigation={{navigate} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Mint Bundle')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('edit-1'));
    expect(navigate).toHaveBeenCalledWith('ManageMyProduct', {
      product: expect.objectContaining({id: 1}),
    });

    fireEvent.press(screen.getByTestId('toggle-1'));

    await waitFor(() => {
      expect(updateMarketplaceProduct).toHaveBeenCalledWith(
        1,
        expect.objectContaining({status: 'published'}),
      );
    });
  });

  it('shows backend reason when publish toggle is rejected', async () => {
    (updateMarketplaceProduct as jest.Mock).mockRejectedValueOnce(
      new Error('Seller approval pending. Complete onboarding first.'),
    );

    const screen = render(
      <MyProducts navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Mint Bundle')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('toggle-1'));

    await waitFor(() => {
      expect(
        screen.getByText('Seller approval pending. Complete onboarding first.'),
      ).toBeTruthy();
    });
  });
});
