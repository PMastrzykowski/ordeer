const initialState = {
    valid: true,
    showPassword: false,
    showCurrentPassword: false,
    status: "ready",
    view: "edit-email",
    infoBox: {
        type: "",
        text: "",
    },
    fields: {
        name: "",
        email: "",
        password: "",
        passwordCurrent: "",
        code: "",
    },
    errors: {
        name: "",
        email: "",
        password: "",
        passwordCurrent: "",
        code: "",
    },
    defaults: {
        name: "",
        email: "",
    },
};

export const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SETTINGS_EDIT_FIELD":
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...action.payload,
                },
            };
        case "SETTINGS_SET_VIEW":
            return {
                ...state,
                view: action.view,
            };
        case "SETTINGS_CHANGE_NAME":
            return {
                ...state,
                status: "ready",
                infoBox: {
                    text: "Name changed successfully",
                    type: "success",
                },
                defaults: {
                    ...state.defaults,
                    name: action.name,
                },
                fields: {
                    ...state.fields,
                    name: action.name,
                },
            };
        case "SETTINGS_CHANGE_EMAIL":
            return {
                ...initialState,
                view: "edit-email",
                infoBox: {
                    text: "Email changed successfully",
                    type: "success",
                },
                defaults: {
                    ...state.defaults,
                    email: action.email,
                },
                fields: {
                    ...initialState.fields,
                    email: action.email,
                },
            };
        case "LOGIN_LOGIN_USER":
            return {
                ...state,
                defaults: {
                    ...state.defaults,
                    name: action.payload.name,
                    email: action.payload.email,
                },
                fields: {
                    ...state.fields,
                    name: action.payload.name,
                    email: action.payload.email,
                },
            };
        case "SETTINGS_VALIDATE":
            return {
                ...state,
                errors: {
                    ...state.errors,
                    ...action.payload.errors,
                },
                valid: action.payload.valid,
            };
        case "SETTINGS_SET_STATUS":
            return {
                ...state,
                status: action.status,
            };
        case "LOGOUT_USER":
            return initialState;
        case "SETTINGS_TOGGLE_CURRENT_PASSWORD":
            return {
                ...state,
                showCurrentPassword: !state.showCurrentPassword,
            };
        case "SETTINGS_TOGGLE_PASSWORD":
            return {
                ...state,
                showPassword: !state.showPassword,
            };
        case "SETTINGS_CLOSE_INFO_BOX":
            return {
                ...state,
                infoBox: initialState.infoBox,
            };
        case "SETTINGS_OPEN_INFO_BOX":
            return {
                ...state,
                infoBox: action.payload,
            };
        case "SETTINGS_RESET":
            return {
                ...initialState,
                defaults: {
                    ...initialState.defaults,
                    name: state.defaults.name,
                    email: state.defaults.email,
                },
                fields: {
                    ...initialState.fields,
                    name: state.defaults.name,
                    email: state.defaults.email,
                },
            };
        default:
            return state;
    }
};
