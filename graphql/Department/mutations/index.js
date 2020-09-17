const { DepartmentType, inputFields } = require('../type');
const { createDepartmentResolver } = require('./resolvers');
const { authenticatedResolver } = require('../../../utils/authentication');
const { authorizedResolver, AccessLevels } = require('../../../utils/authorization');

/** Mutations definitions **/
const createDepartment = {
    type: DepartmentType,
    args: inputFields.createDepartment,
    resolve: authenticatedResolver(authorizedResolver(createDepartmentResolver, AccessLevels.SUPER_ADMIN))
};

/** Exports **/
module.exports = {
    createDepartment
};