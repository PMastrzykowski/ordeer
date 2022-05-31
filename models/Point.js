const mongoose = require('mongoose');
const short = require('shortid');
const Schema = mongoose.Schema;

const PointSchema = new Schema({
    top: {
        type: Number,
        defalut: 0
    },
    left: {
        type: Number,
        defalut: 0
    },
    width: {
        type: Number,
        defalut: 0
    },
    height: {
        type: Number,
        defalut: 0
    },
    rotation: {
        type: Number,
        defalut: 0
    },
    name: {
        type: String,
        default: 'New point'
    },
    layout: {
        type: String,
        default: 'unassigned'
    },
    feature: {
        type: String,
        default: ''
    },
    _id: {
        type: String,
        default: short.generate()
    },
    aspectRatio: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    },
    place: {
        type: String,
        default: ''
    },
}, { minimize: false });

const Point = mongoose.model('points', PointSchema);

module.exports = Point;