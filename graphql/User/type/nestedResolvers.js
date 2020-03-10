const Skill = require('../../../model/Skill');
const Availability = require('../../../model/Availability');;
const {getCalendarEventsUpdates} = require('../../../utils/google')

module.exports.nestedUserSkillsResolver = async function (user) {
    try{
        return await Skill.find({'_id': {$in: user.skills}})
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedAvailabilityResolver = async function (user, {untilDate=Date.now()/1000 + 24*60*60}) {
    try{
        //Local today date
        const localTodayDate = new Date(Date.now() + user.timezoneOffset*60*1000);
        localTodayDate.setHours(0,0,0,0);//Strip the time
        //Local today 00:00 in UTC
        const localTodayZeroHoursUTC = new Date(localTodayDate.getTime() - user.timezoneOffset*60*1000);
        //Local today 24:00 in UTC
        const localToday24HoursUTC = new Date(localTodayDate.getTime() - user.timezoneOffset*60*1000 + 24*60*60*1000);
        //Fetch stored slots
        const storeSlots = Availability.find({userId: user.id, startDateTime: {$lt: localToday24HoursUTC}, endDateTime: {$gt: localTodayZeroHoursUTC}});
        //Check for Calendar updates
        const googleIntegrationData = user.getIntegrationData('google');
        const calendarEvents = getCalendarEventsUpdates(user.id, googleIntegrationData, localTodayDate, localTodayZeroHoursUTC, localToday24HoursUTC);
        //Merge: Priority for Calendar slots for now
        for(let calendarEvent in calendarEvents) {

        }
        //Save in the database
        //Return slots

        return "X";
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};