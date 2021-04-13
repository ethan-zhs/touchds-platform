const UserGroupController = require('./controller')

function combindRouter(router) {
    // 创建分组
    router.post('/scope-group/create', UserGroupController.create);

    // 删除分组
    router.delete('/scope-group/:groupId', UserGroupController.delete);

    // 删除分组
    router.put('/scope-group/:groupId', UserGroupController.update);

    // 查询分组
    router.get('/scope-group/list', UserGroupController.list);
}


module.exports = combindRouter
