const graphql = require('graphql');
const { NonNull } = require('../../../utils/graphql');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString
} = graphql;

/** Type definition **/
//Exports soon enough to overcome circular dependencies issues
module.exports.SkillType = new GraphQLObjectType({
    name: 'Skill',
    fields: () => ({
        id: {
            type: NonNull(GraphQLID)
        },
        name: {
            type: NonNull(GraphQLString)
        }
    })
});