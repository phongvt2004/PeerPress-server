const {Schema, model} = require('mongoose');
const Writer = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
}, {
    timestamps: true
})
module.exports = model('Writer', Writer)