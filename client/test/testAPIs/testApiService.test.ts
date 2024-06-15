/**
 * @file apiService.test.ts
 * @brief Tests for the API service calls
 * @date 06-13-2024
 * @
 */

import {useApi, base64Convert} from '@/app/api/api/apiService';
import {renderHook} from '@testing-library/react';
import {useAuth} from '@/context/auth-context';
import axios from 'axios';

jest.mock('axios');
jest.mock('@/context/auth-context');

describe('apiService', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({data: 'test'});
    mockedAxios.post.mockResolvedValue({data: 'test'});

    (useAuth as jest.Mock).mockReturnValue({
      auth: {
        username: 'testuser',
        password: 'testpassword',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('base64Convert', () => {
    it('should convert username and password to base64', async () => {
      //arrange
      const username = 'testuser';
      const password = 'testpassword';

      //act
      const result = await base64Convert(username, password);
      //assert
      expect(result).toEqual('dGVzdHVzZXI6dGVzdHBhc3N3b3Jk');
    });
  });

  describe('useApi', () => {
    it('should return an object with get and post methods', () => {
      //act
      const {result} = renderHook(() => useApi());

      //assert
      expect(result.current).toEqual({
        get: expect.any(Function),
        post: expect.any(Function),
      });
    });
  });
});