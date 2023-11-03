import mongoose from 'mongoose';


const MessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverId: {
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

module.exports = mongoose.model('Message', MessageSchema);