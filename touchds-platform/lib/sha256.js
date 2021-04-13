/* Created by tommyZZM.OSX on 2020/1/21. */
"use strict";
const crypto = require("crypto")

module.exports = function(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}
