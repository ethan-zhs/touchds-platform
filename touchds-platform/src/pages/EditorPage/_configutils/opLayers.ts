import * as R from 'ramda';
import * as Utils from '@utils/utils';
import * as layerUtils from '@utils/layerUtils';

/**
 *  拖拽移动图层
 *  @param {object} layers - 图层对象
 *  @param {object} layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function dragMoveLayer(layers: any, layerList: any, data: any) {
    data.opLayers.forEach((id: any) => {
        const list = layerUtils.layerToList(layerList);
        const childList = layerUtils.getChildrenLayerById(list, id) || [];
        const layerArr = [{ id }, ...childList];

        layerArr.forEach((item: any) => {
            const currLayer = layers[item.id];

            if (!currLayer) {
                return null;
            }

            switch (data.type) {
                case 'adjust':
                    currLayer.attr.oldX = currLayer.attr.oldX || currLayer.attr.x;
                    currLayer.attr.oldY = currLayer.attr.oldY || currLayer.attr.y;

                    currLayer.attr.x = currLayer.attr.oldX + data.x;
                    currLayer.attr.y = currLayer.attr.oldY + data.y;
                    break;
                case 'end':
                    delete currLayer.attr.oldX;
                    delete currLayer.attr.oldY;
                    break;
                default: break;
            }
        });
    });

    data.type === 'end' && adjustGroupSize(layers, layerList);

    return layers;
}

/**
 *  移动图层
 *  @param {object} layers - 图层对象
 *  @param {object} layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function moveLayer(layers: any, layerList: any, data: any) {
    data.opLayers.forEach((id: any) => {
        (function f(layerId: string) {
            layerUtils.loopLayerList(layerList, layerId, (cbData: any) => {
                const { item } = cbData;
                if (item.list && item.list.length) {
                    item.list.forEach((c: any) => { f(c.id); });
                }
                layers[layerId].attr.x = layers[layerId].attr.x + data.x;
                layers[layerId].attr.y = layers[layerId].attr.y + data.y;
            });
        })(id);
    });

    adjustGroupSize(layers, layerList);

    return layers;
}

/**
 *  修改图层位置
 *  @param {object} layers - 图层对象
 *  @param {object} layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function changeLayerPos(layers: any, layerList: any, data: any) {
    const currLayer = layers[data.layerId];

    (function f(layerId: string) {
        layerUtils.loopLayerList(layerList, layerId, (cbData: any) => {
            const { item } = cbData;
            if (item.list && item.list.length) {
                item.list.forEach((c: any) => { f(c.id); });
            }
            layers[layerId].attr.x = layers[layerId].attr.x + (data.x - currLayer.attr.x);
            layers[layerId].attr.y = layers[layerId].attr.y + (data.y - currLayer.attr.y);
        });
    })(data.layerId);

    return layers;
}

/**
 *  修改图层旋转角度
 *  @param {object} layers - 图层对象
 *  @param {object} layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function changeLayerAngle(layers: any, layerList: any, data: any) {
    data.opLayers.map((id: any) => {
        const currLayer = layers[id];
        switch (data.type) {
            case 'start':
                // 记录原来的角度
                currLayer.attr.oldDeg = currLayer.attr.deg;
                break;
            case 'adjust':
                // 根据旋转角度，动态调整图层角度
                const angle = currLayer.attr.oldDeg + data.deg;
                currLayer.attr.deg = angle >= 360 ? angle % 360 : angle;
                break;
            case 'end':
                if (currLayer.type === 'group') {
                    (function f(layerId: string) {
                        layerUtils.loopLayerList(layerList, layerId, (cbData: any) => {
                            const { item } = cbData;
                            if (item.list && item.list.length) {
                                item.list.forEach((c: any) => { f(c.id); });
                                // 组的旋转角度设为0
                                layers[item.id].attr.deg = 0;
                            } else {
                                // 子层的旋转角度全部设成父层所旋转的角度
                                const degMinus = currLayer.attr.deg - currLayer.attr.oldDeg;
                                const deg = layers[item.id].attr.deg + degMinus;
                                layers[item.id].attr.deg = deg >= 360 ? deg % 360 : deg;
                            }
                        });
                    })(id);
                }
                // 删除预设的原角度属性
                delete currLayer.attr.oldDeg;
                break;
            case 'assign':
                if (R.has('deg', data)) {
                    currLayer.attr.deg = data.deg;
                }
                break;
            default: break;
        }
    });
    return layers;
}

/**
 *  拖拽修改图层大小
 *  @param {object} layers - 图层对象
 *  @param {object} layerList - 图层树
 *  @param {object} screenConfig - 大屏页面配置
 *  @param {object} data - 操作数据对象
 *
 */
