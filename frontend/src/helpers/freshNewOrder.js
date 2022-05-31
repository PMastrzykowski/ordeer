import * as currency from "currency.js";
export const calculateItemPrice = (item, amount = 1) => {
    let price = currency(item.price);
    item.specialFields.forEach((field) => {
        field.options.forEach((option) => {
            if (option.value !== option.default) {
                if (option.default) {
                    price = currency(price.value).subtract(option.priceImpact);
                } else {
                    price = currency(price.value).add(option.priceImpact);
                }
            }
        });
    });
    return currency(price.value).multiply(amount).value;
};
export const calculateTotal = (cart) => {
    let total = { value: 0 };
    cart.forEach((item) => {
        total = currency(total.value).add(calculateItemPrice(item, item.amount));
    });
    return total.value;
};
export const calculateTotalAmount = (cart) => {
    let total = 0;
    cart.forEach((item) => {
        total += item.amount;
    });
    return total;
};
export const renderCheckout = (newOrder) => {
    let now = new Date();
    var order = {
        items: [],
        place: newOrder.placeId,
        point: newOrder.pointId,
        pointName: newOrder.pointName,
        layout: newOrder.layoutId,
        layoutName: newOrder.layoutName,
        feature: newOrder.pointFeature,
        total: calculateTotal(newOrder.cart),
        openDate: now.toISOString(),
        open: true,
        surveysPassed: false,
        paymentRefund: {
            refunded: false,
            refundedBy: "",
            refundDate: "",
        },
        rating: 0,
        review: "",
        _id: newOrder.sessionId,
    };
    order.items = newOrder.cart
        .map((item) => ({
            price: calculateItemPrice(item),
            name: item.name,
            productId: item.id,
            cartId: item.cartId,
            categoryId: item.categoryId,
            menuId: item.menuId,
            amount: item.amount,
            pressed: false,
            customizable: item.specialFields.length > 0,
            specialFields: item.specialFields.map((field) => ({
                ...field,
                options: field.options.filter(
                    (option) => option.value !== option.default
                ),
            })),
        }))
        .map((item) => ({
            ...item,
            specialFields: item.specialFields.filter(
                (field) => field.options.length > 0
            ),
        }));
    return order;
};
