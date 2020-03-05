const graphql = require('graphql');
const {NonNull} = require('../../../utils/graphql');
const {SkillType} = require('../../Skill');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = graphql;

/** Nested TimeSlot type **/
const TimeSlot = new GraphQLObjectType({
    name: 'TimeSlot',
    fields: () => ({
        startTime: {
            type: NonNull(GraphQLString)
        },
        endTime: {
            type: NonNull(GraphQLString)
        },
        availabilityLevel: {
            type: NonNull(GraphQLInt)
        }
    })
});

/** Nested UserPreferences type **/
const UserPreferences = new GraphQLObjectType({
    name: 'Preferences',
    fields: () => ({
        startWorkTime: {
            type: NonNull(GraphQLString)
        },
        endWorkTime: {
            type: NonNull(GraphQLString)
        },
        dailySetupTime: {
            type: NonNull(GraphQLString)
        }
    })
});

/** Nested resolvers **/
const {nestedUserSkillsResolver} = require('./nestedResolvers');

/** Type definition **/
//Exports soon enough to overcome circular dependencies issues
module.exports.UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: NonNull(GraphQLID)
        },
        firstName: {
            type: NonNull(GraphQLString)
        },
        lastName: {
            type: GraphQLString
        },
        emailAddress: {
            type: NonNull(GraphQLString)
        },
        profilePictureURL: {
            type: GraphQLString
        },
        phoneNumber: {
            type: GraphQLString
        },
        skills: {
            type: GraphQLList(SkillType),
            resolve: nestedUserSkillsResolver
        },
        availability: {
            type: GraphQLList(TimeSlot)
        },
        preferences: {
            type: UserPreferences
        },
        accessToken: {
            type: GraphQLString
        },
        refreshToken: {
            type: GraphQLString
        }
    })
});

/** Input fields for queries and mutations **/
module.exports.inputFields = {
    //Mutations
    signInWithEmail: {
        emailAddress: {type: NonNull(GraphQLString)}
    },
    authWithTemporaryCode: {
        emailAddress: {type: NonNull(GraphQLString)},
        code: {type: NonNull(GraphQLString)}
    },
    updateUserProfile: {
        firstName: {type: NonNull(GraphQLString)},
        lastName: {type: NonNull(GraphQLString)}
    }
};