function changeLayerDragSize(layers: any, layerList: any, screenConfig: any, data: any) {
    const list = layerUtils.layerToList(layerList);

    data.opLayers.map((id: any) => {
        const currLayer = layers[id];
        const childList = layerUtils.getChildrenLayerById(list, id) || [];

        switch (data.type) {
            case 'start':
                currLayer.attr.oldW = currLayer.attr.w;
                currLayer.attr.oldH = currLayer.attr.h;
                currLayer.attr.oldY = currLayer.attr.y;
                currLayer.attr.oldX = currLayer.attr.x;
                break;
            case 'adjust':
                let w: number = currLayer.attr.w;
                let h: number = currLayer.attr.h;
                let x: number = currLayer.attr.x;
                let y: number = currLayer.attr.y;

                // 根据旋转角度，动态调整图层角度
                if (data.dragType.includes('top')) {
                    h = currLayer.attr.oldH - data.y;
                    y = currLayer.attr.oldY + data.y;
                    childList.forEach((item: any) => {
                        const layerAttr = layers[item.id].attr;
                        layerAttr.oldY = layerAttr.oldY || layerAttr.y;
                        layerAttr.y = layerAttr.oldY + data.y;
                    });
                }

                if (data.dragType.includes('bottom')) {
                    h = currLayer.attr.oldH + data.y;
                }

                if (data.dragType.includes('left')) {
                    w = currLayer.attr.oldW - data.x;
                    x = currLayer.attr.oldX + data.x;
                    childList.forEach((item: any) => {
                        const layerAttr = layers[item.id].attr;
                        layerAttr.oldX = layerAttr.oldX || layerAttr.x;
                        layerAttr.x = layerAttr.oldX + data.x;
                    });
                }

                if (data.dragType.includes('right')) {
                    w = currLayer.attr.oldW + data.x;
                }

                currLayer.attr.w = w <= screenConfig.grid ? screenConfig.grid : w;
                currLayer.attr.h = h <= screenConfig.grid ? screenConfig.grid : h;
                currLayer.attr.x = x;
                currLayer.attr.y = y;
                break;
            case 'end':
                const ratew = currLayer.attr.w / currLayer.attr.oldW;
                const rateh = currLayer.attr.h / currLayer.attr.oldH;

                childList.forEach((item: any) => {
                    const layerAttr = layers[item.id].attr;
                    layerAttr.w = Math.round(ratew * layerAttr.w);
                    layerAttr.h = Math.round(rateh * layerAttr.h);
                    layerAttr.x = Math.round(ratew * (layerAttr.x - currLayer.attr.x) + currLayer.attr.x);
                    layerAttr.y = Math.round(rateh * (layerAttr.y - currLayer.attr.y) + currLayer.attr.y);
                    delete layerAttr.oldX;
                    delete layerAttr.oldY;
                });

                // 删除预设的w,h,x,y
                delete currLayer.attr.oldW;
                delete currLayer.attr.oldH;
                delete currLayer.attr.oldY;
                delete currLayer.attr.oldX;
                break;
            default: break;
        }
    });

    data.type === 'end' && adjustGroupSize(layers, layerList);

    return layers;
}

