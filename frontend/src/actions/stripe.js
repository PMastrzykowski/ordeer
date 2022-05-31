export const stripeTokenError = () => {
    return {
        type: 'STRIPE_TOKEN_ERROR'
    }
}
export const stripeStartLoading = () => {
    return {
        type: 'STRIPE_START_LOADING'
    }
}
export const stripeStopLoading = () => {
    return {
        type: 'STRIPE_STOP_LOADING'
    }
}
export const stripeSetStripeData = (data) => {
    return {
        type: 'STRIPE_SET_STRIPE_DATA',
        data
    }
}
export const stripeSetError = (err) => {
    return {
        type: 'STRIPE_SET_ERROR',
        err
    }
}
export const stripePayoutLoading = () => {
    return {
        type: 'STRIPE_PAYOUT_LOADING'
    }
}
export const stripeSuccessfulPayout = () => {
    return {
        type: 'STRIPE_SUCCESSFUL_PAYOUT'
    }
}
export const stripeInitValidate = (errors, valid) => {
    return {
        type: 'STRIPE_INIT_VALIDATE',
        payload: {
            errors,
            valid
        }
    }
}
export const stripeInitChange = (payload) => {
    return {
        type: 'STRIPE_INIT_CHANGE',
        payload
    }
}
export const stripeSetStripeId = (id) => {
    return {
        type: 'STRIPE_SET_STRIPE_ID',
        id
    }
}
export const stripeSetProducts = (payload) => {
    return {
        type: 'STRIPE_SET_PRODUCTS',
        payload
    }
}
export const stripeSetPrices = (payload) => {
    return {
        type: 'STRIPE_SET_PRICES',
        payload
    }
}