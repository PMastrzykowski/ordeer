const mongoose = require('mongoose');
const short = require('shortid');
const Schema = mongoose.Schema;

const CallSchema = new Schema({
    point: {
        type: String,
        required: true,
        default: ''
    },
    openDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    closeDate: {
        type: Date,
        required: false,
        default: Date.now()
    },
    place: {
        type: String,
        required: true,
        defalut: ''
    },
    _id: {
        type: String,
        required: true,
        defalut: short.generate()
    },
    feature: {
        type: String,
        required: true,
        defalut: 'feature-0'
    },
    column: {
        type: String,
        required: false,
        defalut: 'firstColumn'
    }
});

const Call = mongoose.model('calls', CallSchema);

module.exports = Call;