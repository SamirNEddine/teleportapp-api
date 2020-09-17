const Company = require('../../../model/Company');

module.exports.createSiteResolver = async function (_, {name, streetAddress, zipCode, city, country, isHeadquarter=false, companyId, numberOfDesks=0, capacityRatioThreshold=1.0, blockOnThresholdOrMax=false}, {jwtUser}) {
    try{
        companyId = companyId ? companyId : jwtUser.companyId;
        const company = await Company.findById(companyId);
        company.sites.push({name, isHeadquarter, numberOfDesks, capacityRatioThreshold, blockOnThresholdOrMax, address: {streetAddress, zipCode, city, country}});
        const savedCompany = await company.save();
        return savedCompany.sites.pop()
    }catch(error){
        console.error(error);
        throw(error);
    }
};