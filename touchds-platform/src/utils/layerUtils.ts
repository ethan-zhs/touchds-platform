import * as Utils from './utils';

/**
 *  [图层树转换成数组]
 *
 *  @param {array}  list - 图层树
 *  @param {number} parentId - 父级Id
 *  @param {number} level - 层级
 *
 */
const layerToList = (list: any, parentId?: number, level?: number) => {
    let layerList: any = [];
    list.forEach((item: any) => {
        const layerItem = Utils.copyObject(item);
        layerItem.parentId = parentId ? parentId : '0';
        layerItem.level = level ? level : 0;

        if (item.type === 'group') {
            layerItem.open = item.open || false;
        }
        layerList.push(layerItem);
        if (layerItem.list && layerItem.list.length) {
            const childrenList = layerToList(layerItem.list, layerItem.id, layerItem.level + 1);
            layerList = [
                ...layerList,
                ...childrenList
            ];

            delete layerItem.list;
        }
    });

    return layerList;
};

/**
 *  [去掉空组节点]
 *
 *  @param {array} list - 图层树
 *
 */
const removeEmptyGroup = (list: any) => {
    const layerList: any = [];
    list.forEach((item: any) => {
        const layerItem = Utils.copyObject(item);
        if (item.type === 'group') {
            if (layerItem.list && layerItem.list.length) {
                const childrenList = removeEmptyGroup(layerItem.list);

                if (childrenList && childrenList.length) {
                    layerItem.list = childrenList;
                    layerList.push(layerItem);
                }

            }
        } else {
            layerList.push(layerItem);
        }
    });

    return layerList;
};

/**
 *  [图层数组转换成图层树]
 *
 *  @param {array} list - 图层数组
 *
 */
const layerToTree = (list: any) => {
    let layerTree: any = [];

    const mapLayer: any = {};
    list.forEach((item: any) => {
        mapLayer[item.id] = item;
    });

    list.forEach((item: any) => {
        const parent = mapLayer[item.parentId];
        if (parent) {
            (parent.list || (parent.list = [])).push(item);
        } else {
            layerTree.push(item);
        }
    });

    layerTree = removeEmptyGroup(layerTree);

    return layerTree;
};

/**
 *  [获取某个节点的所有子节点]
 *
 *  @param {array} list - 图层数组
 *  @param {number} id - 节点id
 *
 */
const getChildrenLayerById = (list: Array<any>, id: string) => {
    let childrenList: any = list.filter((item: any) => item.parentId === id) || [];

    if (childrenList.length) {
        childrenList.forEach((item: any) => {
            const childrenListTemp = getChildrenLayerById(list, item.id);
            childrenList = [...childrenList, ...childrenListTemp];
        });
    }

    return childrenList;
};

/**
 *  获取某个节点的所有子节点Id
 *  @param {array} layerList - 图层数组
 *  @param {number} id - 节点id
 *
 */
const getChildrenIdById = (layerList: Array<any>, id: string) => {
    const idList: Array<string> = [];
    (function f(layerId) {
        loopLayerList(layerList, layerId, (cbData: any) => {
            const { item } = cbData;
            if (item.list && item.list.length) {
                item.list.forEach((c: any) => {
                    f(c.id);
                    idList.push(c.id);
                });
            }
        });
    })(id);

    return idList;
};

/**
 *  获取图层顶层父级图层id
 *  @param {array} list - 图层数组
 *  @param {number} id - 节点id
 *
 */
const getTopParentLayer = (list: Array<any>, id: string) => {
    const currLayer = list.find((item: any) => item.id === id);
    if (currLayer.parentId !== '0') {
        const parentLayer = list.find((item: any) => item.id === currLayer.parentId);
        id = getTopParentLayer(list, parentLayer.id);
    }

    return id;
};

/**
 *  递归获取单个图层树节点信息
 *  @param {array} layerList - 图层树
 *  @param {number} id - 节点图层id
 *  @param {function} callback - 找到节点后的回调函数
 *
 */
const loopLayerList = (layerList: any, id: string, callback: any) => {
    layerList.forEach((item: any, index: number, arr: any) => {
        if (item.id === id) {
            return callback({item, index, arr});
        }
        if (item.list) {
            return loopLayerList(item.list, id, callback);
        }
    });
};

/**
 *  获取所选图层的最大层级和子层级差
 *  @param {array} layerList - 图层数组
 *  @param {number} id - 节点id
 *
 */
const getMaxLevel = (layerList: Array<any>, id: string) => {
    const list: any = layerToList(layerList);
    const currLayer = list.find((item: any) => item.id === id);

    // 最大层级
    let maxLevel = 0;
    // 层级差
    let levelMinus = 0;

    if (currLayer) {
        if (currLayer.type === 'group') {
            // 寻找组内最大层级的元素
            const childList = getChildrenLayerById(list, id);
            const levelList = childList.map((item: any) => item.level);
            maxLevel = Math.max.apply(null, levelList);
        } else {
            maxLevel = currLayer.level;
        }

        levelMinus = maxLevel - currLayer.level;
    }

    return {
        maxLevel,
        levelMinus
    };
};

