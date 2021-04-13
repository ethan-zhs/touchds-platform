const SecretController = require('./controller')

function combindRouter(router) {
    // 获取oss上传token
    router.get('/secret', SecretController.instance.create);
}


module.exports = combindRouter