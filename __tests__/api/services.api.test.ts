import {
  createServiceListingReview,
  createServiceListing,
  createServiceRequest,
  getServiceCategories,
  getMyServiceRequests,
  getServiceListingDetail,
  getServiceListingReviews,
  getMyServiceListings,
  getServiceRequestsForTechnician,
  getServiceListings,
  updateServiceListing,
} from '../../src/api/services.api';
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

describe('services.api', () => {
  beforeEach(() => {
    mockedClient.get.mockReset();
    mockedClient.post.mockReset();
    mockedClient.put.mockReset();
  });

  it('maps my service listings to Product cards', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 9,
          title: 'Irrigation Support',
          description: 'Field irrigation setup and checks',
          is_active: true,
          main_picture_url: '/uploads/service.png',
          category: {id: 2, name: 'Technician'},
          avgRating: 4.4,
          reviewCount: 6,
        },
      ],
    });

    const result = await getMyServiceListings();

    expect(mockedClient.get).toHaveBeenCalledWith('/api/services/listings/mine');
    expect(result[0]).toMatchObject({
      id: 9,
      name: 'Irrigation Support',
      category: 'Technician',
      status: 'published',
      inStock: true,
    });
    expect(result[0].image).toEqual({uri: 'http://localhost:3000/uploads/service.png'});
  });

  it('loads public service listings for customers', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          title: 'General Farm Checkup',
          description: 'Technician visit for diagnostics',
          is_active: true,
        },
      ],
    });

    const result = await getServiceListings();

    expect(mockedClient.get).toHaveBeenCalledWith('/api/services/listings');
    expect(result[0]).toMatchObject({
      id: 1,
      name: 'General Farm Checkup',
      status: 'published',
    });
  });

  it('loads service categories for filters', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {id: 2, name: 'Irrigation'},
        {id: 3, name: 'Repair'},
      ],
    });

    const result = await getServiceCategories();

    expect(mockedClient.get).toHaveBeenCalledWith('/api/services/categories');
    expect(result).toEqual([
      {id: 2, name: 'Irrigation'},
      {id: 3, name: 'Repair'},
    ]);
  });

  it('applies local search fallback after listing fetch', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          title: 'General Farm Checkup',
          description: 'Technician visit for diagnostics',
          is_active: true,
        },
        {
          id: 2,
          title: 'Pump Repair',
          description: 'Fix irrigation pumps',
          is_active: true,
        },
      ],
    });

    const result = await getServiceListings({search: 'pump'});

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Pump Repair');
  });

  it('maps service listing detail gallery URLs', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: {
        id: 10,
        title: 'Pump Repair',
        description: 'Fix irrigation pump issues',
        gallery_urls: ['/uploads/a.png', '/uploads/b.png'],
        technician: {name: 'Tech 1', email: 'tech1@example.com'},
      },
    });

    const result = await getServiceListingDetail(10);

    expect(mockedClient.get).toHaveBeenCalledWith('/api/services/listings/10');
    expect(result.product.name).toBe('Pump Repair');
    expect(result.images).toEqual([
      {uri: 'http://localhost:3000/uploads/a.png'},
      {uri: 'http://localhost:3000/uploads/b.png'},
    ]);
    expect(result.technicianName).toBe('Tech 1');
  });

  it('loads and maps service listing reviews', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {id: 1, rating: 5, comment: 'Great service', reviewer: {id: 9, name: 'Asha'}},
      ],
    });

    const result = await getServiceListingReviews(10);

    expect(mockedClient.get).toHaveBeenCalledWith('/api/services/listings/10/reviews');
    expect(result).toEqual([
      {id: 1, rating: 5, comment: 'Great service', reviewer: {id: 9, name: 'Asha'}},
    ]);
  });

  it('posts service listing review payload', async () => {
    mockedClient.post.mockResolvedValueOnce({data: {id: 2}});

    await createServiceListingReview(10, {
      rating: 4,
      comment: 'Helpful',
    });

    expect(mockedClient.post).toHaveBeenCalledWith('/api/services/listings/10/reviews', {
      rating: 4,
      comment: 'Helpful',
    });
  });

  it('maps technician requests to Order cards with readable statuses', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 44,
          message: 'Need a farm equipment inspection',
          status: 'in_progress',
          requester_name: 'Amit',
          requester_phone: '9000000000',
          created_at: '2025-01-30T10:00:00.000Z',
          listing: {
            title: 'Equipment Inspection',
            thumbnail_url: '/uploads/request.png',
          },
        },
      ],
    });

    const result = await getServiceRequestsForTechnician();

    expect(mockedClient.get).toHaveBeenCalledWith(
      '/api/services/requests/for-technician',
    );
    expect(result[0]).toMatchObject({
      id: 44,
      name: 'Equipment Inspection',
      status: 'In Progress',
      createdAt: '2025-01-30',
      amount: 'R0',
      quantity: 1,
    });
    expect(result[0].image).toEqual({uri: 'http://localhost:3000/uploads/request.png'});
  });

  it('posts create service listing payload in backend contract shape', async () => {
    mockedClient.post.mockResolvedValueOnce({
      data: {
        id: 101,
        title: 'Soil Checkup',
        description: 'Comprehensive soil analysis',
        is_active: false,
      },
    });

    await createServiceListing({
      title: 'Soil Checkup',
      description: 'Comprehensive soil analysis',
      serviceArea: 'Rural Zone A',
      contactEmail: 'tech@example.com',
      isActive: false,
      mainPictureUrl: '',
    });

    expect(mockedClient.post).toHaveBeenCalledWith(
      '/api/services/listings',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  });

  it('posts service request payload in backend contract shape', async () => {
    mockedClient.post.mockResolvedValueOnce({
      data: {
        id: 501,
        status: 'new',
      },
    });

    await createServiceRequest({
      serviceListingId: 99,
      requesterName: 'Rahul',
      requesterPhone: '9999999999',
      requesterEmail: 'rahul@example.com',
      message: 'Need urgent help',
    });

    expect(mockedClient.post).toHaveBeenCalledWith('/api/services/requests', {
      service_listing_id: 99,
      requester_name: 'Rahul',
      requester_phone: '9999999999',
      requester_email: 'rahul@example.com',
      message: 'Need urgent help',
    });
  });

  it('loads and maps customer service requests', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 61,
          status: 'new',
          created_at: '2025-02-10T10:00:00.000Z',
          requester_name: 'Anita',
          requester_phone: '9111111111',
          listing: {
            title: 'Soil Advisory',
          },
        },
      ],
    });

    const result = await getMyServiceRequests();

    expect(mockedClient.get).toHaveBeenCalledWith('/api/services/requests/mine');
    expect(result[0]).toMatchObject({
      id: 61,
      name: 'Soil Advisory',
      status: 'Pending',
      createdAt: '2025-02-10',
      requesterName: 'Anita',
      requesterPhone: '9111111111',
      emailDeliveryStatus: undefined,
    });
  });

  it('maps email delivery status when available', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 80,
          status: 'new',
          email_delivery_status: 'sent',
          created_at: '2025-03-01T10:00:00.000Z',
          requester_name: 'Vani',
          requester_phone: '9555555555',
          listing: {title: 'Crop Advisory'},
        },
      ],
    });

    const result = await getMyServiceRequests();
    expect(result[0].emailDeliveryStatus).toBe('sent');
    expect(result[0].rawStatus).toBe('new');
  });

  it('normalizes request statuses for accepted/cancelled/fallback cases', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 71,
          status: 'accepted',
          created_at: '2025-02-11T10:00:00.000Z',
          requester_name: 'Kiran',
          requester_phone: '9222222222',
          listing: {title: 'Drip Irrigation Setup'},
        },
        {
          id: 72,
          status: 'cancelled',
          created_at: '2025-02-12T10:00:00.000Z',
          requester_name: 'Meera',
          requester_phone: '9333333333',
          listing: {title: 'Soil Testing'},
        },
        {
          id: 73,
          status: 'unexpected_state',
          created_at: '2025-02-13T10:00:00.000Z',
          requester_name: 'Ravi',
          requester_phone: '9444444444',
          listing: {title: 'Tractor Service'},
        },
      ],
    });

    const result = await getMyServiceRequests();

    expect(result[0].status).toBe('Accepted');
    expect(result[1].status).toBe('Cancelled');
    expect(result[2].status).toBe('Pending');
  });

  it('updates service listing payload with id path', async () => {
    mockedClient.put.mockResolvedValueOnce({
      data: {
        id: 55,
        title: 'Updated Listing',
        description: 'updated',
        is_active: true,
      },
    });

    await updateServiceListing(55, {
      title: 'Updated Listing',
      description: 'updated',
      serviceArea: '',
      contactEmail: '',
      isActive: true,
      mainPictureUrl: 'https://cdn.example.com/service.png',
    });

    expect(mockedClient.put).toHaveBeenCalledWith(
      '/api/services/listings/55',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  });
});
