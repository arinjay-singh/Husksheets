/**
 * @file apiService.test.ts
 * @brief Tests for the API service calls
 * @date 06-13-2024
 */

import { base64Convert, useApi } from '../../src/app/api/api/apiService'; // Adjust the import path
import { useAuth } from '@/context/auth-context';
import axios from 'axios';

jest.mock('@/context/auth-context');
jest.mock('axios');

describe('apiService', () => {
  const mockAuth = { username: 'testuser', password: 'testpass' };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ auth: mockAuth });
    jest.clearAllMocks();
  });

  describe('base64Convert', () => {
    it('should convert credentials to Base64', async () => {
      const encodedCredentials = await base64Convert('testuser', 'testpass');
      expect(encodedCredentials).toBe(btoa('testuser:testpass'));
    });

    it('should handle undefined credentials', async () => {
      const encodedCredentials = await base64Convert(undefined, undefined);
      expect(encodedCredentials).toBe(btoa('undefined:undefined'));
    });
  });

  describe('useApi', () => {
    const mockGet = jest.fn();
    const mockPost = jest.fn();

    beforeEach(() => {
      (axios.create as jest.Mock).mockReturnValue({
        get: mockGet,
        post: mockPost,
      });
    });

    it('should get data with correct headers', async () => {
      const { get } = useApi();
      const token = btoa(`${mockAuth.username}:${mockAuth.password}`);
      const headers = { Authorization: `Basic ${token}` };

      mockGet.mockResolvedValue({ data: 'response' });

      const response = await get('/test-url');

      expect(mockGet).toHaveBeenCalledWith('/test-url', { headers });
      expect(response.data).toBe('response');
    });

    it('should post data with correct headers', async () => {
      const { post } = useApi();
      const token = btoa(`${mockAuth.username}:${mockAuth.password}`);
      const headers = { Authorization: `Basic ${token}` };

      mockPost.mockResolvedValue({ data: 'response' });

      const response = await post('/test-url', { key: 'value' });

      expect(mockPost).toHaveBeenCalledWith('/test-url', { key: 'value' }, { headers });
      expect(response.data).toBe('response');
    });

    it('should handle undefined auth data for get request', async () => {
      (useAuth as jest.Mock).mockReturnValue({ auth: undefined });
      const { get } = useApi();

      mockGet.mockResolvedValue({ data: 'response' });

      const response = await get('/test-url');

      expect(mockGet).toHaveBeenCalledWith('/test-url', { headers: {} });
      expect(response.data).toBe('response');
    });

    it('should handle undefined auth data for post request', async () => {
      (useAuth as jest.Mock).mockReturnValue({ auth: undefined });
      const { post } = useApi();

      mockPost.mockResolvedValue({ data: 'response' });

      const response = await post('/test-url', { key: 'value' });

      expect(mockPost).toHaveBeenCalledWith('/test-url', { key: 'value' }, { headers: {} });
      expect(response.data).toBe('response');
    });
  });
});
