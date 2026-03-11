import AsyncStorage from '@react-native-async-storage/async-storage';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {signup} from '../../src/api/auth';
import {userContext} from '../../src/contexts/UserContext';
import PersonalDetail from '../../src/screens/Auth/PersonalDetail';
import FirmDetail from '../../src/screens/Auth/FirmDetail';
import {useAppDispatch, useAppSelector} from '../../src/store/storage';

jest.mock('../../src/utils/util', () => ({
  normalize: (value: number) => value,
  topInsets: () => 0,
  bottomInsets: () => 0,
  capitalize: (value: string) => value,
  getImageSource: (value: unknown) => value,
  headerHeight: () => 50,
}));

jest.mock('../../src/api/auth', () => ({
  signup: jest.fn(),
}));

jest.mock('../../src/store/storage', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../../src/contexts/UserContext', () => ({
  userContext: jest.fn(),
}));

jest.mock('../../src/store/slices/signup.slice', () => ({
  signupActions: {
    saveInitialUserDetail: (payload: unknown) => ({
      type: 'signup/saveInitialUserDetail',
      payload,
    }),
  },
}));

jest.mock('../../src/store/slices/auth.slice', () => ({
  authActions: {
    saveAuthToken: (payload: unknown) => ({
      type: 'auth/saveAuthToken',
      payload,
    }),
    saveUserDetail: (payload: unknown) => ({
      type: 'auth/saveUserDetail',
      payload,
    }),
  },
}));

jest.mock('../../src/components/UI/HeaderBack', () => () => null);

jest.mock('../../src/components/UI/NumberSlider', () => {
  const ReactLocal = require('react');
  const {TouchableOpacity, Text} = require('react-native');

  return ({onChange}: {onChange: (value: string) => void}) => (
    <TouchableOpacity
      testID="mock-years-slider"
      onPress={() => onChange('7')}>
      <Text>Set Years</Text>
    </TouchableOpacity>
  );
});

describe('farmer signup UI journey', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAppDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (userContext as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
    });

    (useAppSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({
        signup: {
          phone: '123456789',
          email: '',
          name: 'Farmer Joe',
          accountType: 'Farmer',
          profile: {
            professionType: 'Farmer',
            address: 'Fallback Address',
          },
        },
      }),
    );
  });

  it('moves farmer from personal details to firm details, then submits a merged final payload', async () => {
    const personalScreen = render(
      <PersonalDetail
        navigation={{navigate: mockNavigate, goBack: jest.fn()} as any}
        route={{key: 'PersonalDetail', name: 'PersonalDetail'} as any}
      />,
    );

    fireEvent.changeText(personalScreen.getByPlaceholderText('Mail Id'), 'farmer@example.com');
    fireEvent.changeText(personalScreen.getByPlaceholderText('Password'), 'secret123');
    fireEvent.changeText(personalScreen.getByPlaceholderText('confirm password'), 'secret123');
    fireEvent.changeText(personalScreen.getByPlaceholderText('Your Address'), 'Village Road');

    fireEvent.press(personalScreen.getByText(/Next/));

    await waitFor(() => {
      expect(signup).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(
        'FirmDetail',
        expect.objectContaining({
          accountType: 'Farmer',
          personalDetails: expect.objectContaining({
            email: 'farmer@example.com',
            address: 'Village Road',
            password: 'secret123',
            confirmPassword: 'secret123',
            phone: '123456789',
            name: 'Farmer Joe',
            professionType: 'Farmer',
          }),
        }),
      );
    });

    const firmRouteParams = mockNavigate.mock.calls[0][1];

    (signup as jest.Mock).mockResolvedValueOnce({
      user: {
        jwtToken: 'jwt-farmer',
        profile: {
          professionType: 'Farmer',
        },
      },
    });

    const firmScreen = render(
      <FirmDetail
        navigation={{navigate: mockNavigate, goBack: jest.fn()} as any}
        route={{
          key: 'FirmDetail',
          name: 'FirmDetail',
          params: firmRouteParams,
        } as any}
      />,
    );

    fireEvent.changeText(firmScreen.getByPlaceholderText('Type of farming'), 'Organic');
    fireEvent.changeText(
      firmScreen.getByPlaceholderText('Size of farm (in acre or hectare)'),
      '12 acres',
    );
    fireEvent.press(firmScreen.getByTestId('mock-years-slider'));
    fireEvent.press(firmScreen.getByText('Submit Now'));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'farmer@example.com',
          address: 'Village Road',
          password: 'secret123',
          confirmPassword: 'secret123',
          phone: '123456789',
          name: 'Farmer Joe',
          professionType: 'Farmer',
          farmingType: 'Organic',
          farmSize: '12 acres',
          yearsOfExperience: '7',
        }),
      );
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'jwt-farmer');
      expect(mockLogin).toHaveBeenCalledWith(
        expect.objectContaining({jwtToken: 'jwt-farmer'}),
      );
    });
  });

  it('treats lowercase farmer accountType as farmer and submits farmer fields', async () => {
    (signup as jest.Mock).mockResolvedValueOnce({
      user: {
        jwtToken: 'jwt-farmer-lower',
        profile: {
          professionType: 'farmer',
        },
      },
    });

    const firmScreen = render(
      <FirmDetail
        navigation={{navigate: mockNavigate, goBack: jest.fn()} as any}
        route={{
          key: 'FirmDetail-lower',
          name: 'FirmDetail',
          params: {
            accountType: 'farmer',
            personalDetails: {
              email: 'lower@example.com',
              address: 'Lower Address',
              password: 'secret123',
              confirmPassword: 'secret123',
              phone: '123456789',
              name: 'Lower Farmer',
              professionType: 'farmer',
            },
          },
        } as any}
      />,
    );

    fireEvent.changeText(firmScreen.getByPlaceholderText('Type of farming'), 'Mixed');
    fireEvent.changeText(
      firmScreen.getByPlaceholderText('Size of farm (in acre or hectare)'),
      '4 hectares',
    );
    fireEvent.press(firmScreen.getByTestId('mock-years-slider'));
    fireEvent.press(firmScreen.getByText('Submit Now'));

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith(
        expect.objectContaining({
          professionType: 'farmer',
          farmingType: 'Mixed',
          farmSize: '4 hectares',
          yearsOfExperience: '7',
        }),
      );
    });
  });
});
