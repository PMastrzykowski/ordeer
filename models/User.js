const mongoose = require('mongoose');
const short = require('shortid');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    workUnits: {
        type: Array,
        default: []
    },
    users: {
        type: Array,
        default: []
    },
    layouts: {
        type: Array,
        default: []
    },
    menu: {
        type: String,
        default: ''
    },
    stripeId: {
        type: String,
        default: ''
    },
    subscriptionId: {
        type: String,
        default: ''
    },
    stripeCustomerId: {
        type: String,
        default: ''
    },
    stripeTaxId: {
        type: String,
        default: ''
    }
}, { minimize: false });

const User = mongoose.model('users', UserSchema);

module.exports = User;