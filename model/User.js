const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {verifyPassword} = require('../utils/authentication');

/** User Preferences Schema **/
//UserPreferences to be used in UserSchema
//NB: Time here is a string representation  of the time in 24 hours format with a leading digit. Example: 8:30 a.m. => 0830
const UserPreferences = Schema ({
    startWorkTime: {
        type: String
    },
    endWorkTime: {
        type: String
    },
    dailySetupTime: {
        type: String
    },
});
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
        type: UserPreferences
    },
    timezoneOffset: {
        type: Number
    }
}, {timestamp: true});

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