const initialState = {
    valid: true,
    accessToken: "",
    status: "ready", //forgot status
    showPassword: false,
    fields: {
        email: "",
        password: "",
    },
    errors: {
        email: "",
        password: "",
    },
};

export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_EDIT_FIELD":
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...action.payload,
                },
            };
        case "LOGIN_VALIDATE":
            return {
                ...state,
                errors: {
                    ...state.errors,
                    ...action.payload.errors,
                },
                valid: action.payload.valid,
            };
        case "LOGIN_SET_STATUS":
            return {
                ...state,
                status: action.status,
            };
        case "LOGIN_TOGGLE_PASSWORD":
            return {
                ...state,
                showPassword: !state.showPassword,
            };
        case "LOGIN_LOGIN_USER":
        case "LOGOUT_USER":
            return initialState;
        default:
            return state;
    }
};
