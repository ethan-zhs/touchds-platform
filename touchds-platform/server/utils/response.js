/* Created by tommyZZM.OSX on 2020/4/28. */
"use strict";

exports.response200Ok = function (ctx, data) {
    ctx.response.status = 200;
    ctx.body = {
        code: 200,
        message: 'success',
        ...data && { data }
    };
}

exports.response403Forbidden = function (ctx, data) {
    ctx.response.status = 403;
    ctx.body = {
        code: 403,
        message: 'forbidden',
        ...data && { data }
    };
}
