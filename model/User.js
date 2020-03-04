const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getJWTForUser, hashPassword, verifyPassword } = require('../utils/authentication');

//NB: Time here is a string representation  of the time in 24 hours format with a leading digit. Example: 8:30 a.m. => 0830

/** Integration Schema **/
//IntegrationSchema to be used in UserSchema
const IntegrationSchema = Schema ({
    name: {
        type: String,
        enum: ['google', 'slack'],
        required: true
    },
    data: {
        type: Map,
        of: String,
        required: true
    },
});

/** TimeSlotSchema Schema **/
//TimeSlotSchema to be used in UserSchema
const TimeSlotSchema = Schema ({
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    availabilityLevel: {
        type: Number,
        required: true
    }
});

/** User Preferences Schema **/
//UserPreferences to be used in UserSchema
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
    },
    profilePictureURL: {
        type: String
    },
    phoneNumber: {
        String
    },
    integrations: [{
        type: IntegrationSchema
    }],
    skills: {
        type: Schema.Types.ObjectID,
        required: true
    },
    availability: [{
        type: TimeSlotSchema
    }],
    preferences: {
        type: UserPreferences
    }
}, {timestamp: true});

/** Password hashing **/
UserSchema.pre('save', async  function(next) {
    if (this.isNew){
        //Check if existing
        const emailExist = await User.findOne({email: this.email});
        if (emailExist) throw (new Error("Email already exist!"));
        this.password = await hashPassword(this.password);
    }
    next();
});

/** Extend User model with helpers methods **/
const User = new mongoose.model('user', UserSchema);

/** JWT **/
User.prototype.jwt = async function() {
    return await getJWTForUser(this._id, this.email);
};
User.prototype.verifyPassword = async function(password) {
    return await verifyPassword(password, this.password);
};

/** Export **/
module.exports = User;