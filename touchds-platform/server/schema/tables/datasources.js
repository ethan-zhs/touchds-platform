/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
import {fieldsCreatedAtAndUpdatedAt, fieldsIdAndName} from "../utils/share-fields";

const moment = require('moment');

// P1
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('datasources', {
        ...fieldsIdAndName(DataTypes),
        datasource_config: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'datasource_config',
        },
        datasource_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'datasource_type',
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes),
    }, {
        freezeTableName: true,
        timestamps: false
    })
}
