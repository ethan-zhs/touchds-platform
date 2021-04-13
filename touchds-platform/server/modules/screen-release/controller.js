const R = require('ramda');
const sha256 = require('../../../lib/sha256');
const schema = require("../../schema");

const {
    screens: schemaScreens,
    screenReleases: schemaScreenReleases,
    configOfScreens: schemaConfigOfScreens,
} = schema;

async function createReleaseRealTimeOfScreen(ctx) {
    const { screen_id } = ctx.params;
    const found = await schemaScreens.findOne({
        where: {
            id: screen_id
        }
    })
    return schemaScreenReleases.create({
        screen_id,
        share_status: 'realtime',
        share_config_id: found.config_id,
        password_encrypted: null,
        comment: ''
    })
}

async function createSnapshotOfScreen(ctx) {
    const { screen_id } = ctx.params;
    const schemaRefs = await schema.getMappingRefs;
    const found = await schemaScreens.findOne({
        where: {
            id: screen_id
        },
        include: [
            {
                association: schemaRefs.screensWithConfig
            }
        ]
    });
    const configCloned = await schemaConfigOfScreens.create({
        json: found.config.json,
    });
    schemaScreenReleases.create({
        screen_id,
        share_status: 'snapshot',
        share_config_id: configCloned.id,
        password_encrypted: null,
        comment: ''
    });
    ctx.response.status = 200;
    return ctx.body = {
        code: 200,
        message: 'success',
    }
}

async function releaseRealtime(ctx) {
    const { screen_id } = ctx.params;
    const { password } = ctx.request.body;
    let foundRealtime = await schemaScreenReleases.findOne({
        where: {
            screen_id,
            share_status: 'realtime',
        }
    });
    if (!foundRealtime) {
        foundRealtime = await createReleaseRealTimeOfScreen(ctx)
    }

    if (password) {
        await schemaScreenReleases.update({
            password_encrypted: sha256(password)
        }, { where: { id: foundRealtime.id } })
    }

    await schemaScreens.update({
        screen_release_id: foundRealtime.id
    }, {
        where: { id: screen_id }
    });

    ctx.response.status = 200;
    return ctx.body = {
        code: 200,
        message: 'success',
    }
}

async function releaseByReleaseId(ctx) {
    const { release_id } = ctx.params;
    const { password } = ctx.request.body;
    const found = await schemaScreenReleases.findOne({
        where: {
            id: release_id
        },
    });
    const { screen_id } = found;
    await schemaScreens.update({
        screen_release_id: release_id
    }, {
        where: { id: screen_id }
    });
    await schemaScreenReleases.update({
        password_encrypted: sha256(password)
    }, { where: { id: found.id } });
    ctx.response.status = 200;
    return ctx.body = {
        code: 200,
        message: 'success',
    }
}

async function findCurrentReleaseByScreen(ctx) {
    const { screen_id } = ctx.params;
    const schemaRefs = await schema.getMappingRefs;
    const found = await schemaScreens.findOne({
        where: {
            id: screen_id
        },
        include: [
            { association: schemaRefs.screensWithRelease }
        ]
    });
    if (!found) {
        return ctx.response.status = 404;
    }
    const foundRaw = found.toJSON();
    if (foundRaw.release) {
        const { release } = foundRaw;
        foundRaw.release = {
            ...R.pick(
                ['id', 'screen_id', 'share_status', 'share_config_id', 'comment'],
                release),
            has_password: !!release.password_encrypted
        }
    }
    ctx.response.status = 200;
    return ctx.body = {
        code: 200,
        message: 'success',
        data: foundRaw
    }
}

async function findSnapshotMetasByScreen(ctx) {
    const { screen_id } = ctx.params;
    const listReleasesAsSnapshot = await schemaScreenReleases.findAll({
        where: {
            screen_id,
            share_status: 'snapshot'
        }
    });
    ctx.response.status = 200;
    return ctx.body = {
        code: 200,
        message: 'success',
        data: listReleasesAsSnapshot
    }
}

async function putSnapshotComment(ctx) {
    const { release_id } = ctx.params;
    const { comment } = ctx.request.body;
    await schemaScreenReleases.update({
        comment
    }, {
        where: { id: release_id }
    })
    ctx.response.status = 200;
    return ctx.body = {
        code: 200,
        message: 'success',
    }
}

async function deleteReleased(ctx) {
    const { screen_id } = ctx.params;
    await schemaScreens.update({
        screen_release_id: null
    }, {
        where: { id: screen_id }
    });
    ctx.response.status = 200;
    return ctx.body = {
        code: 200,
        message: `success`,
    }
}
async function deleteSnapshot(ctx) {
    const { release_id } = ctx.params;
    await schemaScreenReleases.destroy({
        where: { id: release_id }
    });
    ctx.response.status = 200;
    return ctx.body = {
        code: 200,
        message: `success`,
    }
}

async function getReleasedByHash(ctx) {
    const { share_hash } = ctx.params;
    const { password } = ctx.request.body;
    const schemaRefs = await schema.getMappingRefs;
    const found = await schemaScreens.findOne({
        where: { share_hash },
        include: [
            {
                association: schemaRefs.screensWithRelease,
                include: [
                    { association: schemaRefs.screensReleasesWithConfig }
                ]
            }
        ]
    });
    if (!found || !found.release || !found.release.config) {
        return ctx.response.status = 404;
    }

    if (found.password_encrypted) {
        if (R.isNil(password)) {
            ctx.body = {
                code: 403,
                flag: 'password',
                message: 'password',
            };
            return ctx.response.status = 403;
        }
        if (sha256(found.password_encrypted) !== sha256(password)) {
            return ctx.response.status = 403;
        }
    }

    ctx.response.status = 200;
    return ctx.body = {
        code: 200,
        message: `success`,
        data: JSON.parse(found.release.config.json)
    };
}

module.exports = {
    createSnapshotOfScreen,
    releaseByReleaseId,
    releaseRealtime,
    deleteSnapshot,
    findSnapshotMetasByScreen,
    findCurrentReleaseByScreen,
    // findSnapshotOfScreen,
    putSnapshotComment,
    deleteReleased,
    getReleasedByHash
};
