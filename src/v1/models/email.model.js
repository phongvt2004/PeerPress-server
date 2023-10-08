const {Schema, model} = require('mongoose');
const Email = new Schema({
    list: {type: Array, require: true},
    amount: {type: Number, require: true}
}, {
    timestamps: true
})
module.exports = model('Email', Email)