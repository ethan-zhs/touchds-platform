/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
import {fieldsCreatedAtAndUpdatedAt, fieldsIdAndName} from "../utils/share-fields";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('scope_projects', {
        ...fieldsIdAndName(DataTypes),
        workspace_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'workspace_id',
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        dateStrings: true,
        freezeTableName: true,
        timestamps: false
    })
}
