const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ApiError = require('./apiError');
const {redisHmsetAsync, redisHmgetAsync} = require('./redis');

/** Constants **/
const AUTH_MODE_PREFIX = module.exports.AUTH_MODE_PREFIX = 'Bearer ';

/** GraphQL authentication protection through a higher order function on resolvers **/
module.exports.authenticatedResolver = function (resolver) {
    return function (parent, args, context, info) {
        let {jwtUser, error} = context;
        if (!jwtUser || error){
            error = error ? error : ApiError.INTERNAL_SERVER_ERROR();
            throw(error);
        }else{
            return resolver(parent, args, context, info)
        }
    }
};

/** Text hashing and verification **/
const generateHashForText = module.exports.generateHashForText = async function (text) {
    return argon2.hash(text, argon2.argon2id);
};
const verifyHashForText = module.exports.verifyHashForText = async function (hash, text) {
    return argon2.verify(hash, text);
};

/** Temporary access code **/
module.exports.generateTemporaryAccessCode = async function (emailAddress) {
    if(!emailAddress) throw ApiError.INTERNAL_SERVER_ERROR();
    const randomCode = crypto.randomBytes(20).toString('base64').slice(0, 30);
    //Store a hash of the code in redis
    const codeHash = await generateHashForText(randomCode);
    await redisHmsetAsync(emailAddress, {code: codeHash, timestamp: Date.now()/1000});
    return randomCode;
};
module.exports.verifyTemporaryAccessCode = async function (emailAddress, code) {
    const [hash, timestamp] = await redisHmgetAsync(emailAddress, 'code', 'timestamp');
    if (!hash){
        throw ApiError.INVALID_ACCESS_CODE_ERROR();
    }
    if(Date.now()/1000 - parseInt(timestamp) > process.env.TEMP_CODE_VALIDTY_IN_SECONDS){
        throw ApiError.EXPIRED_ACCESS_CODE_ERROR();
    }
    if(! await verifyHashForText(hash, code)) {
        throw ApiError.INVALID_ACCESS_CODE_ERROR();
    }
};

/** JWT Access Token **/
class JWTUser {
    constructor(userId, email){
        this.id = userId;
        this.email = email;
    }
    static JWTUserFromPayload({user}){
        return new JWTUser(user.id, user.email);
    }
    toPlainObject(){
        return Object.assign({}, this);
    }
}
module.exports.JWTUser = JWTUser;
module.exports.getJWTAccessTokenForUser = async function (userId, email) {
    const jwtUser = new JWTUser(userId, email);
    return jwt.sign({user: jwtUser.toPlainObject()}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION});
};
module.exports.getPayloadFromJWTAccessToken = async function (token) {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
};

/** JWT Refresh Token **/
module.exports.getJWTRefreshTokenForUser = async function (userId) {
    return jwt.sign({userId}, process.env.JWT_REFRESH_TOKEN_SECRET, {expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION});
};
module.exports.getPayloadFromJWTRefreshToken = async function (token) {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
};