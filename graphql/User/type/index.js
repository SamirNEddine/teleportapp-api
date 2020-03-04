const graphql = require('graphql');
const { NonNull } = require('../../../utils/graphql');
const { Skill } = require('../../Skill');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = graphql;
const { nestedUserSkillsResolver } = require('./nestedResolvers');

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

/** Type definition **/
//Exports soon enough to overcome circular dependencies issues
module.exports.User = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: NonNull(GraphQLID)
        },
        firstName: {
            type: NonNull(GraphQLString)
        },
        lastName: {
            type: NonNull(GraphQLString)
        },
        emailAddress: {
            type: NonNull(GraphQLString)
        },
        password: {
            type: GraphQLString
        },
        profilePictureURL: {
            type: GraphQLString
        },
        phoneNumber: {
            type: GraphQLString
        },
        skills: {
            type: GraphQLList(Skill),
            resolve: nestedUserSkillsResolver
        },
        availability: {
            type: GraphQLList(TimeSlot)
        },
        preferences: {
            type: UserPreferences
        }
    })
});

/** Input fields for queries and mutations **/
module.exports.inputFields = {
};