/**
 *  修改图层大小
 *  @param {object} layers - 图层对象
 *  @param {object} layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function changeLayerSize(layers: any, layerList: any, data: any) {
    data.opLayers.forEach((id: string) => {
        const currLayer = layers[id];

        (function f(layerId: string) {
            layerUtils.loopLayerList(layerList, layerId, (cbData: any) => {
                const { item } = cbData;
                // 如果是组，递归遍历修改组内子元素的大小和定位
                if (item.list && item.list.length) {
                    item.list.forEach((c: any) => { f(c.id); });
                }
                const ratew = data.w / currLayer.attr.w;
                const rateh = data.h / currLayer.attr.h;
                const layerAttr = layers[item.id].attr;

                layerAttr.w = Math.round(ratew * layerAttr.w);
                layerAttr.h = Math.round(rateh * layerAttr.h);
                layerAttr.x = Math.round(ratew * (layerAttr.x - currLayer.attr.x) + currLayer.attr.x);
                layerAttr.y = Math.round(rateh * (layerAttr.y - currLayer.attr.y) + currLayer.attr.y);
            });
        })(id);
    });

    return layers;
}

/**
 *  删除图层
 *  @param {object} layers - 图层对象
 *  @param {object} layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function deleteLayer(layers: any, layerList: any, data: any) {
    // 递归删除图层
    (function f(idList = []) {
        idList.forEach((id: string) => {
            layerUtils.loopLayerList(layerList, id, (item: any) => {
                if (item.list && item.list.length) {
                    const childIdList = item.list.map((c: any) => c.id);
                    f(childIdList);
                }
                delete layers[id];
            });
        });
    })(data.opLayers);

    // 删除图层后调整分组的大小
    adjustGroupSize(layers, layerList);

    return layers;
}

/**
 *  修改图层显示 / 隐藏
 *  @param {object} layers - 图层对象
 *  @param {object} data - 操作数据对象
 *
 */
function changeLayerAttr(layers: any, data: any) {

    data.opLayers.map((id: any) => {
        const currLayer = layers[id];
        currLayer.attr = {
            ...currLayer.attr,
            ...data.value
        };
    });
    return layers;
}

/**
 *  修改图层别名
 *  @param {object} layers - 图层对象
 *  @param {object} data - 操作数据对象
 *
 */
function changeLayerAlias(layers: any, data: any) {
    data.opLayers.map((id: any) => {
        const currLayer = layers[id];
        currLayer.alias = data.val;
    });
    return layers;
}

/**
 *  调整组大小
 *  @param {object} layers - 图层对象
 *  @param {object} layerList - 图层树
 *
 */
function adjustGroupSize(layers: any, layerList: any) {

    layerList.forEach((layerItem: any) => {
        if (layerItem.list && layerItem.list.length) {
            const idList = layerItem.list.map((c: any) => c.id);

            adjustGroupSize(layers, layerItem.list);
            changeGroupSize(layers, layerItem.id, idList);
        }
    });

    return layers;
}

/**
 *  修改组大小
 *  @param {object} layers - 图层对象
 *  @param {string} groupId - 组id
 *  @param {Array<string>} idList - 组内子层id列表
 *
 */
function changeGroupSize(layers: any, groupId: string, idList: Array<string>) {

    // 获得子图层大小和位置属性数组
    const arr = idList.filter((id: string) => layers[id] !== undefined)
                .map((id: string) => ({ ...layers[id].attr }));

    if (layers[groupId]) {
        // 计算最小顶点，和最大顶点
        const minX = Math.min.apply(this, arr.map((item: any) => item.x));
        const minY = Math.min.apply(this, arr.map((item: any) => item.y));
        const maxX = Math.max.apply(this, arr.map((item: any) => item.x + item.w));
        const maxY = Math.max.apply(this, arr.map((item: any) => item.y + item.h));

        // 设置新组的位置大小属性
        layers[groupId].attr.x = minX;
        layers[groupId].attr.y = minY;
        layers[groupId].attr.w = maxX - minX;
        layers[groupId].attr.h = maxY - minY;
    }
}

/**
 *  设置成组
 *  @param {object} layers - 图层对象
 *  @param {object} data - 操作数据对象
 *
 */
