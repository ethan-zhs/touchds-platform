/* Created by tommyZZM.OSX on 2020/3/25. */
import {fieldsCreatedAt, fieldsCreatedAtAndUpdatedAt, fieldsId, fieldsIdAndName} from "../utils/share-fields";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('component_types', {
        ...fieldsId(DataTypes),
        icon_name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'icon_name',
            comment: '图标名称'
        },
        icon_unicode: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'icon_unicode',
            comment: '图标对应的字体unicode'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'name',
            comment: '组件类型英文名称'
        },
        cn_name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'cn_name',
            comment: '组件类型中文名称'
        },
        parent_Id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            field: 'parent_Id'
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'alias'
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    });
}
