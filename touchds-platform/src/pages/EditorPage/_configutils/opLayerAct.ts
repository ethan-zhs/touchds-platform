import * as Utils from '../../../utils/utils';
import * as layerUtils from '../../../utils/layerUtils';

/**
 *  选中图层
 *  @param {Array<sting>} selected - 选中图层id数组
 *  @param {object} data - 操作数据对象
 *
 */
function selectLayer(selected: Array<any>, data: any) {
    switch (data.type) {
        case 'add':
            selected.push(data.id);
            if (data.layerList) {
                // 对选中图层进行排序调整,避免选择顺序导致图层顺序错误
                selected = layerUtils.sortSelectedLayer(data.layerList, selected);
            }
            break;
        case 'replace': selected = [data.id]; break;
        case 'replaceArr': selected = data.idList; break;
        case 'delete': selected = selected.filter((id: string) => id !== data.id); break;
        case 'clear': selected = []; break;
        default: break;
    }
    return selected;
}

/**
 *  鼠标停留图层
 *  @param {string} hovered - 鼠标停留图层id
 *  @param {object} data - 操作数据对象
 */
function hoverLayer(hovered: Array<string>, data: any) {
    hovered = data.idList ? data.idList : [data.id];
    return hovered;
}

/**
 *  被拷贝图层记录
 *  @param {Array<string>} copied - 被拷贝图层id数组
 *  @param {object} data - 操作数据对象
 */
function copyLayer(copied: Array<any>, data: any) {
    copied = data.idList;
    return copied;
}

/**
 *  修改右键菜单显示 / 隐藏 / 位置
 *  @param {object} contextMenu - 右键菜单对象
 *  @param {object} data - 操作数据对象
 */
function contextMenuChange(contextMenu: any, data: any) {
    switch (data.type) {
        case 'show':
            contextMenu.visible = true;
            contextMenu.x = data.x;
            contextMenu.y = data.y;
            break;
        case 'hide': contextMenu.visible = false; break;
        default: break;
    }
    return contextMenu;
}

/**
 *  修改获得别名输入框焦点的图层Id
 *  @param {object} contextMenu - 右键菜单对象
 *  @param {object} data - 操作数据对象
 */
function changeAliasFocus(focusId: string, data: any) {
    focusId = data.layerId;
    return focusId;
}

/**
 *  操作全局临时行为属性
 *  @param {object} layerAct - 全局行为属性
 *  @param {object} data - 操作数据对象
 */
export default function layerActOp(layerAct: any, data: any) {
    const layerActObj = Utils.copyObject(layerAct);
    const { selected, hovered, copied, contextMenu, focusId } = layerActObj;

    switch (data.opType) {
        case 'select': layerActObj.selected = selectLayer(selected, data); break;
        case 'hover': layerActObj.hovered = hoverLayer(hovered, data); break;
        case 'copy': layerActObj.copied = copyLayer(copied, data); break;
        case 'contextMenu': layerActObj.contextMenu = contextMenuChange(contextMenu, data); break;
        case 'focus': layerActObj.focusId = changeAliasFocus(focusId, data); break;
        default: break;
    }

    return layerActObj;
}
