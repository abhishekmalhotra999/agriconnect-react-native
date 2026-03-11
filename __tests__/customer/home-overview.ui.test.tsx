import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import Home from '../../src/screens/Customer/Home';

const mockGetUserPreferences = jest.fn();
const mockGetMarketplaceProducts = jest.fn();
const mockGetServiceListings = jest.fn();

jest.mock('../../src/api/preferences.api', () => ({
  getUserPreferences: () => mockGetUserPreferences(),
}));

jest.mock('../../src/api/marketplace.api', () => ({
  getMarketplaceProducts: () => mockGetMarketplaceProducts(),
}));

jest.mock('../../src/api/services.api', () => ({
  getServiceListings: () => mockGetServiceListings(),
}));

jest.mock('../../src/contexts/UserContext', () => ({
  userContext: () => ({
    user: {
      name: 'Asha',
      accountType: 'customer',
    },
  }),
}));

jest.mock('../../src/store/storage', () => ({
  useAppSelector: (selector: any) =>
    selector({
      learn: {
        courses: [{id: 7, title: 'Soil Health Basics'}],
        lessonsProgress: [{courseId: 7, completedLessons: 2, totalLessons: 5}],
      },
    }),
}));

jest.mock('../../src/utils/util', () => ({
  normalize: (value: number) => value,
  topInsets: () => 0,
  bottomInsets: () => 0,
}));

jest.mock('../../src/containers/header', () => {
  const ReactLocal = require('react');
  const {Text: RNText} = require('react-native');

  return () => ReactLocal.createElement(RNText, {testID: 'home-header'}, 'header');
});

jest.mock('../../src/hooks/useStatusBarStyle', () => () => null);

const mockRegisterScrollRef = jest.fn();

jest.mock('../../src/contexts/ScrollContext', () => ({
  useScrollContext: () => ({
    registerScrollRef: mockRegisterScrollRef,
  }),
}));

jest.mock('../../src/components/UI/AnimatedScrollView', () => {
  const ReactLocal = require('react');
  const {ScrollView} = require('react-native');

  return ReactLocal.forwardRef(({children, headerContent}: any, ref: any) =>
    ReactLocal.createElement(ScrollView, {ref, testID: 'home-scroll'}, headerContent, children),
  );
});

jest.mock('../../src/components/UI/SearchBar', () => {
  const ReactLocal = require('react');
  const {TextInput: RNTextInput} = require('react-native');

  return ({placeholder}: any) =>
    ReactLocal.createElement(RNTextInput, {
      testID: 'home-search',
      placeholder,
    });
});

describe('home overview screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserPreferences.mockResolvedValue({
      savedItems: [{id: '1', type: 'product'}],
      recentItems: [
        {id: '11', type: 'service', title: 'Pump Repair'},
        {id: '12', type: 'course', title: 'Irrigation Course'},
      ],
    });
    mockGetMarketplaceProducts.mockResolvedValue([
      {
        id: 77,
        name: 'Fresh Tomato Box',
        category: 'Vegetables',
        discountedPrice: 'R100',
        image: {},
        price: 'R120',
        shortDescription: '',
        description: '',
        inStock: true,
        rating: 4,
        ratingCount: 5,
      },
    ]);
    mockGetServiceListings.mockResolvedValue([
      {
        id: 44,
        name: 'Irrigation Maintenance',
        serviceArea: 'Bong',
        image: {},
        category: 'Service',
        price: 'R0',
        discountedPrice: 'R0',
        shortDescription: '',
        description: '',
        inStock: true,
        rating: 4,
        ratingCount: 5,
      },
    ]);
  });

  it('renders home overview modules', async () => {
    const screen = render(
      <Home navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(mockGetUserPreferences).toHaveBeenCalled();
    });

    expect(screen.getByTestId('home-header')).toBeTruthy();
    expect(screen.getByTestId('home-search').props.placeholder).toBe('Search..');
    expect(screen.getByText('Fresh Harvest Week')).toBeTruthy();
    expect(screen.getByText('Welcome back, Asha')).toBeTruthy();
    expect(screen.getByText('Service Picks For You')).toBeTruthy();
    expect(screen.getByText('Marketplace Highlights')).toBeTruthy();
  });

  it('registers the home tab scroll reference for scroll-to-top behavior', async () => {
    render(<Home navigation={{navigate: jest.fn()} as any} route={{} as any} />);

    await waitFor(() => {
      expect(mockRegisterScrollRef).toHaveBeenCalledWith('HOME_TAB', expect.any(Object));
      expect(mockGetUserPreferences).toHaveBeenCalled();
      expect(mockGetMarketplaceProducts).toHaveBeenCalled();
      expect(mockGetServiceListings).toHaveBeenCalled();
    });
  });

  it('renders learning snapshot and routes recent items to relevant tabs', async () => {
    const navigate = jest.fn();
    const screen = render(<Home navigation={{navigate} as any} route={{} as any} />);

    await waitFor(() => {
      expect(screen.getByText('Learning Snapshot')).toBeTruthy();
      expect(screen.getByText('Soil Health Basics')).toBeTruthy();
      expect(screen.getByText('2/5 lessons completed')).toBeTruthy();
      expect(screen.getByText('1 course(s) in progress')).toBeTruthy();
      expect(screen.getByText('Pump Repair')).toBeTruthy();
      expect(screen.getByText('Irrigation Course')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Pump Repair'));
    fireEvent.press(screen.getByText('Irrigation Course'));

    expect(navigate).toHaveBeenCalledWith('Services');
    expect(navigate).toHaveBeenCalledWith('Learn');
  });
});
