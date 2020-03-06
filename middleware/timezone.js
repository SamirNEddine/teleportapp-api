const ApiError = require('../utils/apiError');
const {updateUserTimezoneIfNeeded} = require('../utils/timezone');

module.exports.httpTimezoneCheck = async function (req, rest, next) {
    if(!req.error){
        const timezoneOffset = req.header('TimezoneOffset');
        const timezoneOffsetInt = parseInt(timezoneOffset);
        if(timezoneOffset && timezoneOffsetInt){
            try{
                await updateUserTimezoneIfNeeded(req.jwtUser.id, timezoneOffset);
                req.timezoneOffset = timezoneOffsetInt;
            }catch(error){
                console.error(error);
                req.error = ApiError.INTERNAL_SERVER_ERROR(error.message);
            }
        }else{
            req.error = ApiError.BAD_REQUEST_ERROR('Bad request: Missing or invalid TimezoneOffset header');
            console.error(req.error);
        }
    }
    next();
};