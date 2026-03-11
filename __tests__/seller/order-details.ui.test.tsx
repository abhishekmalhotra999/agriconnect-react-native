import React from 'react';
import {render} from '@testing-library/react-native';
import OrderDetails from '../../src/screens/Vendor/Orders/show';

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

jest.mock('../../src/components/UI/Separator', () => () => null);

jest.mock('../../src/components/Vendor/Order/OrderInfo', () => {
  const ReactLocal = require('react');
  const {Text} = require('react-native');

  return () => ReactLocal.createElement(Text, {testID: 'order-info'}, 'order-info');
});

describe('seller order details screen', () => {
  it('renders request metadata fields for technician request details', () => {
    const screen = render(
      <OrderDetails
        navigation={{goBack: jest.fn()} as any}
        route={{
          key: 'OrderDetails',
          name: 'OrderDetails',
          params: {
            order: {
              id: 17,
              name: 'Pump Repair',
              image: {},
              price: 'R100',
              status: 'Pending',
              createdAt: '2026-03-10',
              requesterName: 'Asha',
              requesterPhone: '9111111111',
              requesterEmail: 'asha@example.com',
              message: 'Need support for irrigation line.',
              emailDeliveryStatus: 'sent',
              rawStatus: 'new',
            },
          },
        } as any}
      />,
    );

    expect(screen.getByText('Request Details')).toBeTruthy();
    expect(screen.getByText('requester')).toBeTruthy();
    expect(screen.getByText('Asha')).toBeTruthy();
    expect(screen.getByText('phone')).toBeTruthy();
    expect(screen.getByText('9111111111')).toBeTruthy();
    expect(screen.getByText('email')).toBeTruthy();
    expect(screen.getByText('asha@example.com')).toBeTruthy();
    expect(screen.getByText('message')).toBeTruthy();
    expect(screen.getByText('Need support for irrigation line.')).toBeTruthy();
    expect(screen.getByText('email delivery')).toBeTruthy();
    expect(screen.getByText('sent')).toBeTruthy();
    expect(screen.getByText('raw status')).toBeTruthy();
    expect(screen.getByText('new')).toBeTruthy();
  });

  it('shows fallback placeholders when request metadata is missing', () => {
    const screen = render(
      <OrderDetails
        navigation={{goBack: jest.fn()} as any}
        route={{
          key: 'OrderDetails',
          name: 'OrderDetails',
          params: {
            order: {
              id: 18,
              name: 'Soil Advisory',
              image: {},
              price: 'R80',
              status: 'Resolved',
              createdAt: '2026-03-11',
            },
          },
        } as any}
      />,
    );

    expect(screen.getByText('Request Details')).toBeTruthy();
    expect(screen.getByText('unknown')).toBeTruthy();
    expect(screen.getByText('raw status')).toBeTruthy();
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });
});
