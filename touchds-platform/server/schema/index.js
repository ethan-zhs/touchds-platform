
/* Created by tommyZZM.OSX on 2020/3/26. */
"use strict";
const R = require('ramda');
const { schemaKeyToTable } = require('./schema');
const { createRefsInitial } = require('./refs')
const { camelCase } = require('change-case')

// const prefix = 'schema';

for (const [key, pair] of R.toPairs(schemaKeyToTable)) {
    const [_, getTable] = pair;
    exports[camelCase(`${key}`)] = getTable();
}

const getMappingRefs = createRefsInitial();

exports.getMappingRefs = getMappingRefs;
