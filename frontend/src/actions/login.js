import jwt_decode from "jwt-decode";
import { setAuthToken } from "../helpers/auth";
import { socket } from "../socket";

export const setCurrentUser = (token) => {
    try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            return;
        }
        return {
            type: "SET_CURRENT_USER",
            payload: {
                user: decoded,
                isAuthenticated: true,
            },
        };
    } catch (error) {
        console.log("👾 invalid token format", error);
        return;
    }
};

export const loginUser = (token) => (dispatch) => {
    localStorage.setItem("jwtToken", token);
    if (typeof socket !== "undefined") {
        socket.emit("login");
    }
    setAuthToken(token);
    dispatch(setCurrentUser(token));
};

export const logoutUser = (history) => (dispatch) => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    socket.emit("logout");
    dispatch({ type: "LOGOUT_USER" });
    if (history) {
        history.push("/login");
    }
};
export const loginEditField = (payload) => {
    return {
        type: "LOGIN_EDIT_FIELD",
        payload,
    };
};
export const loginValidate = (errors, valid) => {
    return {
        type: "LOGIN_VALIDATE",
        payload: {
            errors,
            valid,
        },
    };
};
export const loginSetStatus = (status) => {
    return {
        type: "LOGIN_SET_STATUS",
        status,
    };
};

export const loginTogglePassword = () => {
    return {
        type: "LOGIN_TOGGLE_PASSWORD",
    };
};

export const loginSetManagerData = (payload) => {
    return {
        type: "LOGIN_SET_MANAGER_DATA",
        payload,
    };
};
export const loginSocketLoaded = () => {
    return {
        type: "LOGIN_SOCKET_LOADED",
    };
};
