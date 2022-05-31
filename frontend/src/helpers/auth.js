import axios from 'axios';
axios.defaults.withCredentials = true;
export const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
    }
    else {
        delete axios.defaults.headers.common['Authorization'];
    }
}