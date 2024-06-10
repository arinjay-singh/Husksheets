/**
 * @file apiService.ts
 * @brief Abstracted api service calls
 * @date 06-10-2024
 */

import axios from 'axios';
import { useAuth } from '@/context/auth-context';


/**
@author Parnika Jain
 Function to convert credentials to Base64
 */
export const base64Convert = async (username: string | undefined, password: string | undefined): Promise<string> => {
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);
    return `${encodedCredentials}`;
};

// Create an Axios instance with a base URL
export const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1' // Replace with your backend URL
});




/**
 * @author Nicholas O'Sullivan, Parnika Jaan
 * Hook to use API methods
 */
//set expected in/out
interface ApiMethods {
    get: (url: string) => Promise<any>;
    post: (url: string, data: any) => Promise<any>;
}

export const useApi = (): ApiMethods => {
    const { auth } = useAuth();

    const getAuthHeaders = async () => {
        const token = await base64Convert(auth?.username, auth?.password);
        return token ? { Authorization: `Basic ${token}` } : {};
    };

    const get = async (url: string) => {
        const headers = await getAuthHeaders();
        return api.get(url, { headers });
    };

    const post = async (url: string, data: any) => {
        const headers = await getAuthHeaders();
        return api.post(url, data, { headers });
    };


    return { get, post };
};