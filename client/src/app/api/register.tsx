import axios from "axios";

const axiosClient = axios.create();

axiosClient.defaults.baseURL = "http://localhost:8080/api/v1"

export async function getRequest(URL: string) {
    const response = await axiosClient.get(URL)
    .then(response => response)
    .catch(err=>console.log(err))

    return response.data
}