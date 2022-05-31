export const usersOpenModal = (view, userId) => {
    return {
        type: 'USERS_OPEN_MODAL',
        payload: {
            view,
            userId
        }
    }
}
export const usersCloseModal = () => {
    return {
        type: 'USERS_CLOSE_MODAL'
    }
}
export const usersEditField = (payload) => {
    return {
        type: 'USERS_EDIT_FIELD',
        payload
    }
}
export const usersValidate = (errors, valid) => {
    return {
        type: 'USERS_VALIDATE',
        payload: {
            errors,
            valid
        }
    }
}
export const usersChangeEmail = (email) => {
    return {
        type: 'USERS_CHANGE_EMAIL',
        email
    }
}
export const usersAddNewUser = (data) => {
    return {
        type: 'USERS_ADD_USER',
        data: {
            username: data.username,
            id: data.id
        }
    }
}
export const usersEditUsername = (data) => {
    return {
        type: 'USERS_EDIT_USERNAME',
        data
    }
}
export const usersEditPassword = (data) => {
    return {
        type: 'USERS_EDIT_PASSWORD',
        data
    }
}
export const usersRemoveUser = (id) => {
    return {
        type: 'USERS_REMOVE_USER',
        id
    }
}
export const usersTogglePassword = () => {
    return {
        type: 'USERS_TOGGLE_PASSWORD'
    }
}
export const usersSetStatus = status => {
    return {
        type: 'USERS_SET_STATUS',
        status
    }
}
export const usersEditSearchField = data => {
    return {
        type: 'USERS_EDIT_SEARCH_VALUE',
        data
    }
}