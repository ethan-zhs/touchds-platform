const ProjectModel = require('./model')

class ProjectController {
    /**
     * 创建项目
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;
        const ret = await ProjectModel.createProject(req);
        const data = await ProjectModel.getProjectDetail(ret.id);

        ctx.response.status = 200;
        ctx.body = {
            code: 200,
            message: 'success',
            data
        }
    }

    /**
     * 获取全部项目列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async list(ctx) {
        const { workspace_id } = ctx.query;
        let data = await ProjectModel.getProjectsByWorkspace(workspace_id);
        ctx.response.status = 200;
        // console.log('data.map(item => item.dataValues)', data.map(item => item.dataValues))
        ctx.body = {
            code: 200,
            message: 'success',
            data: data.map(item => item.dataValues)
        }
    }
}

module.exports = ProjectController
