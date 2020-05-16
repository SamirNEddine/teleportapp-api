const mongoose = require('mongoose');
const {verifyPassword} = require('../utils/authentication');
const AvailabilityProfile = require('./AvailabilityProfile');
const {updateUserContextParams} = require('../helpers/contextService');

const Schema = mongoose.Schema;

/** User Preferences Schema **/
//UserPreferences to be used in UserSchema
// NB: Time here is a string representation  of the time in 24 hours format with a leading digit. Example: 8:30 a.m. => 0830
const DEFAULT_START_WORK_TIME = '0900';
const DEFAULT_END_WORK_TIME = '1800';
const DEFAULT_DAILY_SETUP_TIME = '0930';
const DEFAULT_LUNCH_TIME = '1230';
const DEFAULT_LUNCH_DURATION_IN_MINUTES = 60;
const getStartWorkTime = function (startWorkTime) {
    if(!parseInt(startWorkTime)){
        return DEFAULT_START_WORK_TIME;
    }
    return startWorkTime;
};
const setStartWorkTime = function (startWorkTime) {
    if(!parseInt(startWorkTime)){
        return this.startWorkTime;
    }
    return startWorkTime;
};
const getEndWorkTime = function (endWorkTime) {
    if(!parseInt(endWorkTime)){
        return DEFAULT_END_WORK_TIME;
    }
    return endWorkTime;
};
const setEndWorkTime = function (endWorkTime) {
    if(!parseInt(endWorkTime)){
        return this.endWorkTime;
    }
    return endWorkTime;
};
const getDailySetupTime = function (dailySetupTime) {
    if(!parseInt(dailySetupTime)){
        return DEFAULT_DAILY_SETUP_TIME;
    }
    return dailySetupTime;
};
const setDailySetupTime = function (dailySetupTime) {
    if(!parseInt(dailySetupTime)){
        return this.dailySetupTime;
    }
    return dailySetupTime;
};
const getLunchTime = function (lunchTime) {
    if(!parseInt(lunchTime)){
        return DEFAULT_LUNCH_TIME;
    }
    return lunchTime;
};
const setLunchTime = function (lunchTime) {
    if(!parseInt(lunchTime)){
        return this.lunchTime;
    }
    return lunchTime;
};
const getLunchDuration= function (lunchDuration) {
    if(!parseInt(lunchDuration)){
        return DEFAULT_LUNCH_DURATION_IN_MINUTES;
    }
    return lunchDuration;
};
const setLunchDuration = function (lunchDuration) {
    if(!parseInt(lunchDuration)){
        return this.lunchDurationInMinutes;
    }
    return lunchDuration;
};
const UserPreferences = Schema ({
    startWorkTime: {
        type: String,
        get: getStartWorkTime,
        set: setStartWorkTime
    },
    endWorkTime: {
        type: String,
        get: getEndWorkTime,
        set: setEndWorkTime
    },
    dailySetupTime: {
        type: String,
        get: getDailySetupTime,
        set: setDailySetupTime
    },
    lunchTime: {
        type: String,
        get: getLunchTime,
        set: setLunchTime
    },
    lunchDurationInMinutes: {
        type: Number,
        get: getLunchDuration,
        set: setLunchDuration
    }
});
UserPreferences.set('toObject', { getters: true });
UserPreferences.set('toJSON', { getters: true });
const UserSchema = Schema({
    firstName: {
        type: String,
        required: true,
        min: 2
    },
    lastName: {
        type: String,
        required: true,
        min: 2
    },
    emailAddress: {
        type: String,
        required: true,
        min: 6
    },
    password: {
        type: String,
        select: false
    },
    profilePictureURL: {
        type: String
    },
    jobTitle: {
        type: String
    },
    availabilityProfile: {
        type: Schema.Types.ObjectID,
        required: true
    },
    skills: [{
        type: Schema.Types.ObjectID
    }],
    preferences: {
        type: UserPreferences,
        default: {}
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'superAdmin'],
        default: 'user'
    },
    IANATimezone: {
        type: String,
        required: true
    },
    onBoarded: {
        type: Boolean,
        required: true,
        default: false
    }
}, {timestamp: true});
UserSchema.set('toObject', { getters: true });
UserSchema.set('toJSON', { getters: true });

/** Password hashing **/
UserSchema.pre('save', async  function(next) {
    if (this.isNew){
        //Check if existing
        const emailExist = await User.findOne({emailAddress: this.email});
        if (emailExist) throw (new Error("Email already exist!"));
    }
    next();
});

/** UserSchema virtual properties **/
UserSchema.virtual('contextParams').get( async function() {
    const availabilityProfile = await AvailabilityProfile.findById(this.availabilityProfile);
    return {
        startWorkTime: this.preferences.startWorkTime,
        endWorkTime: this.preferences.endWorkTime,
        lunchTime: this.preferences.lunchTime,
        dailySetupTime: this.preferences.dailySetupTime,
        IANATimezone: this.IANATimezone,
        minAvailableSlotInMinutes: availabilityProfile.minAvailableSlotInMinutes,
        minFocusSlotInMinutes: availabilityProfile.minFocusSlotInMinutes
    }
});

/** Extend User model with helpers methods **/
const User = new mongoose.model('user', UserSchema);

User.prototype.verifyPassword = async function(password) {
    return await verifyPassword(password, this.password);
};
User.prototype.updateUserPreferences = async function(preferencesUpdates) {
    await updateUserContextParams(this.id, preferencesUpdates);
    for (let preferenceKey in preferencesUpdates){
        if(this.preferences.get(preferenceKey)){
            this.preferences.set(preferenceKey, preferencesUpdates[preferenceKey]);
        }
    }
    await this.save();
};

/** Export **/
module.exports = User;