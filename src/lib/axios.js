import Axios from 'axios'
import { useUsers } from '../stores/user'

const axios = Axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    withCredentials: true,
    withXSRFToken: true,
});

const setBearerToken= (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
export  {axios,setBearerToken};
