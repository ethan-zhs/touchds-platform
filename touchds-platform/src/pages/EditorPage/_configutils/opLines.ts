import * as Utils from '../../../utils/utils';

/**
 *  添加参考线
 *  @param {object} lines - 参考线列表
 *  @param {object} data - 操作数据对象
 */
function addLine(lines: any, data: any) {
    let curDirline = lines[data.lineType];

    // 如果存在且是数组则push, 否则直接赋值
    if (curDirline && curDirline.push) {
        curDirline.push(data.pos);
    } else {
        curDirline = [data.pos];
    }

    return lines;
}

/**
 *  删除参考线
 *  @param {object} lines - 参考线列表
 *  @param {object} data - 操作数据对象
 */
function deleteLine(lines: any, data: any) {
    lines[data.lineType].splice(data.index, 1);
    return lines;
}

/**
 *  更新参考线
 *  @param {object} lines - 参考线列表
 *  @param {object} data - 操作数据对象
 */
function updateLine(lines: any, data: any) {
    lines[data.lineType][data.index] = data.pos;
    return lines;
}

/**
 *  操作参考线
 *  @param {object} config - config对象
 *  @param {object} data - 操作数据对象
 */
export default function linesOp(config: any, data: any) {
    const configObj = Utils.copyObject(config);
    const { lines = { v: [], h: [] } } = configObj;

    switch (data.opType) {
        case 'add': configObj.lines = addLine(lines, data); break;
        case 'delete': configObj.lines = deleteLine(lines, data); break;
        case 'update': configObj.lines = updateLine(lines, data); break;
        default: break;
    }

    return configObj;
}
