const model = require('./model');

async function create(ctx) {
    const { screen_id } = ctx.request.query;
    const hash = await model.createScreenConfigPreview(screen_id);
    ctx.response.status = 200;
    ctx.body = {
        code: 200,
        message: 'success',
        hash
    }
}

async function findByHash(ctx) {
    const hash = ctx.params.hash;
    const data = await model.findOneScreenConfigPreview(hash);
    if (!data) {
        ctx.response.status = 404;
        return ctx.body = {
            code: 404,
            message: 'not found'
        }
    }
    ctx.response.status = 200;
    return ctx.body = {
        code: 200,
        message: 'success',
        data
    }
}

module.exports = {
    create,
    findByHash
};
