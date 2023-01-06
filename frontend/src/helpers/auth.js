import axios from "axios";
import { api } from "../api";

axios.defaults.withCredentials = true;
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = token;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};
export const getToken = async () => {
    try {
        const res = await axios.post(`${api}/api/users/refresh_token`);
        setAuthToken(res.data.access_token);
        return { success: true, token: res.data.access_token };
    } catch (err) {
        return { success: false, err };
    }
};
export const getUser = async () => {
    try {
        const data = await axios.get(`${api}/api/users/getuser`);
        return { success: true, data };
    } catch (err) {
        return { success: false, err };
    }
};
export const getData = async () => {
    const token = await getToken();
    if (!token.success) {
        return { success: false };
    }
    const user = await getUser();
    if (!user.success) {
        return { success: false };
    }
    return { success: true, user: user.data };
};
