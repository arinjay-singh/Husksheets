/**
 * @file sheets.ts
 * @brief services to call 'Sheets' APIs
 * @author Nicholas O'Sullivan
 */

import { useApi } from './apiService';
import {useAuth} from "@/context/auth-context";

//requires publishername
export const useGetSheets = () => {
    const { post } = useApi();

    const getSheets = async (publisher: string) => {
        return await post('/getSheets', { publisher: "Team5" });
    };
    return { getSheets };
};

//requires publishername (we get from auth context), sheetname (user decides sheetname in UI)
export const useCreateSheet = () => {
    const { post } = useApi();
    const { auth } = useAuth();
    const publisher = auth?.username

    const createSheet = async (sheet: string) => {
        return await post('/createSheet', {publisher, sheet: "testingNoMore" });
    };
    return { createSheet };
};

// //requires publishername (we get from auth context), sheetname (user decides sheetname in UI)
// export const useDeleteSheet = () => {
//     const { post } = useApi();
//     const { auth } = useAuth();
//     const publisher = auth?.username
//
//     const createSheet = async (sheet: string) => {
//         return await post('/createSheet', {publisher, sheet: "testingNoMore" });
//     };
//     return { createSheet };
// };