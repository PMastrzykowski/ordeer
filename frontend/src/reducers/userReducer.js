const initialState = {
    isAuthenticated: false,
    isTokenSet: false,
    isUserSet: false,
    name: "",
    id: "",
    email: "",
    language: "en",
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SETTINGS_CHANGE_NAME":
            return {
                ...state,
                name: action.name,
            };
        case "SETTINGS_CHANGE_EMAIL":
            return {
                ...state,
                email: action.email,
            };
        case "LOGIN_LOGIN_USER":
            return {
                ...initialState,
                isAuthenticated: true,
                name: action.payload.name,
                email: action.payload.email,
                language: action.payload.language,
                id: action.payload._id,
            };
        case "LOGIN_LOGOUT_USER":
            return {
                ...initialState,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};
