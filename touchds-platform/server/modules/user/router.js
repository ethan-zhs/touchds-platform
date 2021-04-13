const UserController = require('./controller')

function combindRouter(router) {
    // 登录
    router.post('/account/login', UserController.login);

    router.get('/account/myself', UserController.myself);

    router.post('/account/register', UserController.register);

    router.post('/account/logout', UserController.logout);
}

module.exports = combindRouter
