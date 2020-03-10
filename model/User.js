const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {verifyPassword} = require('../utils/authentication');

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
        select: false
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
    skills: [{
        type: Schema.Types.ObjectID
    }],
    preferences: {
        type: UserPreferences
    },
    timezoneOffset: {
        type: Number,
        required: true
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
User.prototype.getIntegrationData = function(name){
    const entry = this.integrations.find(integration => integration.name === name);
    if(entry){
        return Object.fromEntries(entry.data);
    }else{
        return undefined;
    }
};
User.prototype.setIntegrationData = function(name, data){
    if(!this.integrations){
        this.integrations = [];
    }
    let index = this.integrations.findIndex(integration => integration.name === name);
    if(index < 0) index = this.integrations.length;
    this.integrations[index] = {name, data};
};

/** Export **/
module.exports = User;