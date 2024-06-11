import { useApi } from './apiService';

/**
 * @file register.ts
 * @brief services to call register/getpublishers APIs
 */



/**
 * @author Nicholas O'Sullivan
 * @author Parnika Jain
 * @author Arinjay Singh
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
        const publisherData =  await get('/getPublishers');
        const values =  publisherData.data.values;
        let publishers: string[] = [];
        Object.keys(values).forEach(key => {
            publishers.push(values[key].publisher)
        })
        return publishers;
    };
    return { getPublishers };
};