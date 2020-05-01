const Skill = require('../../../model/Skill');

module.exports.createSkillResolver = async function (_, skillProperties) {
    try {
        const {key} = skillProperties;
        const existingSkill = await Skill.findOne({key});
        if(existingSkill){
            throw(new Error('Key is already used for another skill!'));
        }else{
            const newSkill = new Skill(skillProperties);
            await newSkill.save();
            return newSkill;
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.updateSkillResolver = async function (_, skillProperties) {
    try {
        const {id} = skillProperties;
        const skill = await Skill.findById(id);
        if(!skill){
            throw(new Error('No skill found for the provided id!'));
        }else{
            const {key} = skillProperties;
            if(key && key !== skill.key){
                const existingSkillFromKey = await Skill.findOne({key});
                if(existingSkillFromKey) throw(new Error('The new key is already used for another skill!'));
            }
            await skill.updateProperties(skillProperties);
            return skill;
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.updateSkillForKeyResolver = async function (_, skillProperties) {
    try {
        const {key} = skillProperties;
        const skill = await Skill.findOne({key});
        if(!skill){
            throw(new Error('No skill found for the provided key!'));
        }else{
            await skill.updateProperties(skillProperties);
            return skill;
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.removeSkillResolver = async function (_, {id}) {
    try {
        const removedSkill = await Skill.findByIdAndDelete(id);
        if(!removedSkill){
            throw(new Error('No skill found for the provided id!'));
        }else{
            return "Skill deleted";
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.removeSkillForKeyResolver = async function (_, {key}) {
    try {
        const removedSkill = await Skill.findOneAndDelete({key});
        if(!removedSkill){
            throw(new Error('No skill found for the provided key!'));
        }else{
            return "Skill deleted";
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};