import { useAuth } from "@/context/auth-context";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Replace with your backend URL
});

export const useApi = () => {
    const { auth } = useAuth();
    const register = async () => await api.get('/register', {auth});
    return {register};
};