const TemplateController = require('./controller')

function combindRouter(router) {
    // 创建模板
    router.post('/template/create', TemplateController.create);

    // 获取全部模板列表
    router.get('/template', TemplateController.list);
}


module.exports = combindRouter