import { socket } from '../socket';

export const setQrData = (payload) => {
    // socket.emit('setQrSession', { placeId: payload.placeId, sessionId: payload.sessionId })
    return {
        type: 'NEW_ORDER_SET_QR_DATA',
        payload
    }
}
export const updateQrData = (payload) => {
    return {
        type: 'NEW_ORDER_SET_QR_DATA',
        payload
    }
}
export const toggleCallTheWaiter = (data, exists, emit = true) => {
    if (data.column === 'firstColumn') {
        data.closeDate = Date.now();
        data.column = 'lastColumn';
    } else {
        data.openDate = Date.now();
        data.column = 'firstColumn';
    }
    if (emit) {
        socket.emit('newCall', { data, exists });
    }
    return {
        type: 'NEW_ORDER_TOGGLE_CALL_THE_WAITER',
        data
    }
}
export const selectCategory = (category) => {
    socket.emit('sessionEvent', { type: 'selectCategory', categoryId: category, timestamp: performance.now() });
    return {
        type: 'NEW_ORDER_SELECT_CATEGORY',
        category
    }
}
export const selectItem = (item) => {
    socket.emit('sessionEvent', { type: 'selectItem', itemId: item, timestamp: performance.now() });
    return {
        type: 'NEW_ORDER_SELECT_ITEM',
        item
    }
}
export const setView = (view) => {
    return {
        type: 'NEW_ORDER_SET_VIEW',
        view
    }
}
export const setCardNumber = (cardNumber) => {
    return {
        type: 'NEW_ORDER_SET_CARD_NUMBER',
        cardNumber
    }
}
export const setExpiry = (expiry) => {
    return {
        type: 'NEW_ORDER_SET_EXPIRY',
        expiry
    }
}
export const setCcv = (ccv) => {
    return {
        type: 'NEW_ORDER_SET_CCV',
        ccv
    }
}
export const newOrderToggleOptionMultiple = (fieldId, optionId) => {
    return {
        type: 'NEW_ORDER_TOGGLE_OPTION_MULTIPLE',
        payload: {
            fieldId,
            optionId
        }
    }
}
export const newOrderToggleOptionSingle = (fieldId, optionId) => {
    return {
        type: 'NEW_ORDER_TOGGLE_OPTION_SINGLE',
        payload: {
            fieldId,
            optionId
        }
    }
}
export const newOrderIncreaseAmount = () => {
    return {
        type: 'NEW_ORDER_INCREASE_AMOUNT'
    }
}
export const newOrderDecreaseAmount = () => {
    return {
        type: 'NEW_ORDER_DECREASE_AMOUNT'
    }
}
export const newOrderAddToCart = () => {
    return {
        type: 'NEW_ORDER_ADD_TO_CART'
    }
}
export const newOrderToggleCheckoutButtons = (id) => {
    return {
        type: 'NEW_ORDER_TOGGLE_CHECKOUT_BUTTONS',
        id
    }
}
export const newOrderRemoveCartItem = () => {
    return {
        type: 'NEW_ORDER_REMOVE_CART_ITEM'
    }
}
export const newOrderSaveCartItem = () => {
    return {
        type: 'NEW_ORDER_SAVE_CART_ITEM'
    }
}
export const newOrderCustomizeCartItem = (id) => {
    return {
        type: 'NEW_ORDER_CUSTOMIZE_CART_ITEM',
        id
    }
}
export const newOrderProgressChecked = (value) => {
    return {
        type: 'NEW_ORDER_PROGRESS_CHECKED',
        value
    }
}
export const newOrderSetErrors = (errors) => {
    return {
        type: 'NEW_ORDER_SET_ERRORS',
        errors
    }
}
export const newOrderSetFields = (fields) => {
    return {
        type: 'NEW_ORDER_SET_FIELDS',
        fields
    }
}
export const newOrderStartPaying = () => {
    return {
        type: 'NEW_ORDER_START_PAYING'
    }
}
export const newOrderStopPaying = () => {
    return {
        type: 'NEW_ORDER_STOP_PAYING'
    }
}
export const newOrderOpenPaymentModal = () => {
    return {
        type: 'NEW_ORDER_OPEN_PAYMENT_MODAL'
    }
}
export const newOrderClosePaymentModal = () => {
    return {
        type: 'NEW_ORDER_CLOSE_PAYMENT_MODAL'
    }
}