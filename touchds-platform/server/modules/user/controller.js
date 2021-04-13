const UserModel = require('./model')
const md5 = require('../../../lib/md5');
const { response200Ok, response403Forbidden } = require("../../utils/response");

class UserController {
    static async myself(ctx) {
        if (ctx.session.isNew) {
            return response403Forbidden(ctx, null)
        }
        if (!ctx.session.isLogin || !ctx.session.userId) {
            return response403Forbidden(ctx, null)
        }
        const user = await UserModel.queryUserById({ id: ctx.session.userId })

        return response200Ok(ctx, user.toJSON())
    }
    static async register(ctx) {
        const req = ctx.request.body;
        const password = md5(req.password);
        let data = await UserModel.queryUser({ ...req, password });
        if (data) {
            return response403Forbidden(ctx, {
                message: '用户名已被注册'
            });
        }
        data = await UserModel.createUser({ ...req, password });
        ctx.session.isLogin = true;
        ctx.session.userId = data.id;
        return response200Ok(ctx, null);
    }
    static async logout(ctx) {
        if (ctx.session.isNew) {
            return response403Forbidden(ctx, null)
        }
        if (!ctx.session.isLogin || !ctx.session.userId) {
            return response403Forbidden(ctx, null)
        }
        ctx.session.isLogin = false;
        ctx.session.userId = null;
        return response200Ok(ctx, null);
    }
    /**
     * 登陆
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async login(ctx) {
        const req = ctx.request.body;
        const password = md5(req.password)
        const data = await UserModel.queryUser({ ...req, password });
        if (data) {
            ctx.session.isLogin = true;
            ctx.session.userId = data.id;
            return response200Ok(ctx, { id: data.id });
            // ctx.response.status = 200;
            // ctx.body = {
            //     code: 200,
            //     message: 'success',
            //     data
            // }
        } else {
            return response403Forbidden(ctx, null);
            // ctx.session.isLogin = false;
            // ctx.response.status = 403;
            // ctx.body = {
            //     code: 403,
            //     message: 'can not found user'
            // }
        }
    }
}

module.exports = UserController
