const model = require('./model')
const screenModel = require('../screen/model')

class UserGroupController {
    /**
     * 创建分组
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;
        await model.createUserGroup(req);

        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success'
        }
    }

    /**
     * 查询分组
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async list(ctx) {
        const {workspaceId} = ctx.query;
        const data = await model.getUserGroup(workspaceId);

        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success',
            data
        }
    }

    /**
     * 删除分组
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async delete(ctx) {
        const {groupId} = ctx.params;
        await model.deleteUserGroup(groupId);
        await screenModel.updateScreensByGroupId({groupId: null}, groupId);
        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success'
        }
    }

    /**
     * 删除分组
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async update(ctx) {
        const {groupId} = ctx.params;
        const req = ctx.request.body;
        await model.updateUserGroup(req, groupId);

        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success'
        }
    }
}

module.exports = UserGroupController
