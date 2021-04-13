/* Created by tommyZZM.OSX on 2020/1/17. */
"use strict";
module.exports = function (api) {
    api.cache(true);
    return {
        "presets": [
            ["@babel/preset-env", {
                "modules": false
            }],
            "@babel/preset-react",
            "@babel/preset-typescript"
        ],
        "plugins": [
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-transform-runtime",
            "@babel/plugin-transform-modules-commonjs",
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-proposal-export-default-from",
            "@babel/plugin-proposal-optional-chaining",
            "@babel/plugin-proposal-nullish-coalescing-operator",
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ["@babel/plugin-proposal-class-properties", { "loose" : true }],
            ["import", { "libraryName": "antd", "style": true }]
        ]
    }
}
