module.exports = function (emailAddress) {
    const fullName = emailAddress.split('@')[0].split('.');
    return {firstName: fullName[0], lastName: fullName[fullName.length-1]};
};