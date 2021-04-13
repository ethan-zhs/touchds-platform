const Router = require('koa-router')

const router = new Router({
    prefix: '/api/v1'
})

const ROUTER_LIST = [
    'scope-workspace',
    'scope-group',
    'scope-project',
    'scope-template',
    // 'config',
    'screen',
    'screen-preview',
    'screen-release',
    'component-types',
    'component',
    'secret',
    'user'
]

function mappingRouter(router) {
    ROUTER_LIST.forEach(item => {
        const combinedRouter = require(`../modules/${item}/router`);
        combinedRouter && combinedRouter(router)
    })
}

mappingRouter(router);

module.exports = router
