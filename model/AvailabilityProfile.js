const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilityProfile = Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    minAvailableSlotInMinutes: {
        type: Number,
        required: true
    },
    minFocusSlotInMinutes: {
        type: Number,
        required: true
    },
});

module.exports = new mongoose.model('availability profile', AvailabilityProfile);