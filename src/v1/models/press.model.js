const {Schema, model} = require('mongoose');
const Press = new Schema({
    heading: {type: String, required: true},
    type: {type: String, required: true},
    hashedPreview: {type: String, required: true},
    previewImage: {type: Array, required: true},
    hashedContent: {type: String, required: true},
    contentImage: {type: Array, required: true},
    writer: {type: String, required: true},
    slug: {type: String, slug: 'heading', unique: true},
}, {
    timestamps: true
})
module.exports = model('Press', Press)