const {Schema, model} = require('mongoose');
const Press = new Schema({
    heading: {type: String, required: true},
    type: {type: String, required: true},
    preview: {type: String, required: true},
    content: {type: String, required: true},
    writer: {type: String, required: true},
    slug: {type: String, slug: 'heading', unique: true},
}, {
    timestamps: true
})
module.exports = model('Press', Press)