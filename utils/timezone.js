const {redisGetAsync, redisSetAsync} = require('./redis');
const User = require('../model/User');

const TIMEZONE_KEY = "timezone";

module.exports.updateUserTimezoneIfNeeded = async function (userId, timezoneOffset) {
    const cacheKey = `${TIMEZONE_KEY}_${userId}`;
    const lastRecordedTimezoneOffset = await redisGetAsync(cacheKey);
    if(lastRecordedTimezoneOffset !== timezoneOffset){
        await redisSetAsync(cacheKey, timezoneOffset);
        await User.findOneAndUpdate(
            {_id: userId},
            {timezoneOffset});
    }
};
module.exports.getLocalTodayInUTCTimestamp = function(timezoneOffset) {
    const UTCNow = new Date().getTime();
    const localNow = UTCNow + timezoneOffset*60*1000;
    return new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate());
};