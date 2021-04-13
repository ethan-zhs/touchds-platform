const schema = require("../../schema")
const db = require("../../config/db")

const { components } = schema;

class ComponentModel {
    /**
     * 创建项目
     * @param data
     * @returns {Promise<*>}
     */
    static async create(data = {}) {
        return await components.create({
            name: data.comName,
            version: data.version,
            icon: data.icon,
            config: data.config,
            url: data.url,
            source_url: data.sourceUrl,
            description: '',
            type_id: data.secondTypeValue && data.secondTypeValue.id || 0,
            user_id: data.userId,
            alias: data.comCnName,
            thumbnail: '',
            created_at: new Date(),
            updated_at: new Date()
        })
    }
    /**
     * 根据组件名称和版本号获取组件对象
     * @returns {Promise<Model>}
     */
    static async getComponent(data = {}) {
        const { name, version = 'latest' } = data
        console.log('data', data)
        let sql = `select A.*, A.alias as nameComponent from components as A RIGHT JOIN (SELECT name, max(version) as version from components where name = $name) as B on A.name = B.name and A.version = B.version`
        const bind = {
            name
        }
        if (version && version !== 'latest') {
            sql = `select *, alias as nameComponent from components where name = $name and version = $version`
            bind.version = version
        }
        console.log('sql', sql, bind)
        return await db.sequelize.query(sql, {
            type: db.sequelize.QueryTypes.SELECT,
            // 防注入
            bind
        })     
    }
    /**
     * 获取全部组件列表
     * @returns {Promise<Model>}
     */
    static async getAll() {
        return await db.sequelize.query('select A.*, A.alias as nameComponent from components as A RIGHT JOIN (SELECT name, max(version) as version from components GROUP BY name) as B on A.name = B.name and A.version = B.version', {
            type: db.sequelize.QueryTypes.SELECT
        })      
    }
    /**
     * 根据组件名称和组件版本获取组件的执行url
     * @returns {Promise<Model>}
     */
    static async getComponentUrl(data = {}) {
        const { name, version } = data
        return await components.findOne({
            attributes: ['id', 'name', 'version', 'url'],
            where: {
                name,
                version
            }
        })      
    }
}

module.exports = ComponentModel