const graphql = require('graphql');
const {SkillType, inputFields} = require('../type');
const {authenticatedResolver} = require('../../../utils/authentication');
const {
    createSkillResolver,
    updateSkillResolver,
    updateSkillForKeyResolver,
    removeSkillResolver,
    removeSkillForKeyResolver
} = require('./resolvers');

const {
    GraphQLString
} = graphql;

/** Mutations definitions **/
const createSkill = {
    type: SkillType,
    args: inputFields.createSkill,
    resolve: authenticatedResolver(createSkillResolver)
};
const updateSkill = {
    type: SkillType,
    args: inputFields.updateSkill,
    resolve: authenticatedResolver(updateSkillResolver)
};
const updateSkillForKey = {
    type: SkillType,
    args: inputFields.updateSkillForKey,
    resolve: authenticatedResolver(updateSkillForKeyResolver)
};
const removeSkill = {
    type: GraphQLString,
    args: inputFields.removeSkill,
    resolve: authenticatedResolver(removeSkillResolver)
};
const removeSkillForKey = {
    type: GraphQLString,
    args: inputFields.removeSkillForKey,
    resolve: authenticatedResolver(removeSkillForKeyResolver)
};

/** Exports **/
module.exports = {
    createSkill,
    updateSkill,
    updateSkillForKey,
    removeSkill,
    removeSkillForKey
};