import * as React from 'react';

import NavigatorLine from './NavigatorLine';
import LayerHandler from './LayerHandler';
// import Com from './Com';

import * as layerUtils from '@utils/layerUtils';

const classNames = require('classnames');
import './index.less';

interface IDatatEditorPanelProps {
    percent: number;
    config: any;
    layerAct: any;
    changeLayerAct: any;
    changeLayerConfig: any;
}

class EditorPanel extends React.Component<IDatatEditorPanelProps, any> {
    constructor(props: IDatatEditorPanelProps) {
        super(props);

        this.state = {
            dragStartX: 0,
            dragStartY: 0,
            dragLayer: {},
            dragMoving: false
        };
    }

    componentDidMount() {
        this.keyDownMoveLayer();
    }

    render() {
        const {
            percent,
            config
        } = this.props;

        const { screenConfig = {}, layerList = [] } = config;

        return (
            <div
                className='canvas-panel'
                style={{
                    transform: `scale(${(percent / 100).toFixed(3)}) translate(0px, 0px)`,
                    width: screenConfig.width,
                    height: screenConfig.height
                    // backgroundImage: `url(${screenConfig.backgroundImage})`,
                    // backgroundColor: screenConfig.backgroundColor
                }}
            >
                {layerList.slice().reverse().map((item: any, index: number) => this.renderLayer(item))}
            </div>
        );
    }

    renderCom = (layerItem: any, isSelected: boolean) => {
        const { percent, layerAct, changeLayerConfig, config } = this.props;
        const { layers = {} } = config;
        const currLayer = layers[layerItem.id];

        if (!currLayer) {
            return null;
        }

        const { oldW, oldH, w = 1, h = 1, deg = 0, lock } = currLayer.attr;

        // 当旋转后再拉伸时，保证拉伸边框垂直不变形
        const handlerScaleStyle = oldW ?
            `scale(${oldW / w}, ${oldH / h}) rotate(${deg}deg) scale(${w / oldW}, ${h / oldH})` :
            `rotate(${currLayer.attr.deg}deg)`;

        return (
            <div
                onMouseDown={(e) => this.dragMoveStart(e, layerItem)}
                className={classNames({
                    ['transform-handler']: true,
                    ['hided']: !isSelected || lock
                })}
                style={{
                    transform: handlerScaleStyle,
                    cursor: 'move'
                }}
            >
                {layerItem.type === 'group' ? layerItem.list.slice().reverse().map((item: any, index: number) => (
                    <div key={index} className='slide-item'>
                        {this.renderLayer(item, layerItem.id)}
                    </div>
                )) : (
                    <div className='datat-com'>
                        <div
                            className='datat-wraper'
                            style={{
                                opacity: currLayer.attr.opacity,
                                transform: 'translateZ(0px)'
                            }}
                        />
                    </div>
                )}

                <LayerHandler
                    percent={percent}
                    layerAct={layerAct}
                    layerItem={currLayer}
                    config={config}
                    changeLayerConfig={changeLayerConfig}
                />

                {isSelected && (
                    <div className={'transform-bg'} />
                )}
            </div>
        );
    }

    renderGroup = (layerItem: any, isSelected: boolean) => {
        const { layers = {} } = this.props.config;
        return (
            <div
                className='datat-layer'
                style={{
                    opacity: layers[layerItem.id].attr.opacity
                }}
            >
                {this.renderCom(layerItem, isSelected)}
            </div>
        );
    }

