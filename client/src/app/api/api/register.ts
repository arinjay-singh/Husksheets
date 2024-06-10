
import { useApi } from './apiService';

export const useRegister = () => {
    const { get } = useApi();

    const register = async () => {
        return await get('/register');
    };

    return { register };
};