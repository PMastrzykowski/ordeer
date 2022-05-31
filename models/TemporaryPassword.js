const mongoose = require('mongoose');
const short = require('shortid');
const Schema = mongoose.Schema;

const TemporaryPasswordSchema = new Schema({
    email: {
        type: String,
        required: true
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

const TemporaryPassword = mongoose.model('temporaryPasswords', TemporaryPasswordSchema);

module.exports = TemporaryPassword;