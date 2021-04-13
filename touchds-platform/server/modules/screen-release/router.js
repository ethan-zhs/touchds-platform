const controller = require('./controller')

function patchRouter(router) {
    const noop = () => null;

    // 获取当前已发布的大屏信息
    router.get('/screen-release/screen/:screen_id/online', controller.findCurrentReleaseByScreen);

    // 获取快照的元信息，并不需要包括config
    router.get('/screen-release/screen/:screen_id/snapshot/metas', controller.findSnapshotMetasByScreen)

    // 修改快照的注释
    router.put('/screen-release/snapshot/:release_id/comment', controller.putSnapshotComment)

    // 创建为当前的大屏一个快照
    router.post('/screen-release/screen/:screen_id/snapshot', controller.createSnapshotOfScreen);

    // 发布作为一个快照
    router.post('/screen-release/release-snapshot/:release_id', controller.releaseByReleaseId);

    // 发布作为实时页面
    router.post('/screen-release/release-realtime/:screen_id', controller.releaseRealtime);

    // 删除一个快照
    router.delete('/screen-release/snapshot/:release_id', controller.deleteSnapshot);

    // 下线当前的发布页面
    router.delete('/screen-release/un-release/:screen_id', controller.deleteReleased);

    // 获取一个发布的详细是数据
    router.post('/screen-release/get-released/:share_hash', controller.getReleasedByHash);
}


module.exports = patchRouter;
