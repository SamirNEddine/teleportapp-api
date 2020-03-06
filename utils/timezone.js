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