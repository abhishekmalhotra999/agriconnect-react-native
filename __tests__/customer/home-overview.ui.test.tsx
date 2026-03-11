import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import Home from '../../src/screens/Customer/Home';

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

jest.mock('../../src/components/UI/ImageSlider', () => {
  const ReactLocal = require('react');
  const {View: RNView} = require('react-native');

  return () => ReactLocal.createElement(RNView, {testID: 'home-slider'});
});

jest.mock('../../src/components/Customer/Category/CategoryList', () => {
  const ReactLocal = require('react');
  const {View: RNView} = require('react-native');

  return () => ReactLocal.createElement(RNView, {testID: 'home-categories'});
});

jest.mock('../../src/components/Customer/Product/ProductGrid', () => {
  const ReactLocal = require('react');
  const {View: RNView} = require('react-native');

  return () => ReactLocal.createElement(RNView, {testID: 'home-product-grid'});
});

describe('home overview screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders home overview modules', () => {
    const screen = render(
      <Home navigation={{navigate: jest.fn()} as any} route={{} as any} />,
    );

    expect(screen.getByTestId('home-header')).toBeTruthy();
    expect(screen.getByTestId('home-search').props.placeholder).toBe('Search..');
    expect(screen.getByTestId('home-slider')).toBeTruthy();
    expect(screen.getByTestId('home-categories')).toBeTruthy();
    expect(screen.getByTestId('home-product-grid')).toBeTruthy();
  });

  it('registers the home tab scroll reference for scroll-to-top behavior', async () => {
    render(<Home navigation={{navigate: jest.fn()} as any} route={{} as any} />);

    await waitFor(() => {
      expect(mockRegisterScrollRef).toHaveBeenCalledWith('HOME_TAB', expect.any(Object));
    });
  });
});
