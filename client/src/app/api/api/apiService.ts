/**
 * @file apiService.ts
 * @brief Abstracted api service calls
 * @date 06-10-2024
 */

import axios, { AxiosInstance } from 'axios';
import { useAuth } from '@/context/auth-context';

const apiUrl = process.env.NEXT_PUBLIC_URL;


/**
 * Function to convert credentials to Base64
 * @param username - User's username
 * @param password - User's password
 * @returns Base64 encoded credentials
 */
export const base64Convert = async (username: string | undefined, password: string | undefined): Promise<string> => {
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);
    return encodedCredentials;
};

let baseURL = 'http://localhost:8080/api/v1'; // Default base URL

// Check if apiUrl is defined and use it if available
if (apiUrl) {
    baseURL = apiUrl;
    console.log("used diff baseurl:", baseURL)
}

// Create an Axios instance with a base URL
const api: AxiosInstance = axios.create({
    baseURL,
});

/**
 * Hook to use API methods
 */
interface ApiMethods {
    get: (url: string) => Promise<any>;
    post: (url: string, data: any) => Promise<any>;
}

export const useApi = (): ApiMethods => {
    const { auth } = useAuth();

    /**
     * Function to get authorization headers
     */
    const getAuthHeaders = async () => {
        const token = await base64Convert(auth?.username, auth?.password);
        return token ? { Authorization: `Basic ${token}` } : {};
    };

    /**
     * Function to perform GET request
     * @param url - API endpoint URL
     */
    const get = async (url: string) => {
        const headers = await getAuthHeaders();
        return api.get(url, { headers });
    };

    /**
     * Function to perform POST request
     * @param url - API endpoint URL
     * @param data - Data to be sent in the request body
     */
    const post = async (url: string, data: any) => {
        const headers = await getAuthHeaders();
        return api.post(url, data, { headers });
    };

    return { get, post };
};
