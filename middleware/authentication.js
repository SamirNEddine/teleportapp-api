const ApiError = require('../utils/apiError');
const { AUTH_MODE_PREFIX, getPayloadFromJWTAccessToken, JWTUser } = require('../utils/authentication');

async function verifyToken(authorization, req, next){
    if(!(req.body.query.includes('refreshAccessToken')
        || req.body.query.includes('signInWithSlack')
        || req.body.query.includes('signInWithEmail')
        || req.body.query.includes('authWithTemporary'))) {
        const token = authorization && authorization.startsWith(AUTH_MODE_PREFIX) ? authorization.slice(AUTH_MODE_PREFIX.length, authorization.length) : null;
        if (token){
            try{
                const payload = await getPayloadFromJWTAccessToken(token);
                req.jwtUser = JWTUser.JWTUserFromPayload(payload);
                req.error = null;
            }catch(error){
                console.error(error);
                req.error = ApiError.UNAUTHORIZED_ERROR(error.message);
            }
        }else{
            req.error = ApiError.UNAUTHORIZED_ERROR('No Authorization token found');
        }
    }
    next();
}

module.exports.httpRequestAuth = async function (req, rest, next) {
    await verifyToken(req.header('authorization'), req, next);
};
