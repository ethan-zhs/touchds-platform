const WorkSpaceController = require('./controller')

function combindRouter(router) {
    // 创建工作空间
    router.post('/workspace/create', WorkSpaceController.create);

    // 创建工作空间, 如果不存在的话
    router.post('/workspace/ensure', WorkSpaceController.ensure);

    // 获取工作空间列表
    router.get('/workspace/list', WorkSpaceController.list);

    // 获取工作空间详情
    router.get('/workspace/detail/:id', WorkSpaceController.detail);
}


module.exports = combindRouter
