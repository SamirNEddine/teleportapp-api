const graphql = require('graphql');
const {NonNull} = require('../../../utils/graphql');
const {SkillType} = require('../../Skill');
const {AvailabilityProfileType} = require('../../AvailabilityProfile');
const {
    nestedUserSkillsResolver,
    nestedTodayAvailabilityResolver,
    nestedSuggestedAvailabilityForTodayResolver,
    nestedCurrentAvailabilityResolver,
    nestedAvailabilityProfileResolver,
    nestedHasScheduledAvailabilityForTodayResolver
} = require('./nestedResolvers');
const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean
} = graphql;

/** Nested TimeSlot type **/
const TimeSlotType = module.exports.TimeSlotType = new GraphQLObjectType({
    name: 'TimeSlot',
    fields: () => ({
        start: {
            type: NonNull(GraphQLString)
        },
        end: {
            type: NonNull(GraphQLString)
        },
        status: {
            type: NonNull(GraphQLString)
        }
    })
});

/** Nested Availability type **/
const AvailabilityType = new GraphQLObjectType({
    name: 'Availability',
    fields: () => ({
        busyTimeSlots: {
            type: NonNull(GraphQLList(TimeSlotType))
        },
        focusTimeSlots: {
            type: NonNull(GraphQLList(TimeSlotType))
        },
        availableTimeSlots: {
            type: NonNull(GraphQLList(TimeSlotType))
        },
        unassignedTimeSlots: {
            type: NonNull(GraphQLList(TimeSlotType))
        },
        schedule: {
            type: NonNull(GraphQLList(TimeSlotType))
        },
        totalTimeBusy: {
            type: NonNull(GraphQLInt)
        },
        totalTimeFocus: {
            type: NonNull(GraphQLInt),
        },
        totalTimeAvailable: {
            type: NonNull(GraphQLInt),
        },
        totalTimeUnassigned: {
            type: NonNull(GraphQLInt),
        },
        totalTimeScheduled: {
            type: NonNull(GraphQLInt),
        },
        startTime: {
            type: NonNull(GraphQLString)
        },
        endTime: {
            type: NonNull(GraphQLString)
        }
    })
});

/** Nested UserPreferences type **/
const UserPreferencesType = module.exports.UserPreferencesType = new GraphQLObjectType({
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
        },
        lunchTime: {
            type: NonNull(GraphQLString)
        }
    })
});

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
        jobTitle: {
            type: GraphQLString
        },
        skills: {
            type: GraphQLList(SkillType),
            resolve: nestedUserSkillsResolver
        },
        currentAvailability: {
            type: TimeSlotType,
            resolve: nestedCurrentAvailabilityResolver
        },
        todayAvailability: {
            type: AvailabilityType,
            resolve: nestedTodayAvailabilityResolver
        },
        suggestedAvailabilityForToday: {
            type: AvailabilityType,
            resolve: nestedSuggestedAvailabilityForTodayResolver
        },
        preferences: {
            type: NonNull(UserPreferencesType)
        },
        accessToken: {
            type: NonNull(GraphQLString)
        },
        refreshToken: {
            type: NonNull(GraphQLString)
        },
        availabilityProfile: {
            type: NonNull(AvailabilityProfileType),
            resolve: nestedAvailabilityProfileResolver
        },
        onBoarded: {
            type: NonNull(GraphQLBoolean)
        },
        hasScheduledAvailabilityForToday: {
            type: NonNull(GraphQLBoolean),
            resolve: nestedHasScheduledAvailabilityForTodayResolver
        }
    })
});

/** Input fields for queries and mutations **/
const TimeSlotInputType = new GraphQLInputObjectType({
    name: 'TimeSlotInput',
    fields: () => ({
        start: {
            type: NonNull(GraphQLString)
        },
        end: {
            type: NonNull(GraphQLString)
        },
        status: {
            type: NonNull(GraphQLString)
        }
    })
});
module.exports.inputFields = {
    //Mutations
    signInWithEmail: {
        emailAddress: {type: NonNull(GraphQLString)}
    },
    authWithTemporaryCode: {
        emailAddress: {type: NonNull(GraphQLString)},
        code: {type: NonNull(GraphQLString)}
    },
    signInWithSlack: {
        code: {type: NonNull(GraphQLString)},
        redirectURI: {type: GraphQLString}
    },
    refreshAccessToken: {
        refreshToken: {type: NonNull(GraphQLString)}
    },
    updateUserProfile: {
        firstName: {type: NonNull(GraphQLString)},
        lastName: {type: NonNull(GraphQLString)},
        jobTitle: {type: NonNull(GraphQLString)},
        skills: {type: NonNull(GraphQLList(GraphQLID))}
    },
    updateUserPreferences: {
        startWorkTime: {type: GraphQLString},
        endWorkTime: {type: GraphQLString},
        lunchTime: {type: GraphQLString},
        dailySetupTime: {type: GraphQLString}
    },
    updateAvailabilityProfile: {
        availabilityProfileId: {type: GraphQLString},
    },
    addGoogleCalendarIntegration: {
        code: {type: NonNull(GraphQLString)},
        codeVerifier: {type: NonNull(GraphQLString)},
        clientId: {type: NonNull(GraphQLString)},
        redirectURI: {type: NonNull(GraphQLString)}
    },
    scheduleAvailabilityForToday: {
        timeSlots: {type: NonNull(GraphQLList(TimeSlotInputType))}
    },
    overrideCurrentAvailability: {
        newAvailability: {type: NonNull(GraphQLString)}
    }
};