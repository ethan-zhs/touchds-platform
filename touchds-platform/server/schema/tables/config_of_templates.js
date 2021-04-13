import {fieldsCreatedAtAndUpdatedAt, fieldsId, fieldsIdAndName} from "../utils/share-fields";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('config_of_templates', {
        ...fieldsIdAndName(DataTypes),
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'description'
        },
        thumbnail: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'thumbnail'
        },
        size_width: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'size_width'
        },
        size_height: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'size_height'
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'level'
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'priority'
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            field: 'is_deleted'
        },
        json: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            field: 'config'
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        freezeTableName: true,
        timestamps: false
    })
}
