import * as Utils from '../../../utils/utils';

/**
 *  修改大屏封面
 *  @param {object} screenConfig - 大屏页面配置
 *  @param {object} data - 操作数据对象({value: string} - 封面url)
 *
 */
function changeScreenShot(screenConfig: any, data: any) {
    screenConfig.screenShot = data.value;
    return screenConfig;
}

/**
 *  修改大屏背景
 *  @param {object} screenConfig - 大屏页面配置
 *  @param {object} data - 操作数据对象
 *
 */
function changeBackground(screenConfig: any, data: any) {
    if (data.backgroundColor !== undefined) {
        screenConfig.backgroundColor = data.backgroundColor;
    }

    if (data.backgroundImage !== undefined) {
        screenConfig.backgroundImage = data.backgroundImage;
    }
    return screenConfig;
}

/**
 *  修改大屏尺寸
 *  @param {object} screenConfig - 大屏页面配置
 *  @param {object} data - 操作数据对象
 *
 */
function changePageSize(screenConfig: any, data: any) {
    switch (data.type) {
        case 'w': screenConfig.width = data.value; break;
        case 'h': screenConfig.height = data.value; break;
    }
    return screenConfig;
}

/**
 *  修改大屏栅格计算
 *  @param {object} screenConfig - 大屏页面配置
 *  @param {object} data - 操作数据对象
 *
 */
function changePageGrid(screenConfig: any, data: any) {
    screenConfig.grid = data.value;
    return screenConfig;
}

/**
 *  修改大屏适配规则
 *  @param {object} screenConfig - 大屏页面配置
 *  @param {object} data - 操作数据对象
 *
 */
function changePageDisplay(screenConfig: any, data: any) {
    screenConfig.display = data.value || 1;
    return screenConfig;
}

/**
 *  操作大屏页面配置
 *  @param {object} config config对象
 *  @param {object} data   操作数据对象
 */
export default function screenOp(config: any, data: any) {
    const configObj = {
        screenConfig: {},
        ...Utils.copyObject(config)
    };
    const { screenConfig = {} } = configObj;

    switch (data.opType) {
        case 'grid': configObj.screenConfig = changePageGrid(screenConfig, data); break;
        case 'size': configObj.screenConfig = changePageSize(screenConfig, data); break;
        case 'display': configObj.screenConfig = changePageDisplay(screenConfig, data); break;
        case 'background': configObj.screenConfig = changeBackground(screenConfig, data); break;
        case 'screenShot': configObj.screenConfig = changeScreenShot(screenConfig, data); break;
        default: break;
    }

    return configObj;
}
