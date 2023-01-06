const initialState = {
    valid: true,
    status: "ready", //forgot status
    fields: {
        email: "",
    },
    errors: {
        email: "",
    },
};

export const forgotReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FORGOT_EDIT_FIELD":
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...action.payload,
                },
            };
        case "FORGOT_VALIDATE":
            return {
                ...state,
                errors: {
                    ...state.errors,
                    ...action.payload.errors,
                },
                valid: action.payload.valid,
            };
        case "FORGOT_SET_STATUS":
            return {
                ...state,
                status: action.status,
            };
        case "FORGOT_INITIATE":
        case "LOGOUT_USER":
            return initialState;
        default:
            return state;
    }
};
