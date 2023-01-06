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
    date: {
        type: Date,
        default: Date.now()
    }
}, { minimize: false });

const User = mongoose.model('users', UserSchema);

module.exports = User;