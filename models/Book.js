const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true},
    title: { type: String, required: true},
    author: { type: String, required: true },
    comment: { type: String, required: false},
    imageUrl: { type: String, required: true},
    finish: { type: Boolean, required: false, default: false},
    wish: { type: Boolean, required: false, default: false },
    isBeingRead: { type: Boolean, required: false, default: false }
});

module.exports = mongoose.model('Book', bookSchema);