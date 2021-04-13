/* Created by tommyZZM.OSX on 2020/3/25. */
import {fieldsCreatedAt, fieldsCreatedAtAndUpdatedAt, fieldsId, fieldsIdAndName} from "../utils/share-fields";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('component_versions', {
        ...fieldsId(DataTypes),
        component_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'component_id'
        },
        version: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'version'
        },
        package_json: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'package_json'
        },
        raw: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'raw_url'
        },
        ...fieldsCreatedAt(DataTypes)
    });
}
