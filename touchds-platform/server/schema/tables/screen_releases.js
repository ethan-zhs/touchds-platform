/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
import {fieldsCreatedAtAndUpdatedAt, fieldsId} from "../utils/share-fields";

// P0
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('screen_releases', {
        ...fieldsId(DataTypes),
        screen_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'screen_id',
        },
        share_status: {
            type: DataTypes.ENUM('realtime', 'snapshot'),
            allowNull: true,
            field: 'share_status',
            // comment: '发布的状态' // 0: 无 1: 实时页面 2: 快照
        },
        share_config_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'share_config_id',
        },
        password_encrypted: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'password_encrypted',
            // comment: '访问限制密码'
        },
        comment: {
            type: DataTypes.TEXT,
            field: 'comment',
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        dateStrings: true,
        freezeTableName: true,
        timestamps: false
    })
}
