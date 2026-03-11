import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import Orders from '../../src/screens/Vendor/Orders';
import {getServiceRequestsForTechnician} from '../../src/api/services.api';
import {userContext} from '../../src/contexts/UserContext';

jest.mock('../../src/utils/util', () => ({
  normalize: (value: number) => value,
  topInsets: () => 0,
  bottomInsets: () => 0,
  headerHeight: () => 50,
}));

jest.mock('../../src/containers/header', () => () => null);

jest.mock('../../src/hooks/useStatusBarStyle', () => () => null);

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void) => {
    const ReactLocal = require('react');
    ReactLocal.useEffect(() => {
      const cleanup = callback();
      return cleanup;
    }, [callback]);
  },
}));

jest.mock('../../src/components/UI/AnimatedScrollView', () => {
  const ReactLocal = require('react');
  const {ScrollView} = require('react-native');

  return ({children, headerContent}: any) =>
    ReactLocal.createElement(ScrollView, {testID: 'orders-scroll'}, headerContent, children);
});

jest.mock('../../src/components/UI/SearchBar', () => {
  const ReactLocal = require('react');
  const {TextInput} = require('react-native');

  return ({value, onChangeText, placeholder}: any) =>
    ReactLocal.createElement(TextInput, {
      testID: 'orders-search',
      value,
      onChangeText,
      placeholder,
    });
});

jest.mock('../../src/components/UI/Filters', () => {
  const ReactLocal = require('react');
  const {View, Text, TouchableOpacity} = require('react-native');

  return ({options, onFilterChange}: any) =>
    ReactLocal.createElement(
      View,
      null,
      ...options.map((option: string) =>
        ReactLocal.createElement(
          TouchableOpacity,
          {
            key: option,
            testID: `orders-filter-${option.toLowerCase().replace(/\s+/g, '-')}`,
            onPress: () => onFilterChange(option),
          },
          ReactLocal.createElement(Text, null, option),
        ),
      ),
    );
});

jest.mock('../../src/components/Vendor/Order/OrderList', () => {
  const ReactLocal = require('react');
  const {View, Text, TouchableOpacity} = require('react-native');

  return ({orderLists, onPress}: any) =>
    ReactLocal.createElement(
      View,
      null,
      ReactLocal.createElement(Text, {testID: 'orders-count'}, String(orderLists.length)),
      ReactLocal.createElement(
        Text,
        {testID: 'orders-order'},
        orderLists.map((item: any) => item.name).join('|'),
      ),
      ...orderLists.map((item: any) =>
        ReactLocal.createElement(
          TouchableOpacity,
          {
            key: String(item.id),
            testID: `orders-item-${item.id}`,
            onPress: () => onPress?.(item),
          },
          ReactLocal.createElement(Text, null, item.name),
        ),
      ),
    );
});

jest.mock('../../src/components/UI/ErrorText', () => {
  const ReactLocal = require('react');
  const {Text} = require('react-native');

  return ({text}: any) => ReactLocal.createElement(Text, null, text);
});

jest.mock('../../src/contexts/UserContext', () => ({
  userContext: jest.fn(),
}));

jest.mock('../../src/api/services.api', () => ({
  getServiceRequestsForTechnician: jest.fn(),
}));

const mockOrders = [
  {
    id: 1,
    name: 'Pump Repair',
    status: 'Pending',
    rawStatus: 'resolved',
    requesterName: 'Asha',
    requesterPhone: '9111111111',
    requesterEmail: 'asha@example.com',
    message: 'Need urgent irrigation repair',
  },
  {
    id: 2,
    name: 'Soil Advisory',
    status: 'In Progress',
    rawStatus: 'in_progress',
    requesterName: 'Vani',
    requesterPhone: '9222222222',
    requesterEmail: 'vani@example.com',
    message: 'Need advisory session',
  },
  {
    id: 3,
    name: 'Harvest Support',
    status: 'New',
    rawStatus: 'new',
    requesterName: 'John',
    requesterPhone: '9333333333',
    requesterEmail: 'john@example.com',
    message: 'Need help with storage planning',
  },
];

describe('seller orders technician behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (userContext as unknown as jest.Mock).mockReturnValue({
      user: {
        accountType: 'technician',
        profile: {professionType: 'technician'},
      },
    });
    (getServiceRequestsForTechnician as jest.Mock).mockResolvedValue(mockOrders);
  });

  it('filters requests by selected status using label or raw status', async () => {
    const screen = render(
      <Orders navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('orders-count').props.children).toBe('3');
    });

    fireEvent.press(screen.getByTestId('orders-filter-resolved'));

    await waitFor(() => {
      expect(screen.getByTestId('orders-count').props.children).toBe('1');
      expect(screen.getByTestId('orders-order').props.children).toBe('Pump Repair');
    });
  });

  it('filters requests by free-text search across request fields', async () => {
    const screen = render(
      <Orders navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('orders-count').props.children).toBe('3');
    });

    fireEvent.changeText(screen.getByTestId('orders-search'), 'irrigation');

    await waitFor(() => {
      expect(screen.getByTestId('orders-count').props.children).toBe('1');
      expect(screen.getByTestId('orders-order').props.children).toBe('Pump Repair');
    });
  });

  it('opens order details when a request card is selected', async () => {
    const navigate = jest.fn();
    const screen = render(
      <Orders navigation={{navigate} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Pump Repair')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('orders-item-2'));

    expect(navigate).toHaveBeenCalledWith('OrderDetails', {
      order: expect.objectContaining({id: 2, name: 'Soil Advisory'}),
    });
  });

  it('shows account-type guard for non-technician users', async () => {
    (userContext as unknown as jest.Mock).mockReturnValue({
      user: {
        accountType: 'customer',
        profile: {professionType: 'customer'},
      },
    });

    const screen = render(
      <Orders navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    await waitFor(() => {
      expect(
        screen.getByText('Orders are currently available for technician accounts.'),
      ).toBeTruthy();
    });

    expect(getServiceRequestsForTechnician).not.toHaveBeenCalled();
  });
});
