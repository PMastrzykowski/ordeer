import short from "shortid";
const initialState = {
    pointName: "",
    pointId: "",
    pointFeature: "",
    isInTestMode: false,
    sessionId: "",
    collectId: "",
    currency: "",
    placeId: "",
    placeName: "",
    layoutId: "",
    layoutName: "",
    openDate: "",
    closeDate: "",
    placeMenu: {
        name: "",
        images: "",
        categories: [],
        items: [],
    },
    exists: false,
    selectedItem: {
        name: "",
        category: "",
        images: [],
        specialFields: [],
        amount: 1,
    },
    selectedCategory: {
        name: "",
        id: "",
    },
    cart: [
        {
            cartId: "36rFF21hx",
            amount: 1,
            menuId: "7AVuXmRs2",
            name: "Donuts",
            price: 1000,
            description: "Good donuts are good",
            tax: 0,
            id: "0i2Ev5G5R",
            images: [
                {
                    id: "98zlQ4aUP",
                    url: "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp",
                },
                {
                    id: "98zlQ4aUPe",
                    url: "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp",
                },
                {
                    id: "98zlQ4aUPr",
                    url: "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp",
                },
            ],
            specialFields: [
                {
                    name: "Filling",
                    type: "one",
                    options: [
                        {
                            name: "Plane",
                            id: "8werazEah",
                            priceImpact: 0,
                            value: false,
                            default: true,
                        },
                        {
                            name: "Strawberries",
                            id: "Z2Y6SS3Ur",
                            priceImpact: 100,
                            value: true,
                            default: false,
                        },
                        {
                            name: "Blueberries",
                            id: "6DJp5f9OO",
                            priceImpact: 200,
                            value: false,
                            default: false,
                        },
                    ],
                    id: "0Ldy@62D@",
                },
                {
                    name: "Toppings",
                    type: "many",
                    options: [
                        {
                            name: "Powder",
                            id: "XIQaBfKTX",
                            priceImpact: 0,
                            value: true,
                            default: true,
                        },
                        {
                            name: "Almonds",
                            id: "Auh8SzOfQ",
                            priceImpact: 50,
                            value: false,
                            default: false,
                        },
                        {
                            name: "Marshmallows",
                            id: "vKp7e$LOY",
                            priceImpact: 100,
                            value: true,
                            default: false,
                        },
                    ],
                    id: "rk9hn78b3",
                },
            ],
            workUnits: [],
            available: true,
            category: "5ufgFQ3xN",
        },
    ],
    view: "",
    cardPayment: {
        cardNumber: "",
        expiry: "",
        ccv: "",
    },
    fields: {
        email: "",
    },
    rating: 5,
    review: "",
    checkoutButtons: "",
    progressChecked: false,
    errors: {
        email: "",
        card: "",
    },
    paying: false,
    useSlidesSettings: {
        dots: false,
        infinite: true,
        speed: 700,
        swipeToSlide: true,
        autoplay: true,
        focusOnSelect: true,
        pauseOnFocus: true,
        slidesToScroll: 1,
    },
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "NEW_ORDER_SET_QR_DATA":
            return {
                ...state,
                ...action.payload,
            };
        case "NEW_ORDER_TOGGLE_CALL_THE_WAITER":
            return {
                ...state,
                column: action.data.column,
                openDate: action.data.openDate,
                closeDate: action.data.closeDate,
                exists: true,
            };
        case "NEW_ORDER_SELECT_CATEGORY":
            return {
                ...state,
                selectedCategory: state.placeMenu.categories.filter(
                    (category) => category.id === action.category
                )[0],
            };
        case "NEW_ORDER_SELECT_ITEM":
            return {
                ...state,
                selectedItem: {
                    amount: 1,
                    ...state.placeMenu.items.filter(
                    (item) => item.id === action.item
                )[0]}
            };
        case "NEW_ORDER_SET_VIEW":
            return {
                ...state,
                view: action.view,
            };
        case "NEW_ORDER_SET_CARD_NUMBER":
            return {
                ...state,
                cardPayment: {
                    ...state.cardPayment,
                    cardNumber: action.cardNumber,
                },
            };
        case "NEW_ORDER_SET_EXPIRY":
            return {
                ...state,
                cardPayment: {
                    ...state.cardPayment,
                    expiry: action.expiry,
                },
            };
        case "NEW_ORDER_SET_CCV":
            return {
                ...state,
                cardPayment: {
                    ...state.cardPayment,
                    ccv: action.ccv,
                },
            };
        case "NEW_ORDER_TOGGLE_OPTION_SINGLE":
            return {
                ...state,
                selectedItem: {
                    ...state.selectedItem,
                    specialFields: state.selectedItem.specialFields.map(
                        (field) =>
                            field.id === action.payload.fieldId
                                ? {
                                      ...field,
                                      options: field.options.map((option) =>
                                          option.id === action.payload.optionId
                                              ? {
                                                    ...option,
                                                    value: true,
                                                }
                                              : {
                                                    ...option,
                                                    value: false,
                                                }
                                      ),
                                  }
                                : field
                    ),
                },
            };
        case "NEW_ORDER_TOGGLE_OPTION_MULTIPLE":
            return {
                ...state,
                selectedItem: {
                    ...state.selectedItem,
                    specialFields: state.selectedItem.specialFields.map(
                        (field) =>
                            field.id === action.payload.fieldId
                                ? {
                                      ...field,
                                      options: field.options.map((option) =>
                                          option.id === action.payload.optionId
                                              ? {
                                                    ...option,
                                                    value: !option.value,
                                                }
                                              : option
                                      ),
                                  }
                                : field
                    ),
                },
            };
            case "NEW_ORDER_INCREASE_AMOUNT":
                return {
                    ...state,
                    selectedItem: {
                        ...state.selectedItem,
                        amount: state.selectedItem.amount + 1
                    }
                };
            case "NEW_ORDER_DECREASE_AMOUNT":
                return {
                    ...state,
                    selectedItem: {
                        ...state.selectedItem,
                        amount: state.selectedItem.amount > 2 ? state.selectedItem.amount - 1 : 1
                    }
                };
        case "NEW_ORDER_ADD_TO_CART":
            return {
                ...state,
                cart: [
                    ...state.cart,
                    {
                        cartId: short.generate(),
                        menuId: state.placeMenu._id,
                        ...state.selectedItem,
                    },
                ],
            };
        case "NEW_ORDER_TOGGLE_CHECKOUT_BUTTONS":
            return {
                ...state,
                checkoutButtons:
                    state.checkoutButtons === action.id ? "" : action.id,
            };
        case "NEW_ORDER_REMOVE_CART_ITEM":
            return {
                ...state,
                cart: state.cart.filter(
                    (item) => item.cartId !== state.selectedItem.cartId
                ),
            };
        case "NEW_ORDER_SAVE_CART_ITEM":
            return {
                ...state,
                cart: state.cart.map((item) =>
                    item.cartId === state.selectedItem.cartId
                        ? state.selectedItem
                        : item
                ),
            };
        case "NEW_ORDER_CUSTOMIZE_CART_ITEM":
            return {
                ...state,
                selectedItem: state.cart.filter(
                    (item) => item.cartId === action.id
                )[0],
            };
        case "NEW_ORDER_PROGRESS_CHECKED":
            return {
                ...state,
                progressChecked: action.value,
            };
        case "NEW_ORDER_SET_ERRORS":
            return {
                ...state,
                errors: {
                    ...state.errors,
                    ...action.errors,
                },
            };
        case "NEW_ORDER_SET_FIELDS":
            return {
                ...state,
                fields: {
                    ...state.errors,
                    ...action.fields,
                },
            };
        case "NEW_ORDER_START_PAYING":
            return {
                ...state,
                paying: true,
            };
        case "NEW_ORDER_STOP_PAYING":
            return {
                ...state,
                paying: false,
            };
        case "NEW_ORDER_SET_TEST_MODE":
            return {
                ...state,
                isInTestMode: true,
            };
        default:
            return state;
    }
};
