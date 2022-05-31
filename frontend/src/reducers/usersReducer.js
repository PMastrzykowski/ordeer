const initialState = {
    allUsers: [],
    searchValue: '',
    showPassword: false,
    modal: {
        view: '',
        isOpen: false,
        valid: true,
        status: 'ready',
        selection: {
            username: '',
            id: '',
            password: ''
        },
        errors: {
            username: '',
            password: ''
        }
    }
};

export default (state = initialState, action) => {
    const renderSelection = () => {
        switch (action.payload.view) {
            case 'new-user':
                return initialState.modal.selection;
            case 'edit-username':
            case 'remove-user':
                return {
                    ...initialState.modal.selection,
                    ...state.allUsers.filter(user => user.id === action.payload.userId)[0]
                };
            default:
                return initialState.modal.selection;
        }
    }
    switch (action.type) {
        case 'USERS_OPEN_MODAL':
            return {
                ...state,
                modal: {
                    ...initialState.modal,
                    view: action.payload.view,
                    isOpen: true,
                    selection: renderSelection()
                },
                showPassword: false
            };
        case 'USERS_CLOSE_MODAL':
            return {
                ...state,
                modal: {
                    ...state.modal,
                    isOpen: false
                }
            };
        case 'USERS_EDIT_FIELD':
            return {
                ...state,
                modal: {
                    ...state.modal,
                    selection: {
                        ...state.modal.selection,
                        ...action.payload
                    }
                }
            };
        case 'USERS_VALIDATE':
            return {
                ...state,
                modal: {
                    ...state.modal,
                    errors: {
                        ...state.modal.errors,
                        ...action.payload.errors
                    },
                    valid: action.payload.valid
                }
            };
        case 'USERS_SET_STATUS':
            return {
                ...state,
                modal: {
                    ...state.modal,
                    status: action.status
                }
            };
        case 'USERS_ADD_USER':
            return {
                ...state,
                allUsers: [
                    ...state.allUsers,
                    action.data
                ],
                modal: {
                    ...state.modal,
                    isOpen: false
                }
            };
        case 'USERS_EDIT_USERNAME':
            return {
                ...state,
                allUsers: state.allUsers.map(user => user.id === action.data.id ? action.data : user),
                modal: {
                    ...state.modal,
                    isOpen: false
                }
            };
        case 'USERS_EDIT_PASSWORD':
            return {
                ...state,
                modal: {
                    ...state.modal,
                    isOpen: false
                }
            };
        case 'USERS_REMOVE_USER':
            return {
                ...state,
                allUsers: state.allUsers.filter(user => user.id !== action.id),
                modal: {
                    ...state.modal,
                    isOpen: false
                }
            };
        case 'USERS_TOGGLE_PASSWORD':
            return {
                ...state,
                showPassword: !state.showPassword
            };
        case 'LOGIN_SET_MANAGER_DATA':
            return {
                ...state,
                allUsers: action.payload.users
            };
        case 'USERS_EDIT_SEARCH_VALUE':
            return {
                ...state,
                searchValue: action.data
            };
        case 'LOGOUT_USER':
            return initialState;
        default:
            return state;
    }
}