    renderLayer = (currItem: any, parentId?: string) => {
        const { percent, layerAct, config, changeLayerAct } = this.props;
        const { layers = [], layerList = [] } = config;
        const currLayer = layers[currItem.id];

        if (!currLayer) {
            return null;
        }

        const parentLayer = parentId ? layers[parentId] : undefined;

        const { attr = {} } = currLayer;
        const isSelected = layerAct.selected && layerAct.selected.includes(currItem.id);

        // 判断是否选中了组内图层, 选中则hover顶层
        const isChildrenSelect = !parentId && layerAct.selected.some((id: string) => {
            return layerUtils.getChildrenIdById(layerList, currItem.id).includes(id);
        });

        const posX = attr.x - (parentLayer ? parentLayer.attr.x : 0);
        const posY = attr.y - (parentLayer ? parentLayer.attr.y : 0);

        const datatScaleStyle = attr.oldW ? {
            transform: `scale(${attr.w / attr.oldW}, ${attr.h / attr.oldH})`
        } : undefined;

        return (
            <div
                onClick={(e) => {e.stopPropagation(); }}
                onContextMenu={(e) => this.handleLayerMouseUp(e, currItem.id)}
                onMouseOver={(e) => this.mouseOverLayer(e, currItem.id)}
                onMouseOut={() => changeLayerAct({ opType: 'hover', idList: [] })}
                className={classNames({
                    ['datat-transform']: true,
                    ['selected']: isSelected,
                    ['locked']: attr.lock
                })}
                style={{
                    transform: `translate(${posX}px, ${posY}px)`,
                    display: attr.visible ? 'block' : 'none',
                    width: attr.oldW || attr.w,
                    height: attr.oldH || attr.h
                }}
            >
                {isSelected && (
                    <NavigatorLine positionX={attr.x} positionY={attr.y} percent={percent} />
                )}
                <div
                    className={classNames({
                        ['datat-scale']: true,
                        ['hovered']: isChildrenSelect || layerAct.hovered.includes(currItem.id)
                    })}
                    style={datatScaleStyle}
                >
                    {currItem.type === 'group' ?
                        this.renderGroup(currItem, isSelected) :
                        this.renderCom(currItem, isSelected)
                    }
                </div>
            </div>
        );
    }

    mouseOverLayer = (e: any, id: string) => {
        const { config: { layerList }, layerAct: { selected } } = this.props;

        // 自己被选中时，兄弟图层和自己hover不冒泡
        layerUtils.loopLayerList(layerList, id, (cbData: any) => {
            cbData.arr.some((item: any) => selected.includes(item.id)) && e.stopPropagation();
        });

        this.props.changeLayerAct({
            opType: 'hover',
            idList: [id]
        });
    }

    keyDownMoveLayer = () => {
        document.addEventListener('keydown', (e) => {
            const keyCode = window.event ? e.keyCode : e.which;
            const targetElem: any = e.target;

            const { layerAct, config: { screenConfig } } = this.props;
            const { grid = 8 } = screenConfig || {};

            const keyCodeList: any = {
                37: { posType: 'x', xval: -grid, yval: 0 },
                38: { posType: 'y', xval: 0, yval: -grid },
                39: { posType: 'x', xval: grid, yval: 0 },
                40: { posType: 'y', xval: 0, yval: grid }
            };

            // 焦点在input/textarea时, 阻止事件触发移动操作
            if (targetElem && (targetElem.tagName === 'INPUT' || targetElem.tagName === 'TEXTAREA')) {
                return false;
            }

            // 37 left, 38 up, 39 right, 40 down
            if ([37, 38, 39, 40].includes(keyCode) && layerAct.selected && layerAct.selected.length) {
                e.preventDefault();
                const keyObj = keyCodeList[keyCode.toString()];

                this.props.changeLayerConfig({
                    key: 'layers',
                    data: {
                        opType: 'move',
                        opLayers: layerAct.selected,
                        x: keyObj.xval,
                        y: keyObj.yval
                    }
                });
            }
        });
    }

    dragMoveStart = (e: any, item: any) => {
        e.stopPropagation();
        this.setState({
            dragStartX: e.clientX,
            dragStartY: e.clientY,
            dragLayer: item,
            dragMoving: false
        });

        if (e.button !== 2) {
            document.addEventListener('mousemove', this.dragMoveMove);
            document.addEventListener('mouseup', this.dragMoveEnd);
        }
    }

