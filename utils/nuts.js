const Nuts = require('../nuts').Nuts;

const nuts = Nuts({
    // GitHub configuration
    repository: process.env.APP_UPDATE_GITHUB_REPOSITORY,
    username: process.env.APP_UPDATE_GITHUB_USERNAME,
    password: process.env.APP_UPDATE_GITHUB_PASSWORD
});

module.exports = nuts;