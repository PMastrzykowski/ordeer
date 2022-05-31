
export const settingsOpenModal = (view) => {
    return {
        type: 'SETTINGS_OPEN_MODAL',
        view
    }
}
export const settingsCloseModal = () => {
    return {
        type: 'SETTINGS_CLOSE_MODAL'
    }
}
export const settingsEditField = (payload) => {
    return {
        type: 'SETTINGS_EDIT_FIELD',
        payload
    }
}
export const settingsValidate = (errors, valid) => {
    return {
        type: 'SETTINGS_VALIDATE',
        payload: {
            errors,
            valid
        }
    }
}
export const settingsSetStatus = (status) => {
    return {
        type: 'SETTINGS_SET_STATUS',
        status
    }
}
export const settingsChangeEmail = (email, token) => {
    return {
        type: 'SETTINGS_CHANGE_EMAIL',
        email
    }
}
export const settingsTogglePassword = () => {
    return {
        type: 'SETTINGS_TOGGLE_PASSWORD'
    }
}
export const settingsToggleCurrentPassword = () => {
    return {
        type: 'SETTINGS_TOGGLE_CURRENT_PASSWORD'
    }
}