const Company = require('../../../model/Company');

module.exports.createSiteResolver = async function (_, {name, streetAddress, zipCode, city, country, isHeadquarter, companyId}, {jwtUser}) {
    try{
        companyId = companyId ? companyId : jwtUser.companyId;
        const company = await Company.findById(companyId);
        isHeadquarter = isHeadquarter ? isHeadquarter : false;
        company.sites.push({name, isHeadquarter, address: {streetAddress, zipCode, city, country}});
        const savedCompany = await company.save();
        return savedCompany.sites.pop()
    }catch(error){
        console.error(error);
        throw(error);
    }
};