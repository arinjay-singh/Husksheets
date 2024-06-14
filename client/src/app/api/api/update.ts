/**
 * @file update.ts
 * @brief services to call 'updates' APIs
 * @author Nicholas O'Sullivan
 */

import { useApi } from './apiService';
import {useAuth} from "@/context/auth-context";


/**
 * @args publisher (owner of sheet open), sheet (sheet open), payload (get from updates localfile),
 * isOwner (if owner use updatePublished, if subscriber use updateSubscription).
 */
export const useUpdate = () => {
    const { post } = useApi();

    const updatePublished = async (publisher: string, sheet: string, payload: string, isOwner: boolean) => {
        if (isOwner) {
            console.log('Payload:', payload);
            return await post('/updatePublished', {publisher, sheet, payload});
        } else {
            return await post('/updateSubscription', {publisher, sheet, payload});
        }
    };
    return { updatePublished };
};

/**
 * @args publisher (owner of sheet open), sheet (sheet open), id (retrieve updates from version 'id' to latest)
 */
export const useGetUpdatesForSubscription = () => {
    const { post } = useApi();
    const getUpdatesForSubscription = async (publisher: string, sheet: string, id: number) => {
        const response = await  post('/getUpdatesForSubscription', {publisher, sheet, id});
        return response.data.value.map(response.data.value[0].payload);
    };
    return { getUpdatesForSubscription };
};

/**
 * @args publisher (owner of sheet open), sheet (sheet open), id (retrieve updates from version 'id' to latest)
 */
export const useGetUpdatesForPublished = () => {
    const { post } = useApi();
    const getUpdatesForPublished = async (publisher: string, sheet: string, id: number) => {
        const response = await post('/getUpdatesForPublished', { publisher, sheet, id });
        return response.data.value.map((item: any) => item.payload);
    };
    return { getUpdatesForPublished };
};