    dragMoveMove = (e: any) => {
        const { dragStartX, dragStartY, dragLayer } = this.state;
        const { layerAct, percent, config: { screenConfig: { grid = 1 }, lines = {}, layers = {} } } = this.props;

        const distanceX = Math.round((e.clientX - dragStartX) * 100 / percent);
        const distanceY = Math.round((e.clientY - dragStartY) * 100 / percent);

        // 确定移动一定距离才设置未移动中
        if (Math.abs(distanceX) >= grid || Math.abs(distanceY) >= grid) {
            const isSelected = layerAct.selected && layerAct.selected.includes(dragLayer.id);
            const showGuideLine = localStorage.getItem('showGuideLine') === '1';
            let moveX = Math.round(distanceX / grid) * grid;
            let moveY = Math.round(distanceY / grid) * grid;

            // 循环遍历选中图层判断是否接近参考线，执行吸附和脱离操作
            showGuideLine && layerAct.selected.some((id: string) => {
                // 自动吸附间隙值
                const gapSize = Math.round(25 * 100 / percent);
                const currLayer = layers[id];

                if (!currLayer) {
                    return false;
                }

                const movePos = layerUtils.getLineCloseMovePos({
                    lines,
                    currLayer,
                    moveX,
                    moveY,
                    gapSize
                });
                // 一旦有需要吸附或者脱离参考线的图层则跳出循环, 防止多个图层数据相互影响
                if (moveX !== movePos.moveX || moveY !== movePos.moveY) {
                    moveX = movePos.moveX;
                    moveY = movePos.moveY;
                    return true;
                }
            });

            // console.log('dragMoveMove', isSelected, moveX, moveY);

            // 有选中图层时
            if (isSelected) {
                this.props.changeLayerConfig({
                    key: 'layers',
                    data: {
                        opType: 'dragMove',
                        type: 'adjust',
                        opLayers: layerAct.selected,
                        x: moveX,
                        y: moveY
                    }
                });
            }

            this.setState({
                dragMoving: true
            });
        }
    }

    dragMoveEnd = (e: any) => {
        const { dragLayer, dragMoving } = this.state;
        const { layerAct: { selected } } = this.props;
        if (!dragMoving) {
            // 非移动点击的时候选中图层
            this.updateLayerSelect(dragLayer.id, e.ctrlKey);
        } else {
            this.props.changeLayerConfig({
                key: 'layers',
                data: {
                    opType: 'dragMove',
                    opLayers: selected,
                    type: 'end'
                }
            });
        }

        document.removeEventListener('mousemove', this.dragMoveMove);
        document.removeEventListener('mouseup', this.dragMoveEnd);
    }

    handleLayerMouseUp = (e: any, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const { layerAct } = this.props;
        const top = e.clientY + 10;
        const left = e.clientX + 12;

        // 当右键未选中的图层时, 重新选中图层
        !layerAct.selected.includes(id) && this.updateLayerSelect(id);
        const timer = setTimeout(() => {
            this.props.changeLayerAct({
                opType: 'contextMenu',
                type: 'show',
                x: left,
                y: top
            });
            clearTimeout(timer);
        }, 150);
        return false;
    }

    updateLayerSelect = (id: string, isCtrl?: boolean) => {
        const { config: { layerList }, layerAct: { selected } } = this.props;
        const list = layerUtils.layerToList(layerList);

        let type = 'replace';

        const selectedArr = list.filter((i: any) => selected.includes(i.id));
        const currLayer = list.find((i: any) => id === i.id);
        const topParentId = layerUtils.getTopParentLayer(list, id);

        if (!currLayer) {
            return false;
        }

        if (selectedArr.length && selectedArr[0].parentId === currLayer.parentId) {
            // 必须在同一层级下才能多选
            if (isCtrl) {
                // 按住ctrl 多选或取消选择
                type = selected.includes(currLayer.id) ? 'delete' : 'add';
            }
        } else {
            // 默认选中点击图层的最顶层父级图层
            id = topParentId;

            // 当选中图层包括父级图层时或者父级相邻图层, 点击子层会选中父级图层
            selected.length && layerUtils.loopLayerList(layerList, selected[0], (cbData: any) => {
                const { arr } = cbData;
                const isSelectChild = arr.some((item: any) => item.id === currLayer.parentId);
                id = isSelectChild ? currLayer.parentId : topParentId;
            });
        }

        this.props.changeLayerAct({
            opType: 'select',
            type,
            id,
            layerList
        });
    }
}

export default EditorPanel;
