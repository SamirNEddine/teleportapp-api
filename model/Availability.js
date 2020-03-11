const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilitySchema = Schema({
    userId:{
        type: Schema.Types.ObjectID,
        required: true
    },
    startDateTime:{
        type: Date,
        required: true
    },
    endDateTime:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ['available', 'focus', 'busy', 'non-assigned'],
        required: true,
        default: 'busy'
    },
    communicationMode:{
        type: String,
        enum: ['sync', 'async'],
        required: true,
        default: 'async'
    },
    interactivityLevel: {
        type: String,
        enum: ['unknown', 'none', 'low', 'high'],
        required: true,
        default: 'none'
    },
    externalIdentifier: {
        type: String,
        required: true
    },
    externalDescription: {
        type: String,
        required: true
    }
});

module.exports = new mongoose.model('availability', AvailabilitySchema);