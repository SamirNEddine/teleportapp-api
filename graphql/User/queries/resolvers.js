const {generateCalendarAccessAuthURL} = require('../../../utils/google');

module.exports.userResolver = function () {
    try{
        return 'To do';
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.getGoogleCalendarAuthURLResolver = function () {
    try{
        return generateCalendarAccessAuthURL();
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};