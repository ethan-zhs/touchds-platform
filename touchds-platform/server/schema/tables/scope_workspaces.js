/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
import {fieldsCreatedAtAndUpdatedAt, fieldsIdAndName} from "../utils/share-fields";

// P0
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('scope_workspaces', {
        ...fieldsIdAndName(DataTypes),
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id'
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        dateStrings: true,
        freezeTableName: true,
        timestamps: false
    })
}
