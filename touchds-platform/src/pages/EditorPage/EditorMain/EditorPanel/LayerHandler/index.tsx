import * as React from 'react';

import './index.less';
import { HANDLE_LIST } from './enum';

interface IDatatEditorPanelProps {
    percent: number;
    layerItem: any;
    config: any;
    layerAct: any;
    changeLayerConfig: any;
}

class LayerHandler extends React.Component<IDatatEditorPanelProps, any> {
    constructor(props: IDatatEditorPanelProps) {
        super(props);

        this.state = {
            dragStartX: 0,
            dragStartY: 0,
            dragType: '',
            dragStartElem: null
        };
    }

    render() {

        return HANDLE_LIST.map((item: any) => this.renderHandler(item));
    }

    renderHandler = (hl: any) => {
        const { percent, layerItem } = this.props;
        const { oldW, w, oldH, h } = layerItem.attr;

        const angle = hl.deg + layerItem.attr.deg;
        const cursor = this.getCursorData(angle);
        const scaleX = oldW ? (100 / percent) * (oldW / w) : 100 / percent;
        const scaleY = oldH ? (100 / percent) * (oldH / h) : 100 / percent;

        return (
            <i
                className={`${hl.type}-handler`}
                key={hl.type}
            >
                {hl.rotate ? (
                    <span
                        className='rotate-handler'
                        style={{
                            transformOrigin: hl.transformOrigin,
                            transform: `scale(${scaleX}, ${scaleY})`
                        }}
                        onMouseDown={this.dragRotateStart}
                    >
                        <span
                            className='control-point'
                            style={{ cursor }}
                            onMouseDown={(e) => this.dragPointStart(e, hl.type)}
                        />
                    </span>
                ) : (
                    <span
                        className='control-point'
                        onMouseDown={(e) => this.dragPointStart(e, hl.type)}
                        style={{
                            cursor,
                            transform: `scale(${scaleX}, ${scaleY})`
                        }}
                    />
                )}
            </i>
        );
    }

    getCursorData = (angle: number) => {
        const distribute = (angle >= 360 ? 0 : angle) / 22.5;
        let cursor = '';
        switch (true) {
            case distribute <= 1 || distribute > 15: cursor = 'ew-resize'; break;
            case distribute > 1 && distribute <= 3: cursor = 'nwse-resize'; break;
            case distribute > 3 && distribute <= 5: cursor = 'ns-resize'; break;
            case distribute > 5 && distribute <= 7: cursor = 'nesw-resize'; break;
            case distribute > 7 && distribute <= 9: cursor = 'ew-resize'; break;
            case distribute > 9 && distribute <= 11: cursor = 'nwse-resize'; break;
            case distribute > 11 && distribute <= 13: cursor = 'ns-resize'; break;
            case distribute > 13 && distribute <= 15: cursor = 'nesw-resize'; break;
        }

        return cursor;
    }

    /**
     *  拖拽旋转开始
     *  @param {*} e 拖拽对象
     */
    dragRotateStart = (e: any) => {
        e.stopPropagation();

        const { layerAct } = this.props;

        this.setState({
            dragStartX: e.clientX,      // 记录鼠标初始位置X
            dragStartY: e.clientY,      // 记录鼠标初始位置Y
            dragStartElem: e.target
        });

        this.props.changeLayerConfig({
            key: 'layers',
            data: {
                opType: 'angle',
                opLayers: layerAct.selected,
                type: 'start'
            }
        });
        document.addEventListener('mousemove', this.dragRotateMove);
        document.addEventListener('mouseup', this.dragRotateEnd);
    }

    /**
     *  拖拽旋转移动鼠标
     *  @param {*} e 拖拽对象
     */
    dragRotateMove = (e: any) => {
        const { dragStartX, dragStartY } = this.state;
        const { layerAct } = this.props;

        // 获得旋转角度与初始角度的和
        const angle = this.getAngle(dragStartX, dragStartY, e.clientX, e.clientY);

        this.props.changeLayerConfig({
            key: 'layers',
            data: {
                opType: 'angle',
                opLayers: layerAct.selected,
                deg: angle,
                type: 'adjust'
            }
        });
    }

    /**
     *  拖拽旋转结束
     */
    dragRotateEnd = () => {
        const { layerAct } = this.props;
        this.props.changeLayerConfig({
            key: 'layers',
            data: {
                opType: 'angle',
                type: 'end',
                opLayers: layerAct.selected
            }
        });
        document.removeEventListener('mousemove', this.dragRotateMove);
        document.removeEventListener('mouseup', this.dragRotateEnd);
    }

    /**
     *  获得旋转夹角
     *  @param {*} x1 旋转点1
     *  @param {*} y1
     *  @param {*} x2 旋转点2
     *  @param {*} y2
     */
    getAngle = (x1: number, y1: number, x2: number, y2: number) => {
        const {dragStartElem} = this.state;

        // 获取组件的位置信息
        const rect: any = dragStartElem.parentNode.parentNode;
        const { x, y, width, height } = rect.getBoundingClientRect();

        // 中心点
        const cx = x + width / 2;
        const cy = y + height / 2;

        // 2个点之间的角度获取
        let c1 = Math.atan2(y1 - cy, x1 - cx) * 180 / (Math.PI);
        let c2 = Math.atan2(y2 - cy, x2 - cx) * 180 / (Math.PI);
        let angle;
        c1 = c1 <= -90 ? (360 + c1) : c1;
        c2 = c2 <= -90 ? (360 + c2) : c2;

        // 夹角获取
        angle = Math.floor(c2 - c1);
        angle = angle < 0 ? angle + 360 : angle;
        return angle;
    }

    dragPointStart = (e: any, type: string) => {
        e.stopPropagation();
        const { layerAct } = this.props;

        this.setState({
            dragStartX: e.clientX,
            dragStartY: e.clientY,
            dragType: type.split('-')
        });

        this.props.changeLayerConfig({
            key: 'layers',
            data: {
                opType: 'dragSize',
                opLayers: layerAct.selected,
                type: 'start'
            }
        });

        document.addEventListener('mousemove', this.dragPointMove);
        document.addEventListener('mouseup', this.dragPointEnd);
    }

    dragPointMove = (e: any) => {
        const { dragStartX, dragStartY, dragType } = this.state;
        const { layerAct, percent, config: { screenConfig: { grid = 1 } }, layerItem } = this.props;

        const distanceX = Math.round((e.clientX - dragStartX) * 100 / percent);
        const distanceY = Math.round((e.clientY - dragStartY) * 100 / percent);

        if (Math.abs(distanceX) >= grid || Math.abs(distanceY) >= grid) {

            const moveX = distanceY * layerItem.attr.w / layerItem.attr.h - distanceX;
            const moveY = distanceX * layerItem.attr.h / layerItem.attr.w - distanceY;

            this.props.changeLayerConfig({
                key: 'layers',
                data: {
                    opType: 'dragSize',
                    opLayers: layerAct.selected,
                    dragType,
                    type: 'adjust',
                    x: Math.round(distanceX / grid) * grid,
                    y: Math.round(distanceY / grid) * grid
                }
            });
        }
    }

    dragPointEnd = (e: any) => {
        const { layerAct } = this.props;
        this.props.changeLayerConfig({
            key: 'layers',
            data: {
                opType: 'dragSize',
                type: 'end',
                opLayers: layerAct.selected
            }
        });
        document.removeEventListener('mousemove', this.dragPointMove);
        document.removeEventListener('mouseup', this.dragPointEnd);
    }
}

export default LayerHandler;
