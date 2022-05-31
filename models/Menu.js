const mongoose = require('mongoose');
const short = require('shortid');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    images: {
        type: Array,
        default: []
    },
    place: {
        type: String,
        defalut: ''
    },
    categories: {
        type: Array,
        defalut: []
    },
    items: {
        type: Array,
        defalut: []
    },
    _id: {
        type: String,
        defalut: short.generate()
    }
}, { minimize: false });

const Menu = mongoose.model('menus', MenuSchema);

module.exports = Menu;