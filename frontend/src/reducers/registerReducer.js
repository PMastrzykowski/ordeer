const initialState = {
    valid: true,
    showPassword: false,
    status: "ready",
    fields: {
        name: "",
        email: "",
        password: "",
    },
    errors: {
        name: "",
        email: "",
        password: "",
    },
};

export const registerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "REGISTER_EDIT_FIELD":
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...action.payload,
                },
            };
        case "REGISTER_VALIDATE":
            return {
                ...state,
                errors: {
                    ...state.errors,
                    ...action.payload.errors,
                },
                valid: action.payload.valid,
            };
        case "REGISTER_SET_STATUS":
            return {
                ...state,
                status: action.status,
            };
        case "REGISTER_TOGGLE_PASSWORD":
            return {
                ...state,
                showPassword: !state.showPassword,
            };
        case "REGISTER_INITIATE":
        case "LOGIN_LOGIN_USER":
        case "LOGOUT_USER":
            return initialState;
        default:
            return state;
    }
};
