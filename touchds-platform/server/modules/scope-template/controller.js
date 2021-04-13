const TemplateModel = require('./model')

class TemplateController {
    /**
     * 创建模板
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;
        try {
            const ret = await TemplateModel.createTemplate(req);

            const data = await TemplateModel.getTemplateDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = data

        } catch (err) {
            ctx.response.status = 412;
            ctx.body = {
                code: 200,
                message: 'error',
                data: err
            }
        }
    }

    /**
     * 获取全部模板列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async list(ctx) {
        let data = await TemplateModel.getTemplate();
        data && data.forEach(t => {
            t.config = {};
        });
        ctx.response.status = 200;
        ctx.body = data || [];
    }
}

module.exports = TemplateController
