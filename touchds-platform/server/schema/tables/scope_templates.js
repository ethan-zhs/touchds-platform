/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
import {fieldsCreatedAtAndUpdatedAt, fieldsId} from "../utils/share-fields";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('scope_templates', {
        ...fieldsId(DataTypes),
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id'
        },
        template_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'template_id'
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        dateStrings: true,
        freezeTableName: true,
        timestamps: false
    })
}
