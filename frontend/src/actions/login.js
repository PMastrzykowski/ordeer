export const loginLoginUser = (payload) => {
    return {
        type: "LOGIN_LOGIN_USER",
        payload,
    };
};
export const loginLogoutUser = () => {
    return { type: "LOGIN_LOGOUT_USER" };
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
