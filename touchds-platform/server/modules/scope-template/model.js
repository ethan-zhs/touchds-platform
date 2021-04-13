// 引入建立连接mysql数据库的db.js文件
// const db = require('../../config/db');
//
// // 引入Sequelize对象
// const Sequelize = db.sequelize;
//
// // 引入数据表模型文件
// const Template = Sequelize.import('./schema');
//
// // 自动创建表
// Template.sync({ force: false });
const schema = require('../../schema')
const { configOfTemplates: schemaConfigOfTemplates, scopeTemplates: schemaScopeTemplates } = schema;

class TemplateModel {
    /**
     * 创建项目
     * @param data
     * @returns {Promise<*>}
     */
    static async createTemplate(data) {
        const {
            name,
            json,
        } = data;

        const config = await schemaConfigOfTemplates.create({
            name,
            size_width: data.size_width,
            size_height: data.size_height,
            json
        });
        // const template = await schemaScopeTemplates.create({
        //     template_id: config.id
        // })
    }

    /**
     * 获取全部模板列表
     * @returns {Promise<Model>}
     */
    static async getTemplate() {
        return await schemaConfigOfTemplates.findAll()
    }

    /**
     * 查询单模板详情
     * @param id  模板id
     * @returns {Promise<Model>}
     */
    static async getTemplateDetail(id) {
        return await schemaConfigOfTemplates.findOne({
            where: {
                id
            }
        })
    }

    static async getTemplateDetailWithConfig(id) {
        // const schemaRefs = await schema.getMappingRefs;
        return await schemaConfigOfTemplates.findOne({
            where: {
                id
            },
        })
    }
}

module.exports = TemplateModel
