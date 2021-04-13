const controller = require('./controller')

function patchRouter(router) {
    // 保存screen配置
    router.post('/screen-preview', controller.create);

    // 获得一个screen的配置
    router.get('/screen-preview/:hash', controller.findByHash);
}


module.exports = patchRouter;
