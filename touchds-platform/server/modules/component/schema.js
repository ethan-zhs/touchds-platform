const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('component', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field: 'id',
            comment: '组件id'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'name',
            comment: '组件名称'
        },
        version: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'version',
            comment: '组件版本'
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'description',
            comment: '组件简介'
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'icon',
            comment: '组件对应图标'
        },
        config: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            field: 'config',
            comment: '组件对应的配置'
        },
        componentUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'component_url',
            comment: '组件对应的加载url'
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            },
            field: 'created_at',
            comment: '创建时间'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            },
            field: 'updated_at'
        },
    }, {
        freezeTableName: true,
        timestamps: false
    })

}