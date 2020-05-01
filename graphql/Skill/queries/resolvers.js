const Skill = require('../../../model/Skill');

module.exports.skillResolver = async function (_, {id}) {
    try {
        return await Skill.findById(id);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.skillForKeyResolver = async function (_, {key}) {
    try {
        return await Skill.findOne({key});
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.skillsResolver = async function () {
    try {
        return await Skill.find();
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};