import * as R from 'ramda';

import * as Utils from '../../../utils/utils';
import * as layerUtils from '../../../utils/layerUtils';

/**
 *  调整图层层级
 *  @param {object} layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function changeLayerZIndex(layerList: any, data: any) {
    const isDown = R.contains(data.moveType)(['down', 'step_down']);
    const isReverse = R.contains(data.moveType)(['up', 'step_down']);

    const opLayers = isReverse ? R.reverse(data.opLayers) : data.opLayers;

    opLayers.forEach((id: string) => {
        let opLayer: any;           // 移动图层对象
        let opIndex = 0;            // 目标图层下标
        let opArr: any;             // 目标图层数组
        let targetLayer: any;       // 目标图层对象

        layerUtils.loopLayerList(layerList, id, (startData: any) => {
            const { item, index, arr } = startData;
            const _next = index < arr.length - 1 ? index + 1 : index;
            const _prev = index > 0 ? index - 1 : 0;

            const targetObj: any = {
                step_down: arr[_next],
                step_up: arr[_prev],
                down: R.last(arr),
                up: R.head(arr)
            };
            opIndex = index;
            opArr = arr;
            opLayer = item;
            targetLayer = targetObj[data.moveType];
        });

        // 移动图层不等于目标图层时开始移动
        if (opLayer.id !== targetLayer.id) {
            let targetIndex = 0;
            let targetArr: any;

            // 删除移动图层
            opArr.splice(opIndex, 1);

            layerUtils.loopLayerList(layerList, targetLayer.id, (endData: any) => {
                targetIndex = endData.index;
                targetArr = endData.arr;
            });

            // 移动图层插入到目标图层对应位置, 向下移动插入下方， 向上移动插入上方
            targetIndex = isDown ? targetIndex + 1 : targetIndex;
            targetArr.splice(targetIndex, 0, opLayer);
        }
    });
    return layerList;
}

/**
 *  拖拽调整图层层级 / 分组
 *  @param {number} layerList - 图层树
 *  @param {number} data - 操作数据对象
 *
 */
const handleDropLayer = (layerList: any, data: any) => {
    const { dropToGap, opLayers, dropLayer, dropPosition, dropInGroup } = data;

    const idList = dropPosition === 1 ? opLayers.slice().reverse() : opLayers;

    let dropLayerId = dropLayer.id;
    let dragEnable = true;

    idList.forEach((id: string) => {
        layerUtils.loopLayerList(layerList, id, (cbData: any) => {
            const { item, arr } = cbData;

            // 释放位置在已选或拖动中图层上下
            if (id === dropLayerId) {
                // 筛选掉其他被选图层
                const tempArr = arr.filter((c: any) => !idList.includes(c.id) || id === c.id);
                const tempIndex = tempArr.indexOf(item);
                // 拖拽到上方时，是否第一位
                const isFirst = dropPosition === 1 && tempIndex === 0;
                // 拖拽到下方时，是否最后一位
                const isLast = dropPosition === 0 && tempIndex === tempArr.length - 1;
                if (idList.length === 1 || isFirst || isLast) {
                    dragEnable = false;
                } else {
                    // 如果图层在最后，不可移动位置
                    dropLayerId = dropPosition === 1 ? tempArr[tempIndex - 1].id : tempArr[tempIndex + 1].id;
                }
            }
        });

        if (dragEnable) {
            // 先删除被拖动图层
            let dragObj: any;
            layerUtils.loopLayerList(layerList, id, (cbData: any) => {
                const { item, index, arr } = cbData;
                dragObj = item;
                arr.splice(index, 1);
            });

            // 拖动到组之上, 或者拖动到展开的组下方间隙时
            if (!dropToGap || dropInGroup) {
                layerUtils.loopLayerList(layerList, dropLayerId, (cbData: any) => {
                    const { item } = cbData;
                    item.list = item.list || [];
                    item.list.unshift(dragObj);
                });
            }
            else {  // 拖动到普通间隙
                let targetArr: any;
                let dropIndex: any;
                layerUtils.loopLayerList(layerList, dropLayerId, (cbData: any) => {
                    const { index, arr } = cbData;
                    targetArr = arr;
                    dropIndex = index;
                });
                if (dropPosition === 1) {
                    targetArr.splice(dropIndex + 1, 0, dragObj);
                } else {
                    targetArr.splice(dropIndex, 0, dragObj);
                }
            }
        }
    });

    return layerUtils.removeEmptyGroup(layerList);
};

