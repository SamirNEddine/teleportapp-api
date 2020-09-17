const Company = require('../../../model/Company');

module.exports.createDepartmentResolver = async function (_, {name, companyId}, {jwtUser}) {
    try{
        companyId = companyId ? companyId : jwtUser.companyId;
        const company = await Company.findById(companyId);
        company.departments.push({name});
        const savedCompany = await company.save();
        return savedCompany.departments.pop()
    }catch(error){
        console.error(error);
        throw(error);
    }
};