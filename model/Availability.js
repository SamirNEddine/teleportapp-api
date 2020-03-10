const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilitySchema = Schema({
    startDateTime:{
        type: Date,
        required: true
    },
    endDatetime:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ['available', 'focus', 'busy', 'non-assigned'],
        required: true,
        default: 'non-assigned'
    },
    communicationMode:{
        type: String,
        enum: ['sync', 'async'],
        required: true,
        default: 'sync'
    },
    interactivityLevel: {
        type: String,
        enum: ['unknown', 'none', 'low', 'high'],
        required: true,
        default: 'unknown'
    },
    externalIdentifier: {
        type: String,
        required: true
    }
});

module.exports = new mongoose.model('availability', AvailabilitySchema);