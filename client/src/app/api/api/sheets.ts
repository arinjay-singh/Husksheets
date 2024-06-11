/**
 * @file sheets.ts
 * @brief services to call 'Sheets' APIs
 * @author Nicholas O'Sullivan
 * @author Parnika Jain
 */

import { useApi } from './apiService';
import {useAuth} from "@/context/auth-context";

//requires publishername (user decides publishername in UI)
export const useGetSheets = () => {
    const { post } = useApi();
    const getSheets = async (publisher: string) => {
        const sheetData = await post('/getSheets', { publisher });
        const values = sheetData.data.values;
        let sheets: string[] = [];
        Object.keys(values).forEach(key => {
            sheets.push(values[key].sheet)
        })
        return sheets;
    };
    return { getSheets };
};

//requires publishername (we get from auth context), sheetname (user decides sheetname in UI)
export const useCreateSheet = () => {
    const { post } = useApi();
    const { auth } = useAuth();
    const publisher = auth?.username

    const createSheet = async (publisher:string, sheet: string) => {
        return await post('/createSheet', { publisher, sheet });
    };
    return { createSheet };
};


//requires publishername (we get from auth context), sheetname (user decides sheetname in UI)
export const useDeleteSheet = () => {
    const { post } = useApi();
    const { auth } = useAuth();
    const publisher = auth?.username

    const deleteSheet = async (sheet: string) => {
        return await post('/deleteSheet', {publisher, sheet});
    };
    return { deleteSheet };
};