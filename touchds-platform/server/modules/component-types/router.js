const ComponentTypeController = require('./controller')

function combindRouter(router) {
    // 获取组件类型列表
    router.get('/type/all', ComponentTypeController.list);
}


module.exports = combindRouter