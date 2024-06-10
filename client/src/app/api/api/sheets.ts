import { useAuth } from "@/context/auth-context";
import axios from "axios";

export const api = axios.create({ // added export
    baseURL: 'http://localhost:8080/api/v1' // Replace with your backend URL
});

export const base64Convert = async (username: string | undefined, password: string | undefined): Promise<string> => {
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);
    return `${encodedCredentials}`;
};

export const useApi = () => {
    const { auth } = useAuth();
    //console.log(auth);
    const register = async () => {
        const token = await base64Convert(auth?.username, auth?.password);
        const headers = token ? { Authorization: `Basic ${token}` } : {};
        await api.get('/register', { headers });
    }
    return {register};
};


