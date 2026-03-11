import React from 'react';
import {Linking, Share} from 'react-native';
import {act, fireEvent, render, waitFor} from '@testing-library/react-native';
import ServiceDetails from '../../src/screens/Customer/Services/show';

jest.mock('../../src/utils/util', () => ({
  normalize: (value: number) => value,
  topInsets: () => 0,
  bottomInsets: () => 0,
}));

jest.mock('../../src/containers/header', () => () => null);

jest.mock('../../src/components/UI/ImageSlider', () => {
  const ReactLocal = require('react');
  const {View: RNView} = require('react-native');
  return () => ReactLocal.createElement(RNView, {testID: 'service-slider'});
});

jest.mock('../../src/components/Customer/Product/ProductInfo', () => {
  const ReactLocal = require('react');
  const {Text: RNText} = require('react-native');
  return ({product}: any) =>
    ReactLocal.createElement(RNText, {testID: 'service-name'}, product.name);
});

jest.mock('../../src/components/Customer/Cart/CheckoutButton', () => {
  const ReactLocal = require('react');
  const {TouchableOpacity: RNTouchableOpacity, Text: RNText} = require('react-native');

  return ({label, onPress}: any) =>
    ReactLocal.createElement(
      RNTouchableOpacity,
      {testID: 'service-request-button', onPress},
      ReactLocal.createElement(RNText, null, label),
    );
});

jest.mock('../../src/components/UI/ErrorText', () => {
  const ReactLocal = require('react');
  const {Text: RNText} = require('react-native');

  return ({text}: any) => ReactLocal.createElement(RNText, null, text);
});

jest.mock('../../src/contexts/UserContext', () => ({
  userContext: jest.fn(),
}));

jest.mock('../../src/api/services.api', () => ({
  createServiceListingReview: jest.fn(),
  createServiceRequest: jest.fn(),
  getServiceListingDetail: jest.fn(),
  getServiceListingReviews: jest.fn(),
  getServiceListingsByCategory: jest.fn(),
}));

jest.mock('../../src/api/preferences.api', () => ({
  isPreferenceSaved: jest.fn(),
  toggleSavedPreference: jest.fn(),
  trackRecentPreference: jest.fn().mockResolvedValue(undefined),
}));

const {
  createServiceListingReview,
  getServiceListingDetail,
  getServiceListingReviews,
  getServiceListingsByCategory,
} = require('../../src/api/services.api');

const {isPreferenceSaved, toggleSavedPreference} = require('../../src/api/preferences.api');
const {userContext} = require('../../src/contexts/UserContext');

const baseService = {
  id: 31,
  name: 'Irrigation Pump Repair',
  price: 'R200',
  discountedPrice: 'R180',
  image: {},
  imageUrl: 'https://cdn.example.com/service.png',
  category: 'Service',
  categoryId: 4,
  serviceArea: 'Bong',
  sellerName: 'Tech Musa',
  sellerPhone: '+91 90000 99999',
  inStock: true,
  description: 'Repair irrigation lines and pumps.',
  shortDescription: 'Repair irrigation lines and pumps.',
  rating: 4.2,
  ratingCount: 8,
};

describe('customer service details parity actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    userContext.mockReturnValue({
      user: {
        accountType: 'customer',
        name: 'Asha',
        phone: '9111111111',
        email: 'asha@example.com',
      },
    });

    getServiceListingDetail.mockResolvedValue({
      product: baseService,
      images: [{uri: 'http://localhost/service.png'}],
    });
    getServiceListingReviews.mockResolvedValue([
      {id: 1, rating: 5, comment: 'Excellent', reviewer: {name: 'Vani'}},
    ]);
    getServiceListingsByCategory.mockResolvedValue([
      baseService,
      {...baseService, id: 32, name: 'Soil Sensor Setup'},
    ]);
    isPreferenceSaved.mockResolvedValue(false);
    toggleSavedPreference.mockResolvedValue(true);
    createServiceListingReview.mockResolvedValue({id: 2});
  });

  it('supports save/share/call/whatsapp quick actions', async () => {
    const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({action: 'sharedAction'} as any);
    const openUrlSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true as any);

    const screen = render(
      <ServiceDetails
        navigation={{
          navigate: jest.fn(),
          getParent: () => ({setOptions: jest.fn()}),
          push: jest.fn(),
        } as any}
        route={{params: {product: baseService}} as any}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('service-name').props.children).toBe('Irrigation Pump Repair');
    });

    fireEvent.press(screen.getByText('Save'));
    await waitFor(() => {
      expect(toggleSavedPreference).toHaveBeenCalledWith(
        'service',
        expect.objectContaining({id: '31', title: 'Irrigation Pump Repair'}),
      );
    });

    fireEvent.press(screen.getByText('Share'));
    await waitFor(() => {
      expect(shareSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Irrigation Pump Repair',
          message: 'Check this service: Irrigation Pump Repair',
        }),
      );
    });

    fireEvent.press(screen.getByText('Call'));
    await waitFor(() => {
      expect(openUrlSpy).toHaveBeenCalledWith('tel:919000099999');
    });

    fireEvent.press(screen.getByText('WhatsApp'));
    await waitFor(() => {
      expect(openUrlSpy).toHaveBeenCalledWith('https://wa.me/919000099999');
    });
  });

  it('submits review and refreshes review/detail data', async () => {
    const screen = render(
      <ServiceDetails
        navigation={{
          navigate: jest.fn(),
          getParent: () => ({setOptions: jest.fn()}),
          push: jest.fn(),
        } as any}
        route={{params: {product: baseService}} as any}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Ratings & Reviews')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('4'));
    fireEvent.changeText(screen.getByPlaceholderText('Write a short review (optional)'), 'Helpful tech');

    await act(async () => {
      fireEvent.press(screen.getByText('Submit Review'));
    });

    await waitFor(() => {
      expect(createServiceListingReview).toHaveBeenCalledWith(31, {
        rating: 4,
        comment: 'Helpful tech',
      });
    });

    await waitFor(() => {
      expect(getServiceListingReviews).toHaveBeenCalledTimes(2);
      expect(getServiceListingDetail).toHaveBeenCalledTimes(2);
    });
  });
});
