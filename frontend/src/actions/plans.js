export const plansToggleOptionSingle = (fieldId, optionId) => {
    return {
        type: "PLANS_TOGGLE_OPTION_SINGLE",
        payload: {
            fieldId,
            optionId,
        },
    };
};
export const plansProgressChecked = (value) => {
    return {
        type: "PLANS_PROGRESS_CHECKED",
        value,
    };
};
export const plansSetErrors = (errors) => {
    return {
        type: "PLANS_SET_ERRORS",
        errors,
    };
};
export const plansSetFields = (fields) => {
    return {
        type: "PLANS_SET_FIELDS",
        fields,
    };
};
export const plansStartPaying = () => {
    return {
        type: "PLANS_START_PAYING",
    };
};
export const plansStopPaying = () => {
    return {
        type: "PLANS_STOP_PAYING",
    };
};
export const plansOpenModal = (view, options) => {
    return {
        type: "PLANS_OPEN_MODAL",
        payload: {
            view,
            options,
        },
    };
};
export const plansCloseModal = () => {
    return {
        type: "PLANS_CLOSE_MODAL",
    };
};
export const plansDetachPaymentMethod = () => {
    return {
        type: "PLANS_DETACH_PAYMENT_METHOD",
    };
};
export const plansAttachPaymentMethod = (
    default_payment_method,
    billing_details,
    card
) => {
    return {
        type: "PLANS_ATTACH_PAYMENT_METHOD",
        payload: {
            default_payment_method,
            billing_details,
            card,
        },
    };
};
export const plansToggleYearly = () => {
    return {
        type: "PLANS_TOGGLE_YEARLY",
    };
};
export const plansSetYearly = (yearly) => {
    return {
        type: "PLANS_SET_YEARLY",
        yearly,
    };
};
export const plansSetCurrency = (currency) => {
    return {
        type: "PLANS_SET_CURRENCY",
        currency,
    };
};

export const plansPersonalFormEditField = (payload) => {
    return {
        type: "PLANS_PERSONAL_FORM_EDIT_FIELD",
        payload,
    };
};
export const plansPersonalFormValidate = (errors, valid) => {
    return {
        type: "PLANS_PERSONAL_FORM_VALIDATE",
        payload: {
            errors,
            valid,
        },
    };
};
export const plansPersonalFormSetStatus = (status) => {
    return {
        type: "PLANS_PERSONAL_FORM_SET_STATUS",
        status,
    };
};
export const plansPersonalFormSetMode = (mode) => {
    return {
        type: "PLANS_PERSONAL_FORM_SET_MODE",
        mode,
    };
};
export const plansPersonalFormToggleVisibility = () => {
    return {
        type: "PLANS_PERSONAL_FORM_TOGGLE_VISIBILITY",
    };
};
export const plansTaxFormEditField = (payload) => {
    return {
        type: "PLANS_TAX_FORM_EDIT_FIELD",
        payload,
    };
};
export const plansTaxFormValidate = (errors, valid) => {
    return {
        type: "PLANS_TAX_FORM_VALIDATE",
        payload: {
            errors,
            valid,
        },
    };
};
export const plansTaxFormSetStatus = (status) => {
    return {
        type: "PLANS_TAX_FORM_SET_STATUS",
        status,
    };
};

export const plansTaxFormSetMode = (mode) => {
    return {
        type: "PLANS_TAX_FORM_SET_MODE",
        mode,
    };
};
export const plansPersonalFormSave = () => {
    return {
        type: "PLANS_PERSONAL_FORM_SAVE",
    };
};
export const plansTaxFormSave = () => {
    return {
        type: "PLANS_TAX_FORM_SAVE",
    };
};
export const plansTaxFormStartSubmitting = () => {
    return {
        type: "PLANS_TAX_FORM_START_SUBMITTING",
    };
};
export const plansTaxFormStopSubmitting = () => {
    return {
        type: "PLANS_TAX_FORM_STOP_SUBMITTING",
    };
};
export const plansPersonalFormStartSubmitting = () => {
    return {
        type: "PLANS_PERSONAL_FORM_START_SUBMITTING",
    };
};
export const plansPersonalFormStopSubmitting = () => {
    return {
        type: "PLANS_PERSONAL_FORM_STOP_SUBMITTING",
    };
};

export const plansTaxFormToggleVisibility = () => {
    return {
        type: "PLANS_TAX_FORM_TOGGLE_VISIBILITY",
    };
};
export const plansPaymentMethodFormToggleVisibility = () => {
    return {
        type: "PLANS_PAYMENT_METHOD_FORM_TOGGLE_VISIBILITY",
    };
};
