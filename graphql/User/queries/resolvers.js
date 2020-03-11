const User = require('../../../model/User');
const {generateCalendarAccessAuthURL} = require('../../../utils/google');

module.exports.userResolver = async function (_, args, {jwtUser}) {
    try{
        return await User.findById(jwtUser.id);
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