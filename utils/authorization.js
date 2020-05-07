const User = require('../model/User');
const ApiError  = require('./apiError');

const AccessLevels = module.exports.AccessLevels = {
    USER: 'user',
    SUPER_ADMIN: 'superAdmin'
};

/** GraphQL authorization protection through a higher order function on resolvers **/
module.exports.authorizedResolver = function (resolver, accessLevel=AccessLevels.USER) {
    return async function (parent, args, context, info) {
        const { jwtUser: user } = context;//Of class JWTUser
        if (!user) throw(ApiError.INTERNAL_SERVER_ERROR());//This shouldn't happen as it should have passed through the authentication verification
        if (! await verifyAccessLevel(user.id, accessLevel)) {
            throw(new Error("Unauthorized Access"));
        }
        return resolver(parent, args, context, info)
    }
};
async function verifyAccessLevel(userId, accessLevel=AccessLevels.USER) {
    try{
        const user = await User.findById(userId);
        switch (accessLevel) {
            case AccessLevels.USER:
                return user.role === AccessLevels.USER;
            case AccessLevels.SUPER_ADMIN:
                return user.role === AccessLevels.SUPER_ADMIN;
        }
    }catch(error){
        console.debug(error);
        return false;
    }
    return false;
}