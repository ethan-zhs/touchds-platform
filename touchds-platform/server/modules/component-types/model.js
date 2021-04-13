// 引入建立连接mysql数据库的db.js文件
// const db = require('../../config/db');

// 引入Sequelize对象
// const Sequelize = db.sequelize;

// 引入数据表模型文件
// const ComponentType = Sequelize.import('./schema');

// 自动创建表
// ComponentType.sync({ force: false });

const schema = require("../../schema")

const { componentTypes: schemaComponentsTypes } = schema;

class ComponentTypeModel {
    /**
     * 获取全部类型列表
     * @returns {Promise<Model>}
     */
    static async getAll() {
        return await schemaComponentsTypes.findAll({
            attributes: ['id', 'name', 'icon_name', 'cn_name', 'icon_unicode', 'parent_Id']
        })
    }
}

module.exports = ComponentTypeModel
