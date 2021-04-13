/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
const moment = require('moment');


export function fieldsCreatedAt(DataTypes) {
    return {
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            get() {
                return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
            },
            field: 'created_at',
            comment: '创建时间'
        },
    }
}

export function fieldsCreatedAtAndUpdatedAt(DataTypes) {
    return {
        ...fieldsCreatedAt(DataTypes),
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            get() {
                return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
            },
            field: 'updated_at',
            comment: '创建时间'
        }
    }
}

export function fieldsId(DataTypes) {
    return {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field: 'id'
        },
    }
}

export function fieldsIdAndName(DataTypes) {
    return {
        ...fieldsId(DataTypes),
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
}