function setGroup(layers: any, data: any) {
    layers[data.groupId] = {
        attr: {
            x: 200,
            y: 100,
            w: 300,
            h: 80,
            deg: 0,
            opacity: 1,
            sizeLock: false,
            lock: false,
            visible: true,
            flipH: false,
            flipV: false
        },
        id: data.groupId,
        type: 'group',
        comName: 'datat-layer',
        children: [],
        alias: '组',
        parent: ''
    };

    changeGroupSize(layers, data.groupId, data.opLayers);

    // 修改组内图层位置属性
    data.opLayers.forEach((id: any) => {
        const currLayer = layers[id];
        currLayer.parentId = data.groupId;
    });

    return layers;
}

/**
 *  取消成组
 *  @param {object} layers - 图层对象
 *  @param {object} layerList - 图层树
 *  @param {object} data - 操作数据对象
 *
 */
function cancelGroup(layers: any, layerList: any, data: any) {
    data.opLayers.forEach((id: string) => {
        layerUtils.loopLayerList(layerList, id, (cbData: any) => {
            const { item } = cbData;

            if (item.list && item.list.length) {
                // 重新设置组内元素的位置属性
                item.list.forEach((c: any) => {
                    const cLayer = layers[c.id];
                    cLayer.parentId = item.parentId;
                });
            }
        });

        delete layers[id];
    });

    return layers;
}

/**
 *  拷贝图层
 *  @param {object} layers - 图层对象
 *  @param {object} data - 操作数据对象
 *
 */
function copyLayer(layers: any, data: any) {
    const { newLayer } = data;

    // 递归拷贝子节点
    const copyLayerObject = (function f(layer: any, id: string) {
        layers[layer.id] = layers[id];

        if (layer.list && layer.list.length) {
            layer.list.forEach((item: any) => {
                f(item, item.oldId);
            });
        }
    });

    copyLayerObject(newLayer, newLayer.oldId);

    return layers;
}

function changeLayerStaticProps(layers: any, data: any) {
    layers[data.layerId].staticProps = data.staticProps;
    return layers;
}

function changeLayerEnvInterfaceProps(layers: any, data: any) {
    layers[data.layerId].envInterfaceProps = data.envInterfaceProps;
    return layers;
}

// function changeConfigDataSources(data: any) {
//     return data.configDataSource;
// }

/**
 *  操作图层对象
 *  @param {object} config - config对象
 *  @param {object} data - 操作数据对象
 *
 */
export default function layersOp(config: any, data: any) {
    const configObj = Utils.copyObject(config);
    const { layers, layerList, screenConfig } = configObj;

    switch (data.opType) {
        case 'attr': configObj.layers = changeLayerAttr(layers, data); break;
        case 'move': configObj.layers = moveLayer(layers, layerList, data); break;
        case 'dragMove': configObj.layers = dragMoveLayer(layers, layerList, data); break;
        case 'pos': configObj.layers = changeLayerPos(layers, layerList, data); break;
        case 'angle': configObj.layers = changeLayerAngle(layers, layerList, data); break;
        case 'size': configObj.layers = changeLayerSize(layers, layerList, data); break;
        case 'dragSize': configObj.layers = changeLayerDragSize(layers, layerList, screenConfig, data); break;
        case 'alias': configObj.layers = changeLayerAlias(layers, data); break;
        case 'delete': configObj.layers = deleteLayer(layers, layerList, data); break;
        case 'setGroup': configObj.layers = setGroup(layers, data); break;
        case 'cancelGroup': configObj.layers = cancelGroup(layers, layerList, data); break;
        case 'changeGroupSize': configObj.layers = adjustGroupSize(layers, layerList); break;
        case 'copy': configObj.layers = copyLayer(layers, data); break;
        case 'staticProps': configObj.layers = changeLayerStaticProps(layers, data); break;
        case 'envInterfaceProps': configObj.layers = changeLayerEnvInterfaceProps(layers, data); break;
        default: break;
    }

    return configObj;
}
