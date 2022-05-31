const initialState = {
    isAuthenticated: false,
    user: {
        menu: "",
        socketLoaded: false,
        layouts: [],
        name: "",
        id: "",
        stripeId: "",
        stripeCustomerId: "",
        email: "",
        default_payment_method: "",
        paymentMethod: {
            billing_details: {
                email: "",
                name: "",
                phone: "",
            },
            card: {
                brand: "",
                exp_month: "",
                exp_year: "",
                last4: "",
            },
        },
    },
};

export default function (state = initialState, action) {
    switch (action.type) {
        case "SET_CURRENT_USER":
            return {
                ...state,
                isAuthenticated: true,
                user: {
                    ...state.user,
                    ...action.payload.user,
                },
            };
        case "STRIPE_SET_STRIPE_ID":
            return {
                ...state,
                user: {
                    ...state.user,
                    stripeId: action.id,
                },
            };
        case "LOGIN_SET_MANAGER_DATA":
            return {
                ...state,
                user: {
                    ...state.user,
                    stripeId: action.payload.stripeId,
                    stripeCustomerId: action.payload.stripeCustomerId,
                    default_payment_method:
                        action.payload.default_payment_method == null
                            ? ""
                            : action.payload.default_payment_method,
                    paymentMethod: action.payload.paymentMethod,
                },
            };
        case "PLANS_ATTACH_PAYMENT_METHOD":
            return {
                ...state,
                user: {
                    ...state.user,
                    default_payment_method:
                        action.payload.default_payment_method,
                    paymentMethod: {
                        ...state.user.paymentMethod,
                        billing_details: action.payload.billing_details,
                        card: action.payload.card,
                    },
                },
            };
        case "PLANS_DETACH_PAYMENT_METHOD":
            return {
                ...state,
                user: {
                    ...state.user,
                    default_payment_method: "",
                    paymentMethod: {
                        ...state.user.paymentMethod,
                        card: initialState.user.paymentMethod.card,
                    },
                },
            };
        case "SETTINGS_CHANGE_EMAIL":
            return {
                ...state,
                user: {
                    ...state.user,
                    email: action.email,
                },
            };
        case "LOGIN_SOCKET_LOADED":
            return {
                ...state,
                socketLoaded: true,
            };
        case "LOGOUT_USER":
            return {
                ...initialState,
                socketLoaded: true,
            };
        default:
            return state;
    }
}
