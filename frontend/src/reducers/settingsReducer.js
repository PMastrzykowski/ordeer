const initialState = {
    modal: {
        view: '',
        isOpen: false,
        valid: true,
        status: 'ready',
        showPassword: false,
        showCurrentPassword: false,
        fields: {
            name: '',
            email: '',
            passwordCurrent: '',
            password: '',
            code: ''
        },
        errors: {
            name: '',
            passwordCurrent: '',
            email: '',
            password: '',
            code: ''
        }
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SETTINGS_OPEN_MODAL':
            return {
                ...initialState,
                modal: {
                    ...initialState.modal,
                    view: action.view,
                    isOpen: true
                }
            };
        case 'SETTINGS_CLOSE_MODAL':
            return {
                ...state,
                modal: {
                    ...state.modal,
                    isOpen: false
                }
            };
        case 'SETTINGS_EDIT_FIELD':
            return {
                ...state,
                modal: {
                    ...state.modal,
                    fields: {
                        ...state.modal.fields,
                        ...action.payload
                    }
                }
            };
        case 'SETTINGS_VALIDATE':
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
        case 'SETTINGS_SET_STATUS':
            return {
                ...state,
                modal: {
                    ...state.modal,
                    status: action.status
                }
            };
        case 'LOGOUT_USER':
            return initialState;
        case 'SETTINGS_TOGGLE_CURRENT_PASSWORD':
            return {
                ...state,
                showCurrentPassword: !state.showCurrentPassword
            };
        case 'SETTINGS_TOGGLE_PASSWORD':
            return {
                ...state,
                showPassword: !state.showPassword
            };
        default:
            return state;
    }
}

