import { useRegister, useGetPublishers } from '../../src/app/api/api/register';
import { useApi } from '../../src/app/api/api/apiService';

jest.mock('../../src/app/api/api/apiService');

describe('useRegister', () => {
    it('should call the register API', async () => {
        const mockGet = jest.fn().mockResolvedValue({});
        (useApi as jest.Mock).mockReturnValue({ get: mockGet });

        const { register } = useRegister();
        await register();

        expect(mockGet).toHaveBeenCalledWith('/register');
    });
});