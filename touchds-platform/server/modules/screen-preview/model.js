// const { Op } = require('sequelize');
// const moment = require('moment');
// const db = require('../../config/db');
const R = require('ramda');
const tryJSON = require('../../../lib/try-json');
const md5 = require('../../../lib/md5');

// 引入Sequelize对象
// const Sequelize = db.sequelize;
//
// // 引入数据表模型文件
// const schemaScreenConfigPreview = Sequelize.import('./schema');

// 自动创建表
// schemaScreenConfigPreview.sync({ force: false });
const schema = require("../../schema")

const { screenPreviews: schemaScreenPreviews } = schema;

async function _deprecateScreenConfigOverTime() {
    // const createdAt = Date.now();
    // return schemaScreenPreview.destroy({
    //     where: {
    //         created_at: {
    //             [Op.lte]: moment(createdAt).subtract(1, 'hours').toDate()
    //         }
    //     }
    // })
}

async function createScreenConfigPreview(screen_id) {
    const createdAt = Date.now();
    const hash = md5(createdAt);
    // await _deprecateScreenConfigOverTime();
    await schemaScreenPreviews.create({
        // config: tryJSON.stringify(config),
        preview_hash: hash,
        screen_id: screen_id,
        created_at: createdAt
    });
    return hash;
}

async function findOneScreenConfigPreview(preview_hash) {
    const schemaRefs = await schema.getMappingRefs;
    const found = await schemaScreenPreviews.findOne({
        // raw: true,
        where: {preview_hash},
        include: [
            {
                association: schemaRefs.screensPreviewsWithOwnScreen,
                include: [
                    {association: schemaRefs.screensWithConfig},
                ]
            },
        ]
    });
    return tryJSON.parse(R.path(['screen', 'config', 'json'], found || {}), null);
}

module.exports = {
    createScreenConfigPreview,
    findOneScreenConfigPreview
};
