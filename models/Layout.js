const mongoose = require('mongoose');
const short = require('shortid');
const Schema = mongoose.Schema;

const LayoutSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    place: {
        type: String,
        defalut: ''
    },
    _id: {
        type: String,
        defalut: short.generate()
    }
}, { minimize: false });

const Layout = mongoose.model('layouts', LayoutSchema);

module.exports = Layout;