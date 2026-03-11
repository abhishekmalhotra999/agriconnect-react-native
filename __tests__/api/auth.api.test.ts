import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginHandler, sendOtp} from '../../src/api/auth';
import apiClient from '../../src/api/apiClient';

jest.mock('../../src/api/apiClient', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockedClient = apiClient as unknown as {
  post: jest.Mock;
};

describe('auth.api', () => {
  beforeEach(() => {
    mockedClient.post.mockReset();
    (AsyncStorage.setItem as jest.Mock).mockReset();
  });

  it('uses identifier payload for sign in and stores jwt token', async () => {
    mockedClient.post.mockResolvedValueOnce({
      data: {
        user: {
          id: 1,
          jwtToken: 'token-123',
        },
      },
    });

    const result = await loginHandler({
      phone: '987654321',
      password: 'pass1234',
    });

    expect(mockedClient.post).toHaveBeenCalledWith('/api/sign_in', {
      identifier: '987654321',
      password: 'pass1234',
    });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'token-123');
    expect(result.user.jwtToken).toBe('token-123');
  });

  it('normalizes OTP account type to lowercase for backend role parser', async () => {
    mockedClient.post.mockResolvedValueOnce({
      data: {status: 'ok'},
    });

    await sendOtp({
      name: 'John',
      phone: '987654321',
      accountType: 'Technician',
    });

    expect(mockedClient.post).toHaveBeenCalledWith(
      '/api/get_otp',
      {
        name: 'John',
        phone: '987654321',
        accountType: 'technician',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });
});
