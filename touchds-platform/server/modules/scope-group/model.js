// 引入建立连接mysql数据库的db.js文件
// const db = require('../../config/db');
//
// // 引入Sequelize对象
// const Sequelize = db.sequelize;
//
// // 引入数据表模型文件
// const UserGroup = Sequelize.import('./schema');
//
// // 自动创建表
// UserGroup.sync({ force: false });
const schema = require("../../schema")
const { scopeGroups: schemaScopeGroups } = schema;

class UserGroupModal {
    /**
     * 创建分组
     * @param data
     * @returns {Promise<*>}
     */
    static async createUserGroup(data) {
        return await schemaScopeGroups.create({
            name: data.name,
            project_id: data.project_id,
            create_at: data.create_at
        })
    }


    /**
     * 删除分组
     * @param groupId  分组id
     * @returns {Promise<Model>}
     */
    static async deleteUserGroup(groupId) {
        if (!groupId) {
            throw Error('expect groupId to be not nil')
        }
        return schemaScopeGroups.destroy({
            where: {
                id: groupId
            }
        })
    }

    /**
     * 更新分组
     * @param data  分组id
     * @param updateObj 更新数据对象
     * @returns {Promise<Model>}
     */
    static async updateUserGroup(updateObj, groupId) {
        if (!groupId) {
            throw Error('expect groupId to be not nil')
        }
        schemaScopeGroups.update(updateObj, {
            where: {
                id: groupId
            }
        })
    }
}

module.exports = UserGroupModal
