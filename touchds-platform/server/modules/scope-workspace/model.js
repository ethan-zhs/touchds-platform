// 引入建立连接mysql数据库的db.js文件
// const db = require('../../config/db');
//
// // 引入Sequelize对象
// const Sequelize = db.sequelize;
//
// // 引入数据表模型文件
// const Workspace = Sequelize.import('./schema');
//
// // 自动创建表
// Workspace.sync({ force: false });
const schema = require('../../schema')
const { scopeWorkspaces: schemaScopeWorkspaces } = schema;

/**
 * 创建工作空间
 * @param data
 * @returns {Promise<*>}
 */
async function createWorkSpace(data) {
    return await schemaScopeWorkspaces.create({
        // id: data.id,
        name: data.name,
        user_id: data.user_id
    })
}

async function getWorkSpaceOfUser(user_id) {
    const schemaRefs = await schema.getMappingRefs;
    return await schemaScopeWorkspaces.findOne({
        where: { user_id },
        include: [
            { association: schemaRefs.scopeWorkspacesWithScopeProjects },
        ]
    })
}

/**
 * 查询工作空间详情详情
 * @param id  工作空间id
 * @returns {Promise<Model>}
 */
async function getWorkSpaceDetail(id) {
    const schemaRefs = await schema.getMappingRefs;
    return await schemaScopeWorkspaces.findOne({
        where: { id },
        include: [
            { association: schemaRefs.scopeWorkspacesWithScopeProjects },
        ]
    })
}

module.exports = {
    createWorkSpace,
    getWorkSpaceOfUser,
    getWorkSpaceDetail
}
