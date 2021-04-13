const ComponentController = require('./controller')

function combindRouter(router) {
    // 获取组件列表
    router.get('/com/all', ComponentController.list);

    // 获取组件列表
    router.post('/com', ComponentController.create);

    // 获取组件列表
    router.get('/com', ComponentController.getComponent);

    // 获取组件执行url
    router.get('/com/url', ComponentController.getComponentUrl);
}


module.exports = combindRouter