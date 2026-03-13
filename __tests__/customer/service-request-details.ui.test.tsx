import React from 'react';
import {render} from '@testing-library/react-native';
import ServiceRequestDetails from '../../src/screens/Customer/Services/request.show';

jest.mock('../../src/utils/util', () => ({
  normalize: (value: number) => value,
}));

jest.mock('../../src/containers/header', () => () => null);

jest.mock('@d11/react-native-fast-image', () => ({
  resizeMode: {
    cover: 'cover',
  },
}));

jest.mock('../../src/components/UI/Card', () => {
  const ReactLocal = require('react');
  const {View} = require('react-native');

  return ({children}: any) => ReactLocal.createElement(View, null, children);
});

jest.mock('../../src/components/UI/Item', () => {
  const ReactLocal = require('react');
  const {Text} = require('react-native');

  return ({label, value}: any) =>
    ReactLocal.createElement(Text, {testID: `item-${label}`}, String(value));
});

jest.mock('../../src/components/UI/ErrorText', () => {
  const ReactLocal = require('react');
  const {Text} = require('react-native');
  return ({text}: any) => ReactLocal.createElement(Text, null, text);
});

jest.mock('../../src/api/services.api', () => ({
  cancelMyServiceRequest: jest.fn(),
}));

const baseOrder = {
  id: 23,
  name: 'Pump Repair Request',
  amount: 'R0',
  quantity: 1,
  image: {},
  status: 'Pending',
  createdAt: '2026-03-11',
  requesterName: 'Asha',
  requesterPhone: '9111111111',
  requesterEmail: 'asha@example.com',
  message: 'Need help with motor issue.',
  rawStatus: 'new',
  emailDeliveryStatus: 'sent',
};

describe('customer service request details', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows cancel action for cancellable statuses', () => {
    const screen = render(
      <ServiceRequestDetails
        navigation={{goBack: jest.fn()} as any}
        route={{
          key: 'ServiceRequestDetails',
          name: 'ServiceRequestDetails',
          params: {order: baseOrder},
        } as any}
      />,
    );

    expect(screen.getByTestId('cancel-request-button')).toBeTruthy();
  });

  it('shows cancelled timeline state when request is cancelled', () => {
    const screen = render(
      <ServiceRequestDetails
        navigation={{goBack: jest.fn()} as any}
        route={{
          key: 'ServiceRequestDetails',
          name: 'ServiceRequestDetails',
          params: {
            order: {
              ...baseOrder,
              status: 'Cancelled',
              rawStatus: 'cancelled',
            },
          },
        } as any}
      />,
    );

    expect(screen.getByTestId('item-status').props.children).toBe('Cancelled');
    expect(screen.getAllByText('Cancelled').length).toBeGreaterThan(0);
    expect(screen.queryByTestId('cancel-request-button')).toBeNull();
  });

  it('shows timeline and request metadata for open requests', () => {
    const screen = render(
      <ServiceRequestDetails
        navigation={{goBack: jest.fn()} as any}
        route={{
          key: 'ServiceRequestDetails',
          name: 'ServiceRequestDetails',
          params: {order: baseOrder},
        } as any}
      />,
    );

    expect(screen.getByText('Message')).toBeTruthy();
    expect(screen.getByText('Need help with motor issue.')).toBeTruthy();
    expect(screen.getByText('New')).toBeTruthy();
    expect(screen.getByText('In Progress')).toBeTruthy();
    expect(screen.getByText('Resolved')).toBeTruthy();
  });

  it('hides cancel action for non-cancellable statuses', () => {
    const screen = render(
      <ServiceRequestDetails
        navigation={{goBack: jest.fn()} as any}
        route={{
          key: 'ServiceRequestDetails',
          name: 'ServiceRequestDetails',
          params: {
            order: {
              ...baseOrder,
              status: 'In Progress',
              rawStatus: 'in_progress',
            },
          },
        } as any}
      />,
    );

    expect(screen.queryByTestId('cancel-request-button')).toBeNull();
  });
});
