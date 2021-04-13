/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
import {fieldsCreatedAtAndUpdatedAt, fieldsIdAndName} from "../utils/share-fields";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('users', {
        ...fieldsIdAndName(DataTypes),
        account: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'account',
            comment: '用户账号'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'password',
            comment: '用户密码'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'email',
            comment: '用户邮件'
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        dateStrings: true,
        freezeTableName: true,
        timestamps: false
    })
}
