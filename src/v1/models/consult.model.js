const {Schema, model} = require('mongoose');
const Consult = new Schema({
    name: {type: String, required: true},
    school: {type: String, required: true},
    grade: {type: Number, required: true},
    phoneNumber: {type: String, required: true},
    budget: {type: Number, required: true}
}, {
    timestamps: true
})
module.exports = model('Consult', Consult)