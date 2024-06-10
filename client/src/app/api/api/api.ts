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
    const token = base64Convert(auth?.username, auth?.password);
    //console.log(auth);
    const register = async () => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await api.get('/register', {auth});
    }
    return {register};
};
/*
import { useAuth } from "@/context/auth-context";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1' // Replace with your backend URL
});

export const useApi = () => {
    const { auth } = useAuth();
    const register = async () => {
        // Ensure the auth object contains the token
        const headers = auth?.username ? { Authorization: `Bearer ${auth.username}` } : {};
        return await api.get('/register', { headers });
    };
 
    return { register };
}
*/

