const initialState = {
    status: "ready",
};

export const activateReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ACTIVATE_SET_STATUS":
            return {
                ...state,
                status: action.status,
            };
        default:
            return state;
    }
};
