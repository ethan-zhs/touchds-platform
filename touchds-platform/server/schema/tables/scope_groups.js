/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
import {fieldsIdAndName, fieldsCreatedAtAndUpdatedAt} from "../utils/share-fields";

// P0
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('screen_groups', {
        ...fieldsIdAndName(DataTypes),
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'project_id',
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        dateStrings: true,
        freezeTableName: true,
        timestamps: false
    })
}
