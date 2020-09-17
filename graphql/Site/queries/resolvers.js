const Company = require('../../../model/Company');

module.exports.siteResolver = async function (_, {id, companyId}, {jwtUser}) {
    try{
        companyId = companyId ? companyId : jwtUser.companyId;
        const company = await Company.findById(companyId);
        return company.sites.find(site => site.id === id );
    }catch(error){
        console.error(error);
        throw(error);
    }
};