/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
import {fieldsCreatedAtAndUpdatedAt, fieldsIdAndName} from "../utils/share-fields";

const moment = require('moment');

// P1
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('datasource_types', {
        ...fieldsIdAndName(DataTypes),
        alias: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'alias',
        },
        thumbnail: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'thumbnail',
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        freezeTableName: true,
        timestamps: false
    })
}

