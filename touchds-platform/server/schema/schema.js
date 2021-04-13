/* Created by tommyZZM.OSX on 2020/3/25. */
"use strict";
const db = require('../config/db')
const R = require('ramda')
const fs = require('fs')
const path = require('path')
const { camelCase } = require('change-case')

const schemaFilePaths = fs.readdirSync(path.join(__dirname, './tables'))

const schemaKeyToTable = schemaFilePaths.reduce((result, filePath) => {
    const fileName = R.dropLast(1, path.basename(filePath).split(".")).join("_");
    const key = camelCase(`${fileName}`);
    const getTable = () => db.sequelize.import(path.join("./tables", filePath));

    return {
        ...result,
        [key]: [key, getTable]
    }
}, {})

exports.schemaKeyToTable = schemaKeyToTable;

exports.asyncSchemaSync = async () => Promise.all(R.toPairs(schemaKeyToTable).map(([key, pair]) => {
    const [_, getTable] = pair;
    return getTable().sync();
    // return getTable().sync({ force: false });
}));
