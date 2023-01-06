export const settingsEditField = (payload) => {
    return {
        type: "SETTINGS_EDIT_FIELD",
        payload,
    };
};
export const settingsValidate = (errors, valid) => {
    return {
        type: "SETTINGS_VALIDATE",
        payload: {
            errors,
            valid,
        },
    };
};
export const settingsSetStatus = (status) => {
    return {
        type: "SETTINGS_SET_STATUS",
        status,
    };
};
export const settingsChangeName = (name) => {
    return {
        type: "SETTINGS_CHANGE_NAME",
        name,
    };
};
export const settingsChangeEmail = (email) => {
    return {
        type: "SETTINGS_CHANGE_EMAIL",
        email,
    };
};
export const settingsTogglePassword = () => {
    return {
        type: "SETTINGS_TOGGLE_PASSWORD",
    };
};
export const settingsToggleCurrentPassword = () => {
    return {
        type: "SETTINGS_TOGGLE_CURRENT_PASSWORD",
    };
};
export const settingsCloseInfoBox = () => {
    return {
        type: "SETTINGS_CLOSE_INFO_BOX",
    };
};
export const settingsOpenInfoBox = (payload) => {
    return {
        type: "SETTINGS_OPEN_INFO_BOX",
        payload,
    };
};
export const settingsSetView = (view) => {
    return {
        type: "SETTINGS_SET_VIEW",
        view,
    };
};
export const settingsReset = () => {
    return {
        type: "SETTINGS_RESET",
    };
};
