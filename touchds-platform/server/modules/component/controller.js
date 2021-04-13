const ComponentModel = require('./model')
const gt = require('semver/functions/gt');

class ComponentTypeController {
    /**
     * 获取全部组件列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async list(ctx) {
        try {
            let data = await ComponentModel.getAll() || [];
            ctx.response.status = 200;
            ctx.body = {
                code: 200,
                message: 'success',
                data
            }
        } catch (err) {
            ctx.response.status = 412;
            ctx.body = {
                code: 412,
                message: 'error',
                err
            }
        }
    }

    /**
     * 获取全部组件列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        try {
            const req = ctx.request.body;
            const { comName, version } = req;
            // 获取最近更新的那个组件对象
            const [{ version: latestComVersion }] = await ComponentModel.getComponent({ name: comName }) || [{ version: '0.0.0' }];
            const canUpdate = gt(version, latestComVersion)
            if (canUpdate) {
                const data = await ComponentModel.create(req);
                ctx.response.status = 200;
                ctx.body = {
                    code: 200,
                    message: 'success',
                    data
                };
            } else {
                ctx.response.status = 200;
                ctx.body = {
                    code: 400,
                    message: 'component version should be greater than previous version'
                };
            }
        } catch (err) {
            ctx.response.status = 412;
            ctx.body = {
                code: 412,
                message: 'error',
                error: err.toString()
            }
        }
    }

    /**
    * 获取单个组件
    * @param ctx
    * @returns {Promise.<void>}
    */
    static async getComponent(ctx) {
        try {
            const { name, version = 'latest' } = ctx.query;
            let data = await ComponentModel.getComponent({ name, version }) || [];
            ctx.response.status = 200;
            ctx.body = {
                code: 200,
                message: 'success',
                data: data && data.length > 0 && data[0] || {}
            }
        } catch (err) {
            console.log(err)
            ctx.response.status = 412;
            ctx.body = {
                code: 412,
                message: 'error',
                err
            }
        }
    }

    /**
     * 根据组件名称和组件版本获取组件的执行url
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getComponentUrl(ctx) {
        try {
            const { name, version } = ctx.query;
            if (name && version) {
                let data = await ComponentModel.getComponentUrl({ name, version }) || {};
                ctx.response.status = 200;
                ctx.body = {
                    code: 200,
                    message: 'success',
                    data
                }
            } else {
                ctx.response.status = 400;
                ctx.body = {
                    code: 400,
                    message: 'params error'
                }
            }
        } catch (err) {
            console.log(err)
            ctx.response.status = 412;
            ctx.body = {
                code: 412,
                message: 'error',
                err
            }
        }
    }
}

module.exports = ComponentTypeController
