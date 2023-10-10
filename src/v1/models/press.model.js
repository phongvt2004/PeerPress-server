const {Schema, model} = require('mongoose');
const Press = new Schema({
    heading: {type: String, required: true},
    type: {type: String, required: true},
    preview: {type: String, required: true},
    thumbnail: {type: String, required: true},
    content: {type: String, required: true},
    writer: {type: String, required: true},
    views: {type: Number, required: true},
    userId: {type: String, required: true},
    state: {type: Number, required: true},
    date: {
        week: {type: Number, required: true},
        month: {type: Number, required: true},
        year: {type: Number, required: true},
    },
    slug: {type: String, slug: 'heading', unique: true},
}, {
    timestamps: true
})
module.exports = model('Press', Press)