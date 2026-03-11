import {
  createMarketplaceProductReview,
  createMarketplaceProduct,
  getMarketplaceProductDetail,
  getMarketplaceProductReviews,
  getMarketplaceProducts,
  getMarketplaceProductsByCategory,
  getMyMarketplaceProducts,
  updateMarketplaceProduct,
} from '../../src/api/marketplace.api';
import apiClient from '../../src/api/apiClient';

jest.mock('../../src/api/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    defaults: {
      baseURL: 'http://localhost:3000',
    },
  },
}));

const mockedClient = apiClient as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
};

describe('marketplace.api', () => {
  beforeEach(() => {
    mockedClient.get.mockReset();
    mockedClient.post.mockReset();
    mockedClient.put.mockReset();
  });

  it('maps marketplace products to RN Product shape', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 7,
          title: 'Organic Rice',
          unit_price: 120,
          stock_quantity: 8,
          description: 'Fresh harvest rice',
          main_picture_url: '/uploads/rice.png',
          category: {name: 'Crops'},
          farmer: {name: 'Farmer Joe', phone: '+91 9000012345'},
          avgRating: 4.8,
          reviewCount: 12,
        },
      ],
    });

    const result = await getMarketplaceProducts();

    expect(mockedClient.get).toHaveBeenCalledWith('/api/marketplace/products');
    expect(result[0]).toMatchObject({
      id: 7,
      name: 'Organic Rice',
      price: 'R120',
      discountedPrice: 'R120',
      category: 'Crops',
      inStock: true,
      rating: 4.8,
      ratingCount: 12,
      sellerName: 'Farmer Joe',
      sellerPhone: '+91 9000012345',
    });
    expect(result[0].image).toEqual({uri: 'http://localhost:3000/uploads/rice.png'});
  });

  it('loads seller products from mine endpoint', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 3,
          title: 'Farm Pump',
          unit_price: 80,
          stock_quantity: 0,
          category: {name: 'Equipment'},
        },
      ],
    });

    const result = await getMyMarketplaceProducts();

    expect(mockedClient.get).toHaveBeenCalledWith('/api/marketplace/products/mine');
    expect(result[0].inStock).toBe(false);
  });

  it('loads products by category query', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 21,
          title: 'Category Product',
          unit_price: 55,
          stock_quantity: 22,
          category: {id: 2, name: 'Seeds'},
        },
      ],
    });

    const result = await getMarketplaceProductsByCategory(2);

    expect(mockedClient.get).toHaveBeenCalledWith('/api/marketplace/products', {
      params: {category_id: 2},
    });
    expect(result[0].name).toBe('Category Product');
  });

  it('returns mapped product detail with normalized gallery images', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: {
        id: 11,
        title: 'Hybrid Seeds',
        unit_price: 65,
        stock_quantity: 4,
        gallery_urls: ['/uploads/seed-1.png', '/uploads/seed-2.png'],
      },
    });

    const result = await getMarketplaceProductDetail(11);

    expect(mockedClient.get).toHaveBeenCalledWith('/api/marketplace/products/11');
    expect(result.product.name).toBe('Hybrid Seeds');
    expect(result.images).toEqual([
      {uri: 'http://localhost:3000/uploads/seed-1.png'},
      {uri: 'http://localhost:3000/uploads/seed-2.png'},
    ]);
  });

  it('gets marketplace product reviews', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [{id: 1, rating: 5, comment: 'Great'}],
    });

    const result = await getMarketplaceProductReviews(11);

    expect(mockedClient.get).toHaveBeenCalledWith('/api/marketplace/products/11/reviews');
    expect(result).toEqual([{id: 1, rating: 5, comment: 'Great', reviewer: null}]);
  });

  it('posts marketplace product review', async () => {
    mockedClient.post.mockResolvedValueOnce({data: {id: 3}});

    await createMarketplaceProductReview(7, {rating: 4, comment: 'Nice'});

    expect(mockedClient.post).toHaveBeenCalledWith('/api/marketplace/products/7/reviews', {
      rating: 4,
      comment: 'Nice',
    });
  });

  it('creates draft product with mapped payload keys', async () => {
    mockedClient.post.mockResolvedValueOnce({
      data: {
        id: 41,
        title: 'Draft Product',
        unit_price: 99,
        stock_quantity: 3,
      },
    });

    await createMarketplaceProduct({
      title: 'Draft Product',
      description: 'desc',
      unitPrice: 99,
      stockQuantity: 3,
      status: 'draft',
      mainPictureUrl: 'https://cdn.example.com/p.png',
    });

    expect(mockedClient.post).toHaveBeenCalledWith(
      '/api/marketplace/products',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  });

  it('updates product with published status payload', async () => {
    mockedClient.put.mockResolvedValueOnce({
      data: {
        id: 55,
        title: 'Updated Product',
        unit_price: 130,
        stock_quantity: 9,
        status: 'published',
      },
    });

    await updateMarketplaceProduct(55, {
      title: 'Updated Product',
      description: 'updated',
      categoryId: 7,
      unitPrice: 130,
      stockQuantity: 9,
      status: 'published',
      mainPictureUrl: '',
    });

    expect(mockedClient.put).toHaveBeenCalledWith(
      '/api/marketplace/products/55',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  });
});
