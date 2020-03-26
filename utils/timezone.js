const {DateTime} = require("luxon");
const {redisGetAsync, redisSetAsync} = require('./redis');
const User = require('../model/User');

const IANA_TIMEZONE_KEY = "IANATimezone";

const updateUserIANATimezoneIfNeeded = async function (userId, IANATimezone) {
    const cacheKey = `${IANA_TIMEZONE_KEY}_${userId}`;
    const lastRecordedTimezoneOffset = await redisGetAsync(cacheKey);
    if(lastRecordedTimezoneOffset !== IANATimezone){
        await redisSetAsync(cacheKey, IANATimezone);
        await User.findOneAndUpdate(
            {_id: userId},
            {IANATimezone});
    }
};
// NB: Time here is a string representation  of the time in 24 hours format with a leading digit. Example: 8:30 a.m. => 0830
const getTimestampFromLocalTodayTime = function(time, IANATimezone) {
    const localDateTime  = DateTime.utc().setZone(IANATimezone);
    const hour = parseInt(time.slice(0,2));
    const minute = parseInt(time.slice(2));
    const {year, month, day} = localDateTime;
    const dateTime = DateTime.fromObject({year, month, day, hour, minute, zone:IANATimezone });
    return dateTime.toMillis();
};

module.exports.updateUserIANATimezoneIfNeeded = updateUserIANATimezoneIfNeeded;
module.exports.getTimestampFromLocalTodayTime = getTimestampFromLocalTodayTime;
