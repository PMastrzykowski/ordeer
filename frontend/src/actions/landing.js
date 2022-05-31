
export const landingPreviousSlide = () => {
    return {
        type: 'LANDING_PREVIOUS_SLIDE'
    }
}
export const landingNextSlide = () => {
    return {
        type: 'LANDING_NEXT_SLIDE'
    }
}
export const landingExampleCustomizations1 = () => {
    return {
        type: 'LANDING_EXAMPLE_CUSTOMIZATIONS_1'
    }
}
export const landingExampleCustomizations2 = () => {
    return {
        type: 'LANDING_EXAMPLE_CUSTOMIZATIONS_2'
    }
}
export const landingExampleCustomizations3 = () => {
    return {
        type: 'LANDING_EXAMPLE_CUSTOMIZATIONS_3'
    }
}
export const landingExampleCustomizationsReset = () => {
    return {
        type: 'LANDING_EXAMPLE_CUSTOMIZATIONS_RESET'
    }
}
export const landingExampleReviews = () => {
    return {
        type: 'LANDING_EXAMPLE_REVIEWS'
    }
}
export const landingExampleReviewsReset = () => {
    return {
        type: 'LANDING_EXAMPLE_REVIEWS_RESET'
    }
}

export const landingAddOrder = (data) => {
    return {
        type: 'LANDING_ADD_ORDER',
        data
    }
}

export const landingCloseOrder = (data) => {
    return {
        type: 'LANDING_CLOSE_ORDER',
        data
    }
}

export const landingOrderRating = (data) => {
    return {
        type: 'LANDING_ORDER_RATING',
        data
    }
}
export const landingToggleMenu = () => {
    return {
        type: 'LANDING_TOGGLE_MENU',
    }
}
export const landingReset = () => {
    return {
        type: 'LANDING_RESET',
    }
}
export const landingSetIp = (ip) => {
    return {
        type: "LANDING_SET_IP",
        ip,
    };
};