const mongoose = require('mongoose');
const short = require('shortid');
const Schema = mongoose.Schema;

const TemporaryUserSchema = new Schema({
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
    date: {
        type: Date,
        default: Date.now
    },
    _id: {
        type: String,
        default: short.generate()
    },
    createdAt: { 
        type: Date, 
        expires: '24h',
        default: Date.now
    }
});

const TemporaryUser = mongoose.model('temporaryUsers', TemporaryUserSchema);

module.exports = TemporaryUser;