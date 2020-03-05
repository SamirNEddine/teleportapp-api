
module.exports.userResolver = function () {
    try{
        return "To do";
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};