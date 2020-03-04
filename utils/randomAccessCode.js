const Crypto = require('crypto');

module.exports = function () {
    return Crypto
        .randomBytes(20)
        .toString('base64')
        .slice(0, 20);
};