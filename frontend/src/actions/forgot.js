export const forgotValidate = (errors, valid) => {
    return {
        type: "FORGOT_VALIDATE",
        payload: {
            errors,
            valid,
        },
    };
};
export const forgotSetStatus = (status) => {
    return {
        type: "FORGOT_SET_STATUS",
        status,
    };
};
export const forgotEditField = (payload) => {
    return {
        type: "FORGOT_EDIT_FIELD",
        payload,
    };
};
export const forgotInitiate = () => {
    return {
        type: "FORGOT_INITIATE",
    };
};
