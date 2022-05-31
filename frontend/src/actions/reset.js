
export const resetSetId = id => {
    return {
        type: 'RESET_SET_ID',
        id
    }
}
export const resetSetStatus = status => {
    return {
        type: 'RESET_SET_STATUS',
        status
    }
}
export const resetEditField = payload => {
    return {
        type: 'RESET_EDIT_FIELD',
        payload
    }
}
export const resetValidate = (errors, valid) => {
    return {
        type: 'RESET_VALIDATE',
        payload: {
            errors,
            valid
        }
    }
}
export const resetInvalid = () => {
    return {
        type: 'RESET_INVALID'
    }
}
export const resetTogglePassword = () => {
    return {
        type: 'RESET_TOGGLE_PASSWORD'
    }
}