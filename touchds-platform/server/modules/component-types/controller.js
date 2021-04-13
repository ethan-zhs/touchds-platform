const ComponentTypeModel = require('./model')

class ComponentTypeController {
    /**
     * 获取全部类型列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async list(ctx) {
        let data = await ComponentTypeModel.getAll() || [];
        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success',
            data
        }
    }
}

module.exports = ComponentTypeController
