/**
 * @file sheets.ts
 * @brief services to call 'Sheets' APIs
 * @author Nicholas O'Sullivan
 */

import { useApi } from './apiService';

//requires publishername
export const useGetSheets = () => {
    const { post } = useApi();

    const getSheets = async (publisher: string) => {
        return await post('/getSheets', { publisher });
    };
    return { getSheets };
};

//requires publishername, sheetname
export const useCreateSheet = () => {
    const { post } = useApi();

    const getSheets = async (publisher: string) => {
        return await post('/getSheets', { publisher });
    };
    return { getSheets };
};