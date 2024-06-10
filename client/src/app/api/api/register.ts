/**
 * @author Nicholas O'Sullivan, Parnika Jain
 * Register, getPublishers api call
 */

import { useApi } from './apiService';

export const useRegister = () => {
    const { get } = useApi();

    const register = async () => {
        return await get('/register');
    };

    return { register };
};

export const useGetPublishers = () => {
    const { get } = useApi();

    const getPublishers = async () => {
        return await get('/getPublishers');
    };

    return { getPublishers };
};