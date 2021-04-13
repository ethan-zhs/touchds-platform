import * as React from 'react';
import { observer } from 'mobx-react';

import EditorRuler from './EditorRuler';
import EditorSlider from './EditorSlider';
import EditorPanel from './EditorPanel';

// import RuntimeContent from '../../../runtime/RuntimeContent';
import IframeWrapRuntimeContent from './IframeWrapRuntimeContent';

const styles = require('./index.less');

interface IDatatEditorProps {
    store: any;
    onFlushComponentMetaPairs?: any;
}

interface IDatatEditorState {
    percent: number;
    topRulerWidth: number;
    leftRulerWidth: number;
    scrollW: number;
    scrollH: number;
    screenShotWidth: number;
    screenShotHeight: number;
    isDraging: boolean;
    dragStartPos: Array<number>;
    dragEndPos: Array<number>;
}

@observer
class DatatEditorMain extends React.Component<IDatatEditorProps, IDatatEditorState> {
    refCanvasPanelWrap: React.RefObject<any>;

    constructor(props: IDatatEditorProps) {
        super(props);
        this.state = {
            percent: 100,
            scrollH: 0,
            scrollW: 0,
            topRulerWidth: 0,
            leftRulerWidth: 0,
            screenShotWidth: 0,
            screenShotHeight: 0,
            isDraging: false,
            dragStartPos: [0, 0],
            dragEndPos: [0, 0]
        };

        this.refCanvasPanelWrap = React.createRef();
    }

    componentDidMount() {
        this.changePanelViewRange();
        this.panelResize('auto');

        // window视窗大小改变 自适应编辑面板
        window.addEventListener('resize', () => {
            this.panelResize('auto');
        });

        // 按下ctrl + a 自适应编辑面板
        document.addEventListener('keyup', (e) => {
            const keyCode = window.event ? e.keyCode : e.which;

            if (keyCode === 65 && (e.ctrlKey || e.metaKey)) {
                this.panelResize('auto');
            }
        });
    }

    render() {
        const {
            config = {},
            layerAct,
            changeLayerAct,
            changeLayerConfig
        } = this.props.store;

        const { lines = {} } = config;

        const {
            percent,
            scrollH,
            scrollW,
            topRulerWidth,
            leftRulerWidth,
            screenShotWidth,
            screenShotHeight,
            isDraging,
            dragStartPos,
            dragEndPos
        } = this.state;

        const rulerOptions: any = {
            percent,
            scrollH,
            scrollW,
            lines,
            topRulerWidth,
            leftRulerWidth
        };

        const {
            onFlushComponentMetaPairs = () => null
        } = this.props;

        return (
            <div
                className={styles['canvas-main']}
                onContextMenu={this.disableContextMenu}
            >
                <div
                    className={styles['canvas-panel-wrap']}
                    ref={this.refCanvasPanelWrap}
                    onMouseDown={this.dragSelectStart}
                >
                    <div
                        className={styles['screen-shot']}
                        style={{
                            width: screenShotWidth,
                            height: screenShotHeight,
                            position: 'relative'
                        }}
                    >
                        <div
                            // 渲染实际的内容
                            // className='canvas-panel'
                            // style={}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            {/* 此处需要修改成用iframe加载并通过postMessage通信 */}
                            {/* <RuntimeContent config={config}/> */}
                            <IframeWrapRuntimeContent
                                width={'100%'}
                                height={'100%'}
                                styleWrapper={{
                                    transform: `scale(${(percent / 100).toFixed(3)}) translate(0px, 0px)`,
                                    width: config?.screenConfig?.width || 0,
                                    height: config?.screenConfig?.height || 0,
                                    boxShadow: 'none',
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                    transformOrigin: 'top left'
                                }}
                                config={config}
                                percent={percent}
                                onFlushComponentMetaPairs={onFlushComponentMetaPairs}
                            />
                        </div>
                        <EditorRuler
                            options={rulerOptions}
                            changeGuideLines={this.changeGuideLines}
                        />
                        <EditorPanel
                            percent={percent}
                            config={config}
                            changeLayerConfig={changeLayerConfig}
                            layerAct={layerAct}
                            changeLayerAct={changeLayerAct}
                        />
                    </div>
                </div>
                <div
                    className={styles['canvas-panel-wrap-drag']}
                >
                    {isDraging && (
                        <svg className={styles['canvas-selection']}>
                            <path
                                fill='none'
                                stroke='rgba(255,255,255,0.5)'
                                d={`M ${dragStartPos[0]},${dragStartPos[1]}
                                    L ${dragStartPos[0]},${dragEndPos[1]}
                                    L ${dragEndPos[0]},${dragEndPos[1]}
                                    L ${dragEndPos[0]},${dragStartPos[1]} Z`}
                                style={{ strokeWidth: 1, strokeDasharray: '3, 3'}}
                            />
                        </svg>
                    )}
                </div>
                <EditorSlider
                    className={styles['canvas-panel-footer']}
                    changePercent={this.changePercent}
                    percent={percent}
                />
            </div>
        );
    }

    dragSelectStart = (e: any) => {
        // console.log('dragSelectStart....');
        // const canvasPanel: any = document.querySelector(`.${styles['canvas-panel-wrap']}`);
        const canvasPanel: any = this.refCanvasPanelWrap.current;
        const posX = e.clientX - canvasPanel.getBoundingClientRect().x;
        const posY = e.clientY - canvasPanel.getBoundingClientRect().y;

        this.setState({
            dragStartPos: [posX, posY],
            dragEndPos: [posX, posY]
        });

        window.document.documentElement.addEventListener('mousemove', this.dragSelectMove);
        window.document.documentElement.addEventListener('mouseup', this.dragSelectEnd);
        window.document.documentElement.addEventListener('mouseleave', this.dragSelectEnd);
    }

