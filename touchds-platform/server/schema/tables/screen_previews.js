/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
import {fieldsCreatedAtAndUpdatedAt, fieldsId} from "../utils/share-fields";

// P0
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('screen_previews', {
        ...fieldsId(DataTypes),
        preview_hash: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'preview_hash',
            comment: '大屏配置hash用于预览'
        },
        screen_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'screen_id',
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        dateStrings: true,
        freezeTableName: true,
        timestamps: false
    })
}
