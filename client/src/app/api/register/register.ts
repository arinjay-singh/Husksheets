import axios from "axios";
import { useEffect, useState } from "react";
import LoginPage from "@/app/login/page";
import { useAuth } from "@/context/auth-context";

export const base64Convert = async (username: string, password: string): Promise<string> => {
    const credentials = '${username}:${password}';
    const encodedCredentials = btoa(credentials);
    return 'Basic ${encodedCredentials}';
};



const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // Replace with your backend URL
    headers: {
        'Authorization': useAuth, // data from arinjay through import
          },
    });

const setAuthHeader = async(username:string, password: string) => {
    const authHeader
}

useEffect(() => {
    axios.get('http://localhost:8080/api/v1')
    .then(res)
}, [])
     
    export const getEndpointData = async () => {
    try {
    const response = await api.get('/register', {
        //send data here. It will be fetched by backend as it is
    });
    const returnValue = {response.data.success, response.data.payload} // typescript object
    return response.data;
      } catch (error) {
        console.error('Error fetching data from endpoint', error);
    throw error;
      }
    };

    export const base64Convert = async (username: String, password: String) => {
         // encode to base 64 btoa
         // await
        //give data to authorization
    }