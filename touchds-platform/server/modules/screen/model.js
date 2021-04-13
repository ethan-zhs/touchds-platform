// 引入建立连接mysql数据库的db.js文件
// const db = require('../../config/db');
const md5 = require('../../../lib/md5');

// // 引入Sequelize对象
// const Sequelize = db.sequelize;
//
// // 引入数据表模型文件
// const Screen = Sequelize.import('./schema');
// const Config = Sequelize.import('../config/schema');
//
// // 自动创建表
// Screen.sync({ force: false });
//
// // 定义大屏表与配置表关联关系
// const ScreenToConfig = Screen.hasOne(Config, {
//     foreignKey: 'screenId'
// });
const schema = require('../../schema');

const {
    configOfScreens: schemaConfigOfScreens,
    screens: schemaScreens
} = schema;

class ScreenModel {
    static async updateConfig(data, config_id) {
        return await schemaConfigOfScreens.update(data, {
            where: {
                id: config_id
            }
        })
    }
    /**
     * 创建项目
     * @param data
     * @param patchJson
     * @returns {Promise<*>}
     */
    static async createScreen(data, patchJson = null) {
        const hash = md5(Date.now());

        const config = await schemaConfigOfScreens.create({
            json: patchJson || JSON.stringify({
                screenConfig: {
                    width: 600,
                    height: 600,
                    display: 1
                },
            }),
        });

        return schemaScreens.create({
            group_id: data.group_id,
            project_id: data.project_id,
            alias: data.alias,
            name: data.name,
            share: data.share,
            is_lock: data.isLock,
            thumbnail: data.thumbnail,
            create_at: new Date(),
            update_at: new Date(),
            share_hash: hash,
            config_id: config.id
        })
    }

    static async getScreenIdByHash(hash) {
        const screen = await schemaScreens.findOne({
            where: { share_hash: hash },
            raw: true
        });
        return screen.id;
    }

    static async getScreenMeta(id) {
        return await schemaScreens.findOne({
            where: {
                id
            }
        })
    }

    /**
     * 查询单大屏详情
     * @param pk  项目pk
     * @returns {Promise<Model>}
     */
    static async getScreenDetail(id) {
        const schemaRefs = await schema.getMappingRefs;
        return await schemaScreens.findOne({
            where: {
                id
            },
            include: [
                { association: schemaRefs.screensWithConfig }
            ]
        })
    }

    /**
     * 根据分组id批量更新大屏
     * @param updateObj  更新数据对象
     * @param groupId  分组id
     * @returns {Promise<Model>}
     */
    static async updateScreensByGroupId(updateObj, groupId) {
        return await schemaScreens.update(updateObj, {
            where: {
                groupId: 42
            }
        })
    }

    /**
     * 删除大屏
     * @param groupId  大屏id
     * @returns {Promise<Model>}
     */
    static async deleteScreen(screenId) {
        if (!screenId) return void 0;
        return schemaScreens.destroy({
            where: {
                id: screenId
            }
        })
    }

    /**
     * 更新大屏
     * @param data  更新数据对象
     * @param groupId  大屏id
     * @returns {Promise<Model>}
     */
    static async updateScreen(data, screenId) {
        return await schemaScreens.update(data, {
            where: {
                id: screenId
            }
        })
    }
}

module.exports = ScreenModel
