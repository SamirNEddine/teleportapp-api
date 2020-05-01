const graphql = require('graphql');
const {SkillType, inputFields} = require('../type');
const {authenticatedResolver} = require('../../../utils/authentication');
const {
    skillResolver,
    skillForKeyResolver,
    skillsResolver
} = require('./resolvers');

const {
    GraphQLList
} = graphql;

/** Queries definitions **/
const skill = {
    type: SkillType,
    args: inputFields.skill,
    resolve: authenticatedResolver(skillResolver)
};
const skillForKey = {
    type: SkillType,
    args: inputFields.skillForKey,
    resolve: authenticatedResolver(skillForKeyResolver)
};
const skills = {
    type: GraphQLList(SkillType),
    resolve: authenticatedResolver(skillsResolver)
};

/** Exports **/
module.exports = {
    skill,
    skillForKey,
    skills
};