const initialState = {
    errors: {
        email: "",
        card: "",
    },
    paying: false,
    currency: {
        label: "EUR",
        value: "eur",
    },
    products: [],
    prices: [],
    isYearly: true,
    modal: {
        view: "",
        isOpen: false,
        status: "ready",
        productId: "",
    },
    currencies: [
        {
            label: "EUR",
            value: "eur",
        },
        {
            label: "PLN",
            value: "pln",
        },
        {
            label: "USD",
            value: "usd",
        },
    ],
    billingPeriods: [
        {
            label: "Yearly",
            value: "yearly",
        },
        {
            label: "Monthly",
            value: "monthly",
        },
    ],
    paymentMethodForm: {
        visible: true,
        status: "ready",
        submitting: true,
        mode: "saved",
    },
    personalForm: {
        visible: true,
        valid: true,
        status: "ready",
        mode: "saved",
        submitting: false,
        isTaxInfoNeeded: false, //usunąć
        fields1: {
            name: "",
            email: "",
            phoneNumber: "",
            city: "",
            country: "",
            addressLineOne: "",
            addressLineTwo: "",
            postalCode: "",
            state: "",
            taxIdCountry: "",
            taxId: "",
        },
        saved: {
            name: "Patryk",
            email: "mastrzyk@gmail.com",
            phoneNumber: "+56876543456",
            city: "Oman",
            country: "PL",
            addressLineOne: "Pogodna 5",
            addressLineTwo: "67",
            postalCode: "30-009",
            state: "Małopolska",
            taxIdCountry: "eu_vat",
            taxId: "DE123456789",
        },
        fields: {
            name: "Patryk",
            email: "mastrzyk@gmail.com",
            phoneNumber: "+56876543456",
            city: "Oman",
            country: "PL",
            addressLineOne: "Pogodna 5",
            addressLineTwo: "67",
            postalCode: "30-009",
            state: "Małopolska",
            taxIdCountry: "eu_vat",
            taxId: "DE123456789",
        },
        errors: {
            name: "",
            email: "",
            phoneNumber: "", //optional
            city: "",
            country: "",
            addressLineOne: "",
            addressLineTwo: "", //optional
            postalCode: "",
            state: "",
            taxIdCountry: "", //optional if taxID empty
            taxId: "", //optional
        },
    },
    taxForm: {
        visible: true,
        submitting: false,
        valid: true,
        status: "ready",
        fields1: {
            taxIdCountry: "",
            taxId: "",
        },
        saved: {
            taxIdCountry: "eu_vat",
            taxIdCountryCode: "PL",
            taxId: "DE123456789",
        },
        fields: {
            taxIdCountry: "eu_vat",
            taxIdCountryCode: "PL",
            taxId: "DE123456789",
        },
        errors: {
            taxIdCountry: "", //optional if taxID empty
            taxId: "", //optional
        },
    },
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SET_MANAGER_DATA":
            return {
                ...state,
                personalForm: {
                    ...state.personalForm,
                    saved: action.payload.personal_customer_details,
                    fields: action.payload.personal_customer_details,
                },
            };
        case "PLANS_OPEN_MODAL":
            return {
                ...state,
                modal: {
                    ...initialState.modal,
                    ...action.payload.options,
                    view: action.payload.view,
                    isOpen: true,
                },
            };
        case "PLANS_CLOSE_MODAL":
            return {
                ...state,
                modal: {
                    ...state.modal,
                    isOpen: false,
                },
            };
        case "PLANS_SET_ERRORS":
            return {
                ...state,
                errors: {
                    ...state.errors,
                    ...action.errors,
                },
            };
        case "PLANS_START_PAYING":
            return {
                ...state,
                paying: true,
            };
        case "PLANS_STOP_PAYING":
            return {
                ...state,
                paying: false,
            };
        case "STRIPE_SET_PRODUCTS":
            return {
                ...state,
                products: action.payload,
            };
        case "STRIPE_SET_PRICES":
            return {
                ...state,
                prices: action.payload,
            };
        case "PLANS_TOGGLE_YEARLY":
            return {
                ...state,
                isYearly: !state.isYearly,
            };
        case "PLANS_SET_YEARLY":
            return {
                ...state,
                isYearly: action.yearly === "yearly",
            };
        case "PLANS_SET_CURRENCY":
            return {
                ...state,
                currency: action.currency,
            };
        case "PLANS_ATTACH_PAYMENT_METHOD":
            return {
                ...state,
                paying: false,
                paymentMethodForm: {
                    ...state.paymentMethodForm,
                    visible: false,
                    paying: false,
                },
            };
        case "PLANS_DETACH_PAYMENT_METHOD":
            return {
                ...state,
                paying: false,
                modal: {
                    ...state.modal,
                    isOpen: false,
                },
                paymentMethodForm: {
                    ...state.paymentMethodForm,
                    visible: true,
                    paying: false,
                },
            };
        case "PLANS_PERSONAL_FORM_EDIT_FIELD":
            return {
                ...state,
                personalForm: {
                    ...state.personalForm,
                    fields: {
                        ...state.personalForm.fields,
                        ...action.payload,
                    },
                },
            };
        case "PLANS_PERSONAL_FORM_VALIDATE":
            return {
                ...state,
                personalForm: {
                    ...state.personalForm,
                    errors: {
                        ...state.personalForm.errors,
                        ...action.payload.errors,
                    },
                    valid: action.payload.valid,
                },
            };
        case "PLANS_PERSONAL_FORM_SET_STATUS":
            return {
                ...state,
                personalForm: {
                    ...state.personalForm,
                    status: action.status,
                },
            };
        case "PLANS_PERSONAL_FORM_SET_MODE":
            return {
                ...state,
                personalForm: {
                    ...state.personalForm,
                    mode: action.mode,
                    fields: state.personalForm.saved,
                    errors: initialState.personalForm.errors,
                },
            };
        case "PLANS_PERSONAL_FORM_TOGGLE_VISIBILITY":
            return {
                ...state,
                personalForm: {
                    ...state.personalForm,
                    visible: !state.personalForm.visible,
                },
            };
        case "PLANS_TAX_FORM_EDIT_FIELD":
            return {
                ...state,
                taxForm: {
                    ...state.taxForm,
                    fields: {
                        ...state.taxForm.fields,
                        ...action.payload,
                    },
                },
            };
        case "PLANS_TAX_FORM_VALIDATE":
            return {
                ...state,
                taxForm: {
                    ...state.taxForm,
                    errors: {
                        ...state.taxForm.errors,
                        ...action.payload.errors,
                    },
                    valid: action.payload.valid,
                },
            };
        case "PLANS_TAX_FORM_SET_STATUS":
            return {
                ...state,
                taxForm: {
                    ...state.taxForm,
                    status: action.status,
                },
            };
        case "PLANS_TAX_FORM_SET_MODE":
            return {
                ...state,
                taxForm: {
                    ...state.taxForm,
                    mode: action.mode,
                    fields: state.taxForm.saved,
                    errors: initialState.taxForm.errors,
                },
            };
        case "PLANS_TAX_FORM_TOGGLE_VISIBILITY":
            return {
                ...state,
                taxForm: {
                    ...state.taxForm,
                    visible: !state.taxForm.visible,
                },
            };
        case "PLANS_PAYMENT_METHOD_FORM_TOGGLE_VISIBILITY":
            return {
                ...state,
                paymentMethodForm: {
                    ...state.paymentMethodForm,
                    visible: !state.paymentMethodForm.visible,
                },
            };
        case "PLANS_TAX_FORM_SAVE":
            return {
                ...state,
                taxForm: {
                    ...state.taxForm,
                    saved: state.taxForm.fields,
                    visible: false,
                    submitting: false,
                },
            };
        case "PLANS_TAX_FORM_START_SUBMITTING":
            return {
                ...state,
                taxForm: {
                    ...state.taxForm,
                    submitting: true,
                },
            };
        case "PLANS_TAX_FORM_STOP_SUBMITTING":
            return {
                ...state,
                taxForm: {
                    ...state.taxForm,
                    submitting: false,
                },
            };
        case "PLANS_PERSONAL_FORM_START_SUBMITTING":
            return {
                ...state,
                personalForm: {
                    ...state.personalForm,
                    submitting: true,
                },
            };
        case "PLANS_PERSONAL_FORM_STOP_SUBMITTING":
            return {
                ...state,
                personalForm: {
                    ...state.personalForm,
                    submitting: false,
                },
            };
        case "PLANS_PERSONAL_FORM_SAVE":
            return {
                ...state,
                personalForm: {
                    ...state.personalForm,
                    saved: state.personalForm.fields,
                    visible: false,
                    submitting: false,
                    mode: 'saved'
                },
            };
        default:
            return state;
    }
};
