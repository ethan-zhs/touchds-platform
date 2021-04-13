import * as Utils from '../../../utils/utils';

/**
 *  修改全局色彩
 *  @param {object} preset - 修改预设对象配置
 *  @param {object} data - 操作数据对象
 *
 */
function changeFlat(preset: any, data: any) {
    const flat = !preset.flat || !preset.flat.length ? [] : preset.flat;
    flat.unshift(data.value);

    // 最多不超过18个
    flat.length > 18 && flat.pop();
    preset.flat = flat;
    return preset;
}

/**
 *  操作预设配置
 *  @param {object} config - config对象
 *  @param {object} data - 操作数据对象
 */
export default function presetOp(config: any, data: any) {
    const configObj = Utils.copyObject(config);
    const { preset } = configObj;

    switch (data.opType) {
        case 'flat': configObj.preset = changeFlat(preset, data); break;
        default: break;
    }

    return configObj;
}
