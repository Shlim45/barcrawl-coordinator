const mongoose = require('mongoose');

const BarSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    going: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            when: {
                type: Date,
                default: Date.now(),
            }
        }
    ],
});

module.exports = mongoose.model('Bar', BarSchema);