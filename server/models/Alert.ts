import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        max: 500,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    });

module.exports = mongoose.model('Alert', AlertSchema);