const ProjectController = require('./controller')

function combineRouter(router) {
    // 创建项目
    router.post('/projects/create', ProjectController.create);

    // 根据分组pk获取项目列表
    router.get('/projects', ProjectController.list);
}


module.exports = combineRouter
