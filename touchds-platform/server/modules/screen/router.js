const ScreenController = require('./controller')

function combindRouter(router) {
    // 创建大屏
    router.post('/screen', ScreenController.create);

    // 获得大屏详情
    router.get('/screen', ScreenController.detail);

    // 删除大屏
    router.delete('/screen/:screenId', ScreenController.delete);

    // 复制大屏
    router.post('/screen/copy/:screenId', ScreenController.copy);

    // 更新大屏
    router.put('/screen/:screenId', ScreenController.update);

    router.put('/screen/config/:config_id', ScreenController.updateConfig)
}


module.exports = combindRouter
