const {Schema, model} = require('mongoose');
const Consult = new Schema({
    name: {type: String, required: true},
    school: {type: String, required: true},
    class: {type: String, required: true},
    phoneNumber: {type: Array, required: true},
    budget: {type: Number, required: true}
}, {
    timestamps: true
})
module.exports = model('Consult', Consult)