/**
 *  删除图层
 *  @param {array}  layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function deleteLayer(layerList: any, data: any) {
    data.opLayers.forEach((id: string) => {
        layerUtils.loopLayerList(layerList, id, (cbData: any) => {
            const { index, arr } = cbData;
            arr.splice(index, 1);
        });
    });

    // 当删除元素后,父层组为空,移除空组
    layerList = layerUtils.removeEmptyGroup(layerList);

    return layerList;
}

/**
 *  修改组展开 / 合起
 *  @param {array}  layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function toggleFolder(layerList: any, data: any) {
    layerUtils.loopLayerList(layerList, data.layerId, (cbData: any) => {
        cbData.item.open = !cbData.item.open;
    });

    return layerList;
}

/**
 *  成组
 *  @param {array}  layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function setGroup(layerList: any, data: any) {
    // 获得操作图层中的第一个图层
    const firstLayer = data.opLayers[0];

    layerUtils.loopLayerList(layerList, firstLayer, (cbData: any) => {
        const { index, arr } = cbData;
        // 筛选出操作图层对象列表
        const opArr = arr.filter((opItem: any) => data.opLayers.includes(opItem.id));

        // 创建分组
        const newGroup = {
            id: data.groupId,
            type: 'group',
            list: [...opArr]    // 插入需要成组的图层
        };

        // 删除需要成组的元素
        opArr.forEach((item: any) => {
            arr.splice(arr.indexOf(item), 1);
        });

        // 将新组添加到第一个元素下标的前面
        arr.splice(index, 0, newGroup);
    });

    return layerList;
}

/**
 *  取消成组
 *  @param {array}  layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function cancelGroup(layerList: any, data: any) {
    data.opLayers.forEach((id: string) => {
        layerUtils.loopLayerList(layerList, id, (cbData: any) => {
            const { item, index, arr } = cbData;
            const childrenList = R.reverse(item.list);

            arr.splice(index, 1);
            childrenList.forEach((c: any) => {
                arr.splice(index, 0, c);
            });
        });
    });

    return layerList;
}

/**
 *  拷贝图层
 *  @param {array} layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function copyLayer(layerList: any, data: any) {
    const newLayer = Utils.copyObject(data.newLayer);

    // 获取被拷贝元素中第一个元素的位置
    let index = 0;
    let ar: any;
    layerUtils.loopLayerList(layerList, data.posId, (cbData: any) => {
        index = cbData.index;
        ar = cbData.arr;
    });

    // 递归删除oldId
    (function f(layer: any) {
        delete layer.oldId;

        if (layer.list && layer.list.length) {
            layer.list.forEach((item: any) => {
                f(item);
            });
        }
    })(newLayer);

    ar.splice(index, 0, newLayer);

    return layerList;
}

/**
 *  操作图层树
 *  @param {object} config - config对象
 *  @param {object} data - 操作数据对象
 *
 */
export default function layersOp(config: any, data: any) {
    const configObj = Utils.copyObject(config);
    const { layerList } = configObj;

    switch (data.opType) {
        case 'zIndex': configObj.layerList = changeLayerZIndex(layerList, data); break;
        case 'toggleFolder': configObj.layerList = toggleFolder(layerList, data); break;
        case 'delete': configObj.layerList = deleteLayer(layerList, data); break;
        case 'setGroup': configObj.layerList = setGroup(layerList, data); break;
        case 'cancelGroup': configObj.layerList = cancelGroup(layerList, data); break;
        case 'copy': configObj.layerList = copyLayer(layerList, data); break;
        case 'drop': configObj.layerList = handleDropLayer(layerList, data); break;
        default: break;
    }

    return configObj;
}
