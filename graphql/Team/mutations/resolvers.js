const Company = require('../../../model/Company');

module.exports.createTeamResolver = async function (_, {name, companyId}, {jwtUser}) {
    try{
        companyId = companyId ? companyId : jwtUser.companyId;
        const company = await Company.findById(companyId);
        company.teams.push({name});
        const savedCompany = await company.save();
        return savedCompany.teams.pop()
    }catch(error){
        console.error(error);
        throw(error);
    }
};