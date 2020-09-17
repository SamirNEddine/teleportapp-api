const Company = require('../../../model/Company');

module.exports.companyResolver = async function (_, {companyId}, {jwtUser}) {
    try{
        companyId = companyId ? companyId : jwtUser.companyId;
        return await Company.findById(companyId);
    }catch(error){
        console.error(error);
        throw(error);
    }
};