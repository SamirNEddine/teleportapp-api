const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {verifyPassword} = require('../utils/authentication');
const {getLocalTodayInUTCTimestamp} = require('../utils/timezone');

/** User Preferences Schema **/
//UserPreferences to be used in UserSchema
// NB: Time here is a string representation  of the time in 24 hours format with a leading digit. Example: 8:30 a.m. => 0830
const DEFAULT_START_WORK_TIME = '0900';
const DEFAULT_END_WORK_TIME = '1800';
const DEFAULT_DAILY_SETUP_TIME = '0930';
const DEFAULT_LUNCH_TIME = '1230';
const getStartWorkTime = function (startWorkTime) {
    if(!parseInt(startWorkTime)){
        return DEFAULT_START_WORK_TIME;
    }
    return startWorkTime;
};
const getEndWorkTime = function (endWorkTime) {
    if(!parseInt(endWorkTime)){
        return DEFAULT_END_WORK_TIME;
    }
    return endWorkTime;
};
const getDailySetupTime = function (dailySetupTime) {
    if(!parseInt(dailySetupTime)){
        return DEFAULT_DAILY_SETUP_TIME;
    }
    return dailySetupTime;
};
const getLunchTime = function (lunchTime) {
    if(!parseInt(lunchTime)){
        return DEFAULT_LUNCH_TIME;
    }
    return lunchTime;
};
const UserPreferences = Schema ({
    startWorkTime: {
        type: String,
        get: getStartWorkTime
    },
    endWorkTime: {
        type: String,
        get: getEndWorkTime
    },
    dailySetupTime: {
        type: String,
        get: getDailySetupTime
    },
    lunchTime: {
        type: String,
        get: getLunchTime
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
    phoneNumber: {
        String
    },
    skills: [{
        type: Schema.Types.ObjectID
    }],
    preferences: {
        type: UserPreferences,
        default: {}
    },
    timezoneOffset: {
        type: Number
    },
    IANATimezone: {
        type: String,
        required: true
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

/** Extend User model with helpers methods **/
const User = new mongoose.model('user', UserSchema);

User.prototype.verifyPassword = async function(password) {
    return await verifyPassword(password, this.password);
};

/** Export **/
module.exports = User;