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
        },
        key: {
            type: NonNull(GraphQLString)
        }
    })
});

/** Input fields for queries and mutations **/
module.exports.inputFields = {
    //queries
    skill: {
        id: {type: NonNull(GraphQLID)}
    },
    skillForKey: {
        key: {type: NonNull(GraphQLString)}
    },
    //Mutations
    createSkill: {
        key: {type: NonNull(GraphQLString)},
        name: {type: NonNull(GraphQLString)}
    },
    updateSkill: {
        id: {type: NonNull(GraphQLID)},
        key: {type: GraphQLString},
        name: {type: GraphQLString}
    },
    updateSkillForKey: {
        key: {type: NonNull(GraphQLString)},
        name: {type: GraphQLString}
    },
    removeSkill: {
        id: {type: NonNull(GraphQLID)}
    },
    removeSkillForKey: {
        key: {type: NonNull(GraphQLString)}
    }
};