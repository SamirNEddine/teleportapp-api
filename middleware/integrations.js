const {redisGetAsync, redisSetAsyncWithTTL} = require('../utils/redis');
const User = require('../model/User');
const {hasCalendarIntegrationEnabled} = require('../helpers/contextService');
const ApiError = require('../utils/apiError');

const REDIS_KEY_PREFIX = 'IsOnBoarded';

const _redisKey = function (userId) {
    return `${REDIS_KEY_PREFIX}${userId}`;
};
const updateIsOnBoardedCache = async function(userId, isOnBoarded){
    const redisKey = _redisKey(userId);
    await redisSetAsyncWithTTL(redisKey, isOnBoarded ? 'true' : 'false', 30*24*40*40 );
};
const isUserOnBoarded = async function(userId){
    let result = false;
    const redisKey = _redisKey(userId);
    const cachedResult = await redisGetAsync(redisKey);
    if(cachedResult){
        result = (cachedResult === 'true');
    }else{
        console.log('Fetching if user is on-boarded from database');
        const user = User.findById(userId);
        result = user.onBoarded;
        await updateIsOnBoardedCache(userId, result);
    }
    return result;
};
module.exports.integrationsCheck = async function (req, rest, next) {
    if((!req.header('ByPassIntegrationCheck') || req.header('ByPassIntegrationCheck') === 'false') && !req.body.query.includes('addGoogleCalendarIntegration')){
        if(!req.error && req.jwtUser){
            try{
                if(! await isUserOnBoarded() && ! await hasCalendarIntegrationEnabled(req.jwtUser.id)){
                    req.error = ApiError.MISSING_CALENDAR_INTEGRATION();
                }
            }catch(e){
                req.error = ApiError.MISSING_CALENDAR_INTEGRATION();
            }
        }
    }
    next();
};
module.exports.updateIsOnBoardedCache = updateIsOnBoardedCache;