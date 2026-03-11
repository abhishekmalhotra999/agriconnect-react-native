import {act, fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import ManageMyProduct from '../../src/screens/Vendor/MyProducts/manage';
import {
  createMarketplaceProduct,
  updateMarketplaceProduct,
} from '../../src/api/marketplace.api';
import {userContext} from '../../src/contexts/UserContext';

jest.mock('../../src/utils/util', () => ({
  normalize: (value: number) => value,
  topInsets: () => 0,
  bottomInsets: () => 0,
  capitalize: (value: string) => value,
  getImageSource: (value: unknown) => value,
  headerHeight: () => 50,
}));

jest.mock('../../src/containers/header', () => () => null);

jest.mock('../../src/contexts/UserContext', () => ({
  userContext: jest.fn(),
}));

jest.mock('../../src/api/marketplace.api', () => ({
  createMarketplaceProduct: jest.fn(),
  updateMarketplaceProduct: jest.fn(),
}));

jest.mock('../../src/api/services.api', () => ({
  createServiceListing: jest.fn(),
  updateServiceListing: jest.fn(),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn().mockResolvedValue({didCancel: true}),
}));

describe('manage product UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (userContext as unknown as jest.Mock).mockReturnValue({
      user: {
        accountType: 'farmer',
        profile: {professionType: 'farmer'},
      },
    });
  });

  it('loads product status and stock from route and submits publish update', async () => {
    (updateMarketplaceProduct as jest.Mock).mockResolvedValueOnce({});

    const goBack = jest.fn();
    const screen = render(
      <ManageMyProduct
        navigation={{goBack} as any}
        route={{
          key: 'ManageMyProduct',
          name: 'ManageMyProduct',
          params: {
            product: {
              id: 99,
              name: 'Old Rice',
              price: '44',
              discountedPrice: '44',
              image: {},
              category: 'General',
              status: 'published',
              imageUrl: 'https://cdn.example.com/p.png',
              stockQuantity: 8,
              shortDescription: '',
              description: 'old',
              inStock: true,
              rating: 0,
              ratingCount: 0,
            },
          },
        } as any}
      />,
    );

    expect(screen.getByText('Status: published')).toBeTruthy();
    expect(screen.getByDisplayValue('8')).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText('Enter product title'), 'New Rice');
    fireEvent.changeText(screen.getByPlaceholderText('Price (e.g. 100)'), '50');
    fireEvent.changeText(screen.getByPlaceholderText('Stock quantity'), '10');

    await act(async () => {
      fireEvent.press(screen.getByText('Publish'));
    });

    await waitFor(() => {
      expect(updateMarketplaceProduct).toHaveBeenCalledWith(
        99,
        expect.objectContaining({
          title: 'New Rice',
          unitPrice: 50,
          stockQuantity: 10,
          status: 'published',
        }),
      );
      expect(goBack).toHaveBeenCalled();
    });
  });

  it('creates draft product for farmer', async () => {
    (createMarketplaceProduct as jest.Mock).mockResolvedValueOnce({});

    const goBack = jest.fn();
    const screen = render(
      <ManageMyProduct
        navigation={{goBack} as any}
        route={{
          key: 'ManageMyProduct',
          name: 'ManageMyProduct',
          params: {},
        } as any}
      />,
    );

    fireEvent.changeText(screen.getByPlaceholderText('Enter product title'), 'Cassava');
    fireEvent.changeText(screen.getByPlaceholderText('Price (e.g. 100)'), '20');
    fireEvent.changeText(screen.getByPlaceholderText('Stock quantity'), '5');

    await act(async () => {
      fireEvent.press(screen.getByText('Save as Draft'));
    });

    await waitFor(() => {
      expect(createMarketplaceProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Cassava',
          unitPrice: 20,
          stockQuantity: 5,
          status: 'draft',
        }),
      );
      expect(goBack).toHaveBeenCalled();
    });
  });
});
