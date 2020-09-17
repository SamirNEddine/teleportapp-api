const Company = require('../../../model/Company');

module.exports.departmentResolver = async function (_, {id, companyId}, {jwtUser}) {
    try{
        companyId = companyId ? companyId : jwtUser.companyId;
        const company = await Company.findById(companyId);
        return company.departments.find(dep => dep.id === id );
    }catch(error){
        console.error(error);
        throw(error);
    }
};