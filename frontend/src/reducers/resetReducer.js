const initialState = {
    status: "loading", //loading, ready, failed, success
    showPassword: false,
    valid: true,
    id: "",
    fields: {
        password: "",
    },
    errors: {
        password: "",
    },
};

export const resetReducer = (state = initialState, action) => {
    switch (action.type) {
        case "RESET_SET_ID":
            return {
                ...state,
                id: action.id,
            };
        case "RESET_EDIT_FIELD":
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...action.payload,
                },
            };
        case "RESET_VALIDATE":
            return {
                ...state,
                errors: {
                    ...state.errors,
                    ...action.payload.errors,
                },
                valid: action.payload.valid,
            };
        case "RESET_SET_STATUS":
            return {
                ...state,
                status: action.status,
            };
        case "RESET_TOGGLE_PASSWORD":
            return {
                ...state,
                showPassword: !state.showPassword,
            };
        default:
            return state;
    }
};
