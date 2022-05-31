const mongoose = require('mongoose');
const short = require('shortid');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    total: {
        type: Number,
        defalut: 0
    },
    items: {
        type: Array,
        default: []
    },
    point: {
        type: String,
        default: ''
    },
    pointName: {
        type: String,
        default: ''
    },
    layout: {
        type: String,
        default: ''
    },
    layoutName: {
        type: String,
        default: ''
    },
    collectId: {
        type: String,
        default: ''
    },
    openDate: {
        type: Date,
        default: Date.now()
    },
    closeDate: {
        type: Date,
        default: Date.now()
    },
    place: {
        type: String,
        defalut: ''
    },
    _id: {
        type: String,
        defalut: short.generate()
    },
    feature: {
        type: String,
        defalut: 'feature-2'
    },
    surveys: {
        type: Array,
        default: []
    },
    surveysPassed: {
        type: Boolean,
        defalut: false
    },
    open: {
        type: Boolean,
        defalut: true
    },
    ready: {
        type: Boolean,
        defalut: false
    },
    cancelled: {
        type: Boolean,
        defalut: false
    },
    intent: {
        type: Boolean,
        defalut: false
    },
    paid: {
        type: Boolean,
        defalut: false
    },
    paymentData: {
        type: Object,
        defalut: {}
    },
    paymentRefund: {
        type: Object,
        defalut: {
            refunded: false,
            refundedBy: '',
            refundDate: '',
            refundData: {}
        }
    },
    paymentMethod: {
        type: String,
        defalut: ''
    },
    review: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        defalut: 0
    }
}, { minimize: false });

const Order = mongoose.model('orders', OrderSchema);

module.exports = Order;