const initialState = {
    account: null,
    balance: null,
    tokenError: false,
    loading: false,
    payOutLoading: false,
    init: {
        fields: {
            business_name: '',
            first_name: '',
            last_name: '',
            country: ''
        },
        errors: {
            business_name: '',
            first_name: '',
            last_name: '',
            country: ''
        },
        valid: true
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'STRIPE_TOKEN_ERROR':
            return {
                ...state,
                tokenError: true
            }
        case 'STRIPE_START_LOADING':
            return {
                ...state,
                loading: true
            }
        case 'STRIPE_STOP_LOADING':
            return {
                ...state,
                loading: false
            }
        case 'STRIPE_SET_STRIPE_DATA':
            return {
                ...state,
                account: action.data.account,
                balance: action.data.balance,
                loading: false
            }
        case 'STRIPE_PAYOUT_LOADING':
            return {
                ...state,
                payOutLoading: true
            }
        case 'STRIPE_SUCCESSFUL_PAYOUT':
            return {
                ...state,
                balance: {
                    ...state.balance,
                    available: state.balance.available.map((object, index) => index === 0 ? ({
                        ...object,
                        amount: 0
                    })
                        : object
                    )
                },
                payOutLoading: false
            }
        case 'STRIPE_INIT_VALIDATE':
            return {
                ...state,
                init: {
                    ...state.init,
                    valid: action.payload.valid,
                    errors: {
                        ...state.init.errors,
                        ...action.payload.errors
                    }
                }
            }
        case 'STRIPE_INIT_CHANGE':
            return {
                ...state,
                init: {
                    ...state.init,
                    fields: {
                        ...state.init.fields,
                        ...action.payload
                    }
                }
            }
        case 'LOGOUT_USER':
            return initialState;
        default:
            return state;
    }
}