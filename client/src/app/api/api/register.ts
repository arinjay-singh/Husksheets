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
        const value =  publisherData.data.value;
        let publishers: string[] = [];
        Object.keys(value).forEach(key => {
            publishers.push(value[key].publisher)
        })
        return publishers;
    };
    return { getPublishers };
};