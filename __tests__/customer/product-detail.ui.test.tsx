import React from 'react';
import {Linking, Share, Text, TouchableOpacity, View} from 'react-native';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import ProductDetails from '../../src/screens/Customer/Products/show';

jest.mock('../../src/utils/util', () => ({
  normalize: (value: number) => value,
  topInsets: () => 0,
  bottomInsets: () => 0,
}));

jest.mock('../../src/containers/header', () => () => null);

jest.mock('../../src/hooks/useStatusBarStyle', () => () => null);

jest.mock('../../src/components/UI/ImageSlider', () => {
  const ReactLocal = require('react');
  const {View: RNView} = require('react-native');
  return () => ReactLocal.createElement(RNView, {testID: 'product-slider'});
});

jest.mock('../../src/components/Customer/Product/ProductInfo', () => {
  const ReactLocal = require('react');
  const {Text: RNText} = require('react-native');
  return ({product}: any) =>
    ReactLocal.createElement(RNText, {testID: 'product-name'}, product.name);
});

jest.mock('../../src/components/Customer/Cart/CheckoutButton', () => {
  const ReactLocal = require('react');
  const {TouchableOpacity: RNTouchableOpacity, Text: RNText} = require('react-native');

  return ({label, onPress}: any) =>
    ReactLocal.createElement(
      RNTouchableOpacity,
      {testID: 'checkout-button', onPress},
      ReactLocal.createElement(RNText, null, label),
    );
});

jest.mock('../../src/api/marketplace.api', () => ({
  getMarketplaceProductDetail: jest.fn(),
  getMarketplaceProductReviews: jest.fn(),
  getMarketplaceProductsByCategory: jest.fn(),
  createMarketplaceProductReview: jest.fn(),
}));

jest.mock('../../src/api/preferences.api', () => ({
  isProductSaved: jest.fn(),
  toggleSavedProduct: jest.fn(),
  trackRecentProduct: jest.fn().mockResolvedValue(undefined),
}));

const {
  getMarketplaceProductDetail,
  getMarketplaceProductReviews,
  getMarketplaceProductsByCategory,
  createMarketplaceProductReview,
} = require('../../src/api/marketplace.api');

const {isProductSaved, toggleSavedProduct} = require('../../src/api/preferences.api');

const baseProduct = {
  id: 11,
  name: 'Organic Rice',
  price: 'R120',
  discountedPrice: 'R100',
  image: {},
  category: 'Grains',
  categoryId: 4,
  stockQuantity: 30,
  inStock: true,
  description: 'Fresh rice',
  shortDescription: 'Fresh rice',
  rating: 4.5,
  ratingCount: 10,
  sellerName: 'Farmer Joe',
  sellerPhone: '+91 90000 12345',
};

describe('product details screen parity actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getMarketplaceProductDetail.mockResolvedValue({
      product: baseProduct,
      images: [{uri: 'http://localhost/rice.png'}],
    });
    getMarketplaceProductReviews.mockResolvedValue([
      {id: 1, rating: 5, comment: 'Great', reviewer: {name: 'Alice'}},
    ]);
    getMarketplaceProductsByCategory.mockResolvedValue([
      baseProduct,
      {
        ...baseProduct,
        id: 12,
        name: 'Wheat Flour',
        price: 'R90',
      },
    ]);
    isProductSaved.mockResolvedValue(false);
    toggleSavedProduct.mockResolvedValue(true);
    createMarketplaceProductReview.mockResolvedValue({id: 2});
  });

  it('renders actions and supports save/share/contact actions', async () => {
    const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({action: 'sharedAction'} as any);
    const openUrlSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as any);

    const screen = render(
      <ProductDetails
        navigation={{navigate: jest.fn(), getParent: () => ({setOptions: jest.fn()}), push: jest.fn()} as any}
        route={{params: {product: baseProduct}} as any}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('product-name').props.children).toBe('Organic Rice');
    });

    fireEvent.press(screen.getByTestId('product-save'));
    await waitFor(() => {
      expect(toggleSavedProduct).toHaveBeenCalled();
    });

    fireEvent.press(screen.getByTestId('product-share'));
    await waitFor(() => {
      expect(shareSpy).toHaveBeenCalled();
    });

    fireEvent.press(screen.getByTestId('product-call'));
    await waitFor(() => {
      expect(openUrlSpy).toHaveBeenCalledWith('tel:919000012345');
    });

    fireEvent.press(screen.getByTestId('product-whatsapp'));
    await waitFor(() => {
      expect(openUrlSpy).toHaveBeenCalledWith('https://wa.me/919000012345');
    });
  });

  it('submits review and refreshes reviews', async () => {
    const screen = render(
      <ProductDetails
        navigation={{navigate: jest.fn(), getParent: () => ({setOptions: jest.fn()}), push: jest.fn()} as any}
        route={{params: {product: baseProduct}} as any}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Ratings & Reviews')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByTestId('review-comment-input'), 'Nice product');
    fireEvent.press(screen.getByTestId('review-submit'));

    await waitFor(() => {
      expect(createMarketplaceProductReview).toHaveBeenCalledWith(11, {
        rating: 5,
        comment: 'Nice product',
      });
    });

    await waitFor(() => {
      expect(getMarketplaceProductReviews).toHaveBeenCalledTimes(2);
      expect(getMarketplaceProductDetail).toHaveBeenCalledTimes(2);
    });
  });
});
