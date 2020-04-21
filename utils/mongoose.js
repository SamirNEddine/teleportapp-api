const mongoose = require('mongoose');
const dbConnectURL = process.env.DB_FULL_URL;
module.exports.connectToDb = function () {
    return new Promise(async function (resolve, reject) {
        try{
            await mongoose.connect(dbConnectURL, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex:true, useUnifiedTopology:true});
            console.info('Successfully connected to the database: ' + process.env.MAIN_DB_NAME + ' using username: '+process.env.DB_USERNAME + ' on port: '+process.env.DB_PORT);
            resolve();
        }catch(error){
            console.error(error);
            reject(error);
        }
    });
};
module.exports.disconnectFromDb = function () {
    mongoose.disconnect();
};