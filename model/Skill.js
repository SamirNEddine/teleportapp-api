const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkillSchema = Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    }
});

module.exports = new mongoose.model('skill', SkillSchema);