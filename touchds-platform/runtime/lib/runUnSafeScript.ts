/* Created by tommyZZM.OSX on 2020/4/22. */
"use strict";
import * as R from 'ramda';

export default function (rawScript: string | Function, argsArray: Array<any> = [], onError: any = () => null): any {
    if (typeof rawScript === 'function') {
        return rawScript(...argsArray);
    }

    const argsArrayPatched = [null, ...argsArray];

    const argsKey = argsArrayPatched.map((_, index) => `$${index}`);

    try {
        // TODO: 此处需要添加限制避免函数访问外部变量
        if (!rawScript) {
            return null;
        }
        const fn = new Function(...argsKey, (`return ${rawScript}(${R.drop(1, argsKey).join(',')})`));
        return fn(...argsArrayPatched)
    } catch (error) {
        // console.error(error)
        onError(error);
        return null;
    }
}
