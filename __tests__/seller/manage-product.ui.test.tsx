import {act, fireEvent, render, waitFor} from '@testing-library/react-native';
import React from 'react';
import ManageMyProduct from '../../src/screens/Vendor/MyProducts/manage';
import {
  createMarketplaceProduct,
  updateMarketplaceProduct,
} from '../../src/api/marketplace.api';
import {
  createServiceListing,
  getServiceCategories,
  updateServiceListing,
} from '../../src/api/services.api';
import {userContext} from '../../src/contexts/UserContext';
import {launchImageLibrary} from 'react-native-image-picker';

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
  getServiceCategories: jest.fn(),
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

  it('creates published technician service with local thumbnail file payload', async () => {
    (userContext as unknown as jest.Mock).mockReturnValue({
      user: {
        accountType: 'technician',
        email: 'tech@acme.com',
        profile: {professionType: 'technician'},
      },
    });
    (getServiceCategories as jest.Mock).mockResolvedValueOnce([
      {id: 4, name: 'Irrigation'},
      {id: 5, name: 'Repair'},
    ]);
    (launchImageLibrary as jest.Mock).mockResolvedValueOnce({
      assets: [
        {
          uri: 'file:///tmp/local-thumbnail.jpg',
          type: 'image/jpeg',
          fileName: 'local-thumbnail.jpg',
        },
      ],
      didCancel: false,
    });
    (createServiceListing as jest.Mock).mockResolvedValueOnce({});

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

    await waitFor(() => {
      expect(getServiceCategories).toHaveBeenCalled();
      expect(screen.getByText('Irrigation')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByPlaceholderText('Enter service title'), 'Field Pump Fix');
    fireEvent.changeText(screen.getByPlaceholderText('e.g. Montserrado, Bong'), 'Bong');
    fireEvent.changeText(screen.getByPlaceholderText('Contact email'), 'dispatch@acme.com');
    fireEvent.press(screen.getByText('Repair'));

    await act(async () => {
      fireEvent.press(screen.getByText('Upload Thumbnail'));
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Publish'));
    });

    await waitFor(() => {
      expect(createServiceListing).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Field Pump Fix',
          serviceCategoryId: 5,
          serviceArea: 'Bong',
          contactEmail: 'dispatch@acme.com',
          isActive: true,
          mainPictureUrl: undefined,
          mainPictureFile: expect.objectContaining({
            uri: 'file:///tmp/local-thumbnail.jpg',
          }),
        }),
      );
      expect(goBack).toHaveBeenCalled();
    });
  });

  it('updates technician service with remote thumbnail url payload', async () => {
    (userContext as unknown as jest.Mock).mockReturnValue({
      user: {
        accountType: 'technician',
        email: 'tech@acme.com',
        profile: {professionType: 'technician'},
      },
    });
    (getServiceCategories as jest.Mock).mockResolvedValueOnce([{id: 2, name: 'Irrigation'}]);
    (updateServiceListing as jest.Mock).mockResolvedValueOnce({});

    const goBack = jest.fn();
    const screen = render(
      <ManageMyProduct
        navigation={{goBack} as any}
        route={{
          key: 'ManageMyProduct',
          name: 'ManageMyProduct',
          params: {
            product: {
              id: 55,
              name: 'Existing Service',
              image: {},
              imageUrl: 'https://cdn.example.com/service.png',
              categoryId: 2,
              category: 'Service',
              serviceArea: 'Montserrado',
              contactEmail: 'old@acme.com',
              status: 'published',
              price: '0',
              discountedPrice: '0',
              stockQuantity: 0,
              shortDescription: '',
              description: 'old description',
              inStock: true,
              rating: 0,
              ratingCount: 0,
            },
          },
        } as any}
      />,
    );

    await waitFor(() => {
      expect(getServiceCategories).toHaveBeenCalled();
    });

    fireEvent.changeText(screen.getByPlaceholderText('Contact email'), 'new@acme.com');

    await act(async () => {
      fireEvent.press(screen.getByText('Publish'));
    });

    await waitFor(() => {
      expect(updateServiceListing).toHaveBeenCalledWith(
        55,
        expect.objectContaining({
          serviceCategoryId: 2,
          serviceArea: 'Montserrado',
          contactEmail: 'new@acme.com',
          isActive: true,
          mainPictureUrl: 'https://cdn.example.com/service.png',
          mainPictureFile: undefined,
        }),
      );
      expect(goBack).toHaveBeenCalled();
    });
  });
});
