/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
import {fieldsCreatedAtAndUpdatedAt, fieldsIdAndName} from "../utils/share-fields";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('components', {
        ...fieldsIdAndName(DataTypes),
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'name',
            comment: '组件名称'
        },
        version: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'version',
            comment: '组件版本'
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'alias'
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'icon',
            comment: '组件对应图标'
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'thumbnail'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'description'
        },
        source_url: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'source_url',
            comment: '组件js对应的源码url'
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'url',
            comment: '组件js对应的加载url'
        },
        config: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            field: 'config',
            comment: '组件对应的配置'
        },
        type_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'type_id'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'user_id'
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        dateStrings: true,
        freezeTableName: true,
        timestamps: false
    })
}
