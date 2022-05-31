const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemporaryCodeSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        expires: '10m',
        default: Date.now
    }
});

const TemporaryCode = mongoose.model('TemporaryCodes', TemporaryCodeSchema);

module.exports = TemporaryCode;