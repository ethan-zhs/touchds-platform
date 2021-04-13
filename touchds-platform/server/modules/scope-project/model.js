// 引入建立连接mysql数据库的db.js文件
// const db = require('../../config/db');

// 引入Sequelize对象
// const Sequelize = db.sequelize;

// 引入数据表模型文件
// const Project = Sequelize.import('./schema');
// const UserGroup = Sequelize.import('../usergroup/schema');
// const Screen = Sequelize.import('../screen/schema');
//
// // 定义项目表与分组表关联关系
// const ProjectToGroup = Project.hasMany(UserGroup, {
//     as: 'userGroups',
//     foreignKey: 'projectId'
// });
//
// // 定义项目表与大屏表关联关系
// const ProjectToScreen = Project.hasMany(Screen, {
//     as: 'screens',
//     foreignKey: 'projectId'
// });
//
// // 自动创建表
// Project.sync({ force: false });
const schema = require("../../schema")

const { scopeProjects: schemaScopeProjects } = schema;

class ProjectModel {
    /**
     * 创建项目
     * @param data
     * @returns {Promise<*>}
     */
    static async createProject(data) {
        return await schemaScopeProjects.create({
            name: data.name,
            workspace_id: data.workspace_id,
            type: data.type
        })
    }

    /**
     * 获取全部项目列表
     * @param groupPk  项目pk
     * @returns {Promise<Model>}
     */
    static async getProjectsByWorkspace(workspace_id) {
        const schemaRefs = await schema.getMappingRefs;
        return await schemaScopeProjects.findAll({
            where: {
                workspace_id
            },
            include: [
                { association: schemaRefs.scopeProjectsWithScopeGroups },
                { association: schemaRefs.scopeProjectsWithScreens }
            ]
        })
    }

    /**
     * 查询单项目详情
     * @param pk  项目pk
     * @returns {Promise<Model>}
     */
    static async getProjectDetail(id) {
        const schemaRefs = await schema.getMappingRefs;
        return await schemaScopeProjects.findOne({
            where: {
                id
            },
            include: [
                { association: schemaRefs.scopeProjectsWithScopeGroups },
                { association: schemaRefs.scopeProjectsWithScreens }
            ]
        })
    }
}

module.exports = ProjectModel
