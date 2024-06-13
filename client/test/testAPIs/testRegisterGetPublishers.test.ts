import { useRegister, useGetPublishers } from '../../src/app/api/api/register';
import { useApi } from '../../src/app/api/api/apiService';
import { describe } from 'node:test';

jest.mock('../../src/app/api/api/apiService');

/**
 * @file testRegisterGetPublishers.test.ts
 * @brief Tests for the Register/GetPublishers api's
 * @author Nicholas O'Sullivan
 */

describe('useRegister', () => {
    it('should call the register API', async () => {
        const mockGet = jest.fn().mockResolvedValue({});
        (useApi as jest.Mock).mockReturnValue({ get: mockGet });

        const { register } = useRegister();
        await register();

        expect(mockGet).toHaveBeenCalledWith('/register');
    });
});


describe('useGetPublishers', () => {
  it('should call the getPublishers API and return publishers', async () => {
    const mockResponse = {
      data: {
        value: {
          1: { publisher: 'Team5' },
        },
      },
    };
    const mockGet = jest.fn().mockResolvedValue(mockResponse);
    (useApi as jest.Mock).mockReturnValue({ get: mockGet });

    const { getPublishers } = useGetPublishers();
    const publishers = await getPublishers();

    expect(mockGet).toHaveBeenCalledWith('/getPublishers');
    expect(publishers).toEqual(['Team5']);
  });
});