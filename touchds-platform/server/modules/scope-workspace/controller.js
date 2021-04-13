const WorkSpaceModel = require('./model')

/**
 * 创建工作空间
 * @param ctx
 * @returns {Promise.<void>}
 */
async function create(ctx) {
    const req = ctx.request.body;
    const ret = await WorkSpaceModel.createWorkSpace({
        ...req,
        user_id: ctx.session.userId
    });
    const data = await WorkSpaceModel.getProjectDetail(ret.id);

    if (data) {
        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success',
            data
        }
    }
}

async function ensure(ctx) {
    const reqBody = ctx.request.body;
    let data = await WorkSpaceModel.getWorkSpaceOfUser(ctx.session.userId);
    if (!data) {
        data = await WorkSpaceModel.createWorkSpace({
            ...reqBody,
            user_id: ctx.session.userId
        });
        data = await WorkSpaceModel.getWorkSpaceDetail(data.id);
    }
    if (data) {
        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success',
            data: { id: data.id }
        }
    }
}


/**
 * 获取全部工作空间列表
 * @param ctx
 * @returns {Promise.<void>}
 */
async function list(ctx) {
    const { groupPk } = ctx.params;
    try {
        let data = await WorkSpaceModel.getWorkSpaceList(groupPk);
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
            data
        }
    }
}

/**
 * 获取工作空间详情详情
 * @param ctx
 * @returns {Promise.<void>}
 */
async function detail(ctx) {
    const id = ctx.params.id;

    if (id) {
        try {
            let data = await WorkSpaceModel.getWorkSpaceDetail(id);
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
                data
            }
        }
    } else {
        ctx.response.status = 416;
        ctx.body = {
            code: 416,
            message: 'ID EMPTY'
        }
    }
}

module.exports = {
    create,
    list,
    detail,
    ensure
}
