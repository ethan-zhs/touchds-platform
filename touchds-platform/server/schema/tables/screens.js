import {fieldsCreatedAtAndUpdatedAt, fieldsIdAndName} from "../utils/share-fields";

// P0
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('screens', {
        ...fieldsIdAndName(DataTypes),
        config_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'config_id',
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'alias',
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'project_id',
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'group_id',
        },
        is_lock: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'is_lock'
        },
        screen_release_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'screen_release_id'
        },
        share_hash: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'share_hash',
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'thumbnail',
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        dateStrings: true,
        freezeTableName: true,
        timestamps: false
    })
}
