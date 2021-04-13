import {fieldsCreatedAtAndUpdatedAt, fieldsId} from "../utils/share-fields";

// P0
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('config_of_screens', {
        ...fieldsId(DataTypes),
        json: {
            type: DataTypes.TEXT('long'),
            allowNull: true,
            field: 'config',
            comment: '配置JSON字符串'
        },
        ...fieldsCreatedAtAndUpdatedAt(DataTypes)
    }, {
        dateStrings: true,
        freezeTableName: true,
        timestamps: false
    })

}
