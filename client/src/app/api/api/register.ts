import { useApi } from './apiService';

/**
 * @file register.ts
 * @brief services to call register/getpublishers APIs
 */



/**
 * @author Nicholas O'Sullivan, Parnika Jain
 * Register api call
 */
export const useRegister = () => {
    const { get } = useApi();
    const register = async () => {
        return await get('/register');
    };
    return { register };
};

/**
 * @author Nicholas O'Sullivan
 * getPublishers api call
 */
export const useGetPublishers = () => {
    const { get } = useApi();
    const getPublishers = async () => {
        return await get('/getPublishers');
    };
    return { getPublishers };
};