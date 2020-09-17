const Company = require('../../../model/Company');

module.exports.teamResolver = async function (_, {id, companyId}, {jwtUser}) {
    try{
        companyId = companyId ? companyId : jwtUser.companyId;
        const company = await Company.findById(companyId);
        return company.teams.find(team => team.id === id );
    }catch(error){
        console.error(error);
        throw(error);
    }
};