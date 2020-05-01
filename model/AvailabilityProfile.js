const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilityProfileScheme = Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    minAvailableSlotInMinutes: {
        type: Number,
        required: true
    },
    minFocusSlotInMinutes: {
        type: Number,
        required: true
    },
    busyRatio: {
        type: Number,
        required: true
    },
});

/** Extend AvailabilityProfile model with helpers methods **/
const AvailabilityProfile = new mongoose.model('availability profile', AvailabilityProfileScheme);

AvailabilityProfile.prototype.updateProperties = async function(propertiesUpdates) {
    for (let property in propertiesUpdates){
        if(this.get(property)){
            this.set(property, propertiesUpdates[property]);
        }
    }
    await this.save();
};

/** Export **/
module.exports = AvailabilityProfile;