/**
 *  判断是否可以成组
 *  @param {array} layerList - 图层树
 *  @param {Array<string>} idList - 选中图层列表
 *
 */
const canSetGroup = (layerList: any, idList: Array<string>) => {
    return idList.every((id: string) => {
        if (getMaxLevel(layerList, id).maxLevel < 2) {
            return true;
        }
    });
};

/**
 *  对选择的图层进行排序整理
 *  @param {array} layerList - 图层树
 *  @param {Array<string>} idList - 图层id列表
 *
 */
const sortSelectedLayer = (layerList: any, idList: Array<string>) => {
    loopLayerList(layerList, idList[0], (cbData: any) => {
        const { arr } = cbData;
        const selectedLayers = arr.filter((item: any) => idList.includes(item.id));
        idList = selectedLayers.map((item: any) => item.id);
    });

    return idList;
};

/**
 *  获得递归拷贝图层
 *  @param {array} layerList - 图层树
 *  @param {string} id - 被拷贝图层id
 *
 */
const getCopyLayerNode = (layerList: any, id: string) => {
    let newLayerNode: any;
    loopLayerList(layerList, id, (cbData2: any) => {

        // 拷贝图层树节点
        newLayerNode = Utils.copyObject(cbData2.item);

        // 递归拷贝子节点
        const copyLayerObject = (function f(list: any, parentId?: string) {
            list.forEach((listItem: any) => {
                // 统一设置拷贝后的id
                const layerId = `${listItem.id.split('_')[0]}_${Utils.randomHash(5)}`;

                listItem.oldId = listItem.id;
                listItem.id = layerId;
                if (parentId) {
                    listItem.parentId = parentId;
                }
                if (listItem.list && listItem.list.length) {
                    f(listItem.list, layerId);
                }
            });
        });

        copyLayerObject([newLayerNode]);
    });

    return newLayerNode;
};

/**
 *  获取接近参考线时的图层移动变化位置
 *  @param {object} options - 配置项
 *
 */
const getLineCloseMovePos = (options: any) => {
    const { lines, currLayer, gapSize } = options;
    const { moveX, moveY } = options;
    const { x, y, w, h, oldX, oldY } = currLayer.attr;

    const [ x1, y1, ox1, oy1 ] = [x, y, oldX, oldY];
    const [ x2, y2, ox2, oy2 ] = [x + w, y + h, oldX + w, oldY + h];

    function getMoveAxis(type: string) {
        const AXIS_NUM: any = {
            v: [y1, y2, Math.round((y2 + y1) / 2), oy1, oy2, Math.round((oy2 + oy1) / 2), moveY],
            h: [x1, x2, Math.round((x2 + x1) / 2), ox1, ox2, Math.round((ox2 + ox1) / 2), moveX]
        };
        const [axis1, axis2, axisc, oAxis1, oAxis2, oAxisc, currMoveAxis] = AXIS_NUM[type];
        const moveDir = oAxis1 + currMoveAxis - axis1;
        const lineType = lines[type] || [];
        if (lineType.length === 0) {
            return currMoveAxis;
        }
        const lineList = lineType.filter((l: number) => l === axis1 || l === axis2 || l === axisc);

        let moveAxis = currMoveAxis;

        if (lineList && lineList.length) {
            const line = lineList[0];
            switch (true) {
                // 前框线贴在参考线时
                case line === axis1:
                    if (Math.abs(line - (oAxis1 + moveAxis)) <= gapSize) {
                        moveAxis = line - oAxis1;
                    }
                    break;

                // 后框线贴在参考线时
                case line === axis2:
                    if (Math.abs(line - (oAxis2 + moveAxis)) <= gapSize) {
                        moveAxis = line - oAxis2;
                    }
                    break;

                // 中线贴在参考线时
                case line === axisc:
                    if (Math.abs(line - (oAxisc + moveAxis)) <= gapSize) {
                        moveAxis = line - oAxisc;
                    }
                    break;
            }
        } else {
            lines[type].forEach((line: number) => {
                switch (true) {
                    // 前框线贴近参考线时
                    case Math.abs(line - axis1) <= gapSize:
                        if (moveDir * (line - axis1) > 0) {
                            moveAxis = line - oAxis1;
                        }
                        break;

                    // 后框线贴近参考线时
                    case Math.abs(line - axis2) <= gapSize:
                        if (moveDir * (line - axis2) > 0) {
                            moveAxis = line - oAxis2;
                        }
                        break;

                    // 中线贴近参考线时
                    case Math.abs(line - axisc) <= gapSize:
                        if (moveDir * (line - axisc) > 0) {
                            moveAxis = line - oAxisc;
                        }
                        break;
                }
            });
        }

        return moveAxis;
    }

    return {
        moveX: getMoveAxis('h'),
        moveY: getMoveAxis('v')
    };
};

export {
    layerToList,
    removeEmptyGroup,
    layerToTree,
    loopLayerList,
    getChildrenLayerById,
    getChildrenIdById,
    getTopParentLayer,
    getMaxLevel,
    canSetGroup,
    sortSelectedLayer,
    getCopyLayerNode,
    getLineCloseMovePos
};