    dragSelectMove = (e: any) => {
        const { dragStartPos, percent } = this.state;
        const { config, changeLayerAct } = this.props.store;
        const { layerList = [], layers = {} } = config;

        // const canvasPanel: any = document.querySelector(`.${styles['canvas-panel-wrap']}`);
        const canvasPanel: any = this.refCanvasPanelWrap.current;
        const posX = e.clientX - canvasPanel.getBoundingClientRect().x;
        const posY = e.clientY - canvasPanel.getBoundingClientRect().y;

        const dragEndPos = [posX, posY];
        const opLayers: Array<string> = [];

        layerList.forEach((item: any) => {
            const { w, h, x, y, visible, lock } = layers[item.id].attr;
            const [ x1, y1 ] = [x, y];
            const [ x2, y2 ] = [x + w, y + h];

            const [ m1, n1 ] = [
                (Math.min(dragStartPos[0], dragEndPos[0]) - 60) * 100 / percent,
                (Math.min(dragStartPos[1], dragEndPos[1]) - 60) * 100 / percent
            ];
            const [ m2, n2 ] = [
                (Math.max(dragStartPos[0], dragEndPos[0]) - 60) * 100 / percent,
                (Math.max(dragStartPos[1], dragEndPos[1]) - 60) * 100 / percent
            ];

            if (m1 <= x2 && n1 <= y2 && m2 >= x1 && n2 >= y1 && visible && !lock) {
                opLayers.push(item.id);
            }
        });

        changeLayerAct({
            opType: 'hover',
            idList: opLayers
        });

        this.setState({
            isDraging: true,
            dragEndPos
        });
    }

    dragSelectEnd = () => {
        const { layerAct, changeLayerAct } = this.props.store;

        // const canvasPanel: any = document.querySelector(`.${styles['canvas-panel-wrap']}`);
        window.document.documentElement.removeEventListener('mousemove', this.dragSelectMove);
        window.document.documentElement.removeEventListener('mouseup', this.dragSelectEnd);
        window.document.documentElement.removeEventListener('mouseleave', this.dragSelectEnd);

        this.setState({
            isDraging: false
        });

        changeLayerAct({
            opType: 'select',
            type: layerAct.hovered.length ? 'replaceArr' : 'clear',
            idList: layerAct.hovered
        });

        changeLayerAct({
            opType: 'hover',
            idList: []
        });
    }

    disableContextMenu = (e: any) => {
        e.preventDefault();
        return false;
    }

    // 根据滚动高度修改标尺滚动定位
    changePanelViewRange = () => {
        const canvasWrap = document.querySelector(`.${styles['canvas-panel-wrap']}`);
        if (canvasWrap) {
            canvasWrap.addEventListener('scroll', () => {
                this.setState({
                    scrollH: canvasWrap.scrollTop,
                    scrollW: canvasWrap.scrollLeft
                });
            });
        }
    }

    // 自适应编辑视窗
    panelResize = (type?: string) => {
        const canvasWrap: any = document.querySelector(`.${styles['canvas-panel-wrap']}`);

        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;

        const wrapMinWidth = canvasWrap.offsetWidth;
        const wrapMinHeight = canvasWrap.offsetHeight;
        const panelWidth = 1920;
        const panelHeight = 800;
        let screenOptions = {};

        // 自动缩放
        if (type === 'auto') {
            const widthPercent = Math.round((wrapMinWidth - 110) / panelWidth * 100);
            const heightPercent = Math.round((wrapMinHeight - 110) / panelHeight * 100);
            const nextPercent = widthPercent < heightPercent ? widthPercent : heightPercent;

            if (nextPercent >= 8) {
                screenOptions = {
                    topRulerWidth: clientWidth,
                    leftRulerWidth: clientHeight,
                    screenShotWidth: wrapMinWidth - 5,
                    screenShotHeight: wrapMinHeight - 5,
                    percent: nextPercent
                };
            }
        }
        // 根据放大比例调整标尺，可视窗口大小
        else {
            const realPanelWidth = Math.round(panelWidth * this.state.percent / 100);
            const realPanelHeight = Math.round(panelHeight * this.state.percent / 100);

            screenOptions = {
                topRulerWidth: realPanelWidth >= clientWidth - 300 ? realPanelWidth + 300 : clientWidth,
                leftRulerWidth: realPanelHeight >= clientHeight - 300 ? realPanelHeight + 300 : clientHeight,
                screenShotWidth: realPanelWidth + 300,
                screenShotHeight: realPanelHeight + 300
            };
        }

        this.setState(screenOptions);
    }

    // 修改参考线列表
    changeGuideLines = (lineChangeOptions: any) => {
        this.props.store.changeLayerConfig({
            key: 'lines',
            data: lineChangeOptions
        });
    }

    // 修改百分比
    changePercent = (percent: number, type?: string) => {
        // 自适应 & 调整至固定百分比
        if (type && type === 'auto') {
            this.panelResize(type);
        } else {
            this.setState({
                percent
            }, () => {
                this.panelResize();
            });
        }
    }
}

export default DatatEditorMain;
