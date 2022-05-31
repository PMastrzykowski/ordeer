
export const registerEditField = payload => {
    return {
        type: 'REGISTER_EDIT_FIELD',
        payload
    }
}
export const registerValidate = (errors, valid) => {
    return {
        type: 'REGISTER_VALIDATE',
        payload: {
            errors,
            valid
        }
    }
}
export const registerActivationInvalid = () => {
    return {
        type: 'REGISTER_ACTIVATION_INVALID'
    }
}
export const registerSetStatus = status => {
    return {
        type: 'REGISTER_SET_STATUS',
        status
    }
}
export const registerTogglePassword = () => {
    return {
        type: 'REGISTER_TOGGLE_PASSWORD'
    }
}