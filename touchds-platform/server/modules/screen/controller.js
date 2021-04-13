const ScreenModel = require('./model');
const TemplateModel = require('../scope-template/model');

class ScreenController {
    static async updateConfig(ctx) {
        const { config_id } = ctx.params;
        let reqBody = ctx.request.body;
        await ScreenModel.updateConfig(reqBody, config_id)

        ctx.body = {
            code: 200,
            message: 'success',
        }
    }

    /**
     * 创建大屏
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        // const { templateId } = ctx.params;
        const req = ctx.request.body;
        const templateData = req.template_id ?
            await TemplateModel.getTemplateDetailWithConfig(req.template_id) : null;

        let patchJson = null;
        if (templateData) {
            patchJson = templateData.toJSON().json
        }

        const ret = await ScreenModel.createScreen(req, patchJson);
        const screenData = await ScreenModel.getScreenDetail(ret.id);

        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success',
            data: screenData
        }
    }

    /**
     * 获取大屏详情
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async detail(ctx) {
        const { screenId } = ctx.query;
        const data = await ScreenModel.getScreenDetail(screenId);
        if (data) {
            ctx.response.status = 200;
            ctx.body = {
                code: 200,
                message: 'success',
                data: {
                    ...data.dataValues,
                    config: {
                        ...data.config.dataValues,
                        json: JSON.parse(data.config.json)
                    }
                }
            }
        }
    }


    /**
     * 删除大屏
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async delete(ctx) {
        const { screenId } = ctx.params;
        await ScreenModel.deleteScreen(screenId);
        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success'
        }
    }

    /**
     * 复制大屏
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async copy(ctx) {
        const { screenId } = ctx.params;
        const res = await ScreenModel.getScreenDetail(screenId);
        const copyData = {
            groupId: res.groupId,
            projectId: res.projectId,
            alias: res.alias,
            name: `${res.name}_copy`,
            thumbnail: res.thumbnail,
            createAt: new Date(),
            updateAt: new Date()
        };

        await ScreenModel.createScreen(copyData);
        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success'
        }
    }

    /**
     * 复制大屏
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async update(ctx) {
        const { screenId } = ctx.params;
        const req = ctx.request.body;
        await ScreenModel.updateScreen(req, screenId);
        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success'
        }
    }
}

module.exports = ScreenController
