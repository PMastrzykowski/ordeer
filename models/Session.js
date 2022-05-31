const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    _id: {
        type: String,
        required: true,
        default: ''
    },
    placeId: {
        type: String,
        required: true,
        default: ''
    },
    placeName: {
        type: String,
        required: true,
        default: ''
    },
    pointId: {
        type: String,
        required: true,
        default: ''
    },
    pointName: {
        type: String,
        required: true,
        default: ''
    },
    openTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    closeTime: {
        type: Date,
        required: false,
        default: Date.now
    },
    viewportWidth: {
        type: Number,
        required: true,
        default: 0
    },
    viewportHeight: {
        type: Number,
        required: true,
        default: 0
    },
    menu: {
        type: Array,
        required: true,
        default: []
    },
    events: {
        type: Array,
        required: true,
        defalut: []
    },
    language: {
        type: String,
        required: false,
        default: ''
    },
    paid: {
        type: Boolean,
        required: true,
        defalut: false
    },
    browserName: {
        type: String,
        required: true,
        default: ''
    },
    browserVersion: {
        type: String,
        required: true,
        default: ''
    },
    mobileVendor: {
        type: String,
        required: true,
        default: ''
    },
    mobileModel: {
        type: String,
        required: true,
        default: ''
    },
    deviceType: {
        type: String,
        required: true,
        default: ''
    },
    createdAt: { 
        type: Date, 
        expires: '30d',
        default: Date.now
    }
});

const Session = mongoose.model('sessions', SessionSchema);

module.exports = Session;