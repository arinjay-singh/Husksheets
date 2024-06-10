/**
 * @file update.ts
 * @brief services to call 'updates' APIs
 * @author Nicholas O'Sullivan
 */

import { useApi } from './apiService';
import {useAuth} from "@/context/auth-context";


//requires publisher (we get from ss context), sheet (we get from ss context), payload (get from updates localfile)
export const useUpdatePublished = () => {
    const { post } = useApi();
    const { auth } = useAuth();
    const publisher = auth?.username

    const updatePublished = async (sheet: string) => {
        return await post('/updatePublished', {publisher, sheet});
    };
    return { updatePublished };
};


