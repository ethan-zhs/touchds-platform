import * as React from 'react';

import * as layerUtils from '../../../utils/layerUtils';

import AliasInput from './AliasInput';

const classNames = require('classnames');
const styles = require('./index.less');

interface IProps {
    config: any;
    changeLayerConfig: any;
    layerAct: any;
    changeLayerAct: any;
}

interface IState {
    dragLayer: any;
    dropLayer: any;
    isDragging: boolean;
    lineX: number;
    lineY: number;
    dropToGap: boolean;
    dropToLast: boolean;
    dropPosition: number;
}

class LayerList extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isDragging: false,
            dragLayer: {},
            dropLayer: {},
            dropPosition: 1,
            lineX: 0,
            lineY: 0,
            dropToGap: false,
            dropToLast: false
        };
    }

    render() {
        const {
            lineX,
            lineY,
            dropToGap,
            isDragging
        } = this.state;

        const {
            layerAct: { selected, hovered, viewType },
            changeLayerAct,
            config
        } = this.props;

        const {
            layerList,
            layers
        } = config;

        const list: any = layerUtils.layerToList(this.folderCloseFilter(layerList));

        return (
            <div className={styles['layer-manager-wrap']}>
                {list.map((item: any, index: number) => {
                    const currLayer = layers[item.id];

                    return (
                        <li
                            draggable={!currLayer.inputFocus || !selected.includes(item.id)}
                            key={index}
                            className={classNames({
                                [styles[`layer-manager-${item.type}`]]: true,
                                [styles['layer-manager-item']]: true,
                                [styles['layer-manager-thumbail-wrap']]: viewType === 'thumbail',
                                [styles['selected']]: selected.includes(item.id) && !isDragging,
                                [styles['hovered']]: hovered.includes(item.id),
                                [styles['hided']]: !currLayer.attr.visible,
                                [styles['locked']]: currLayer.attr.lock
                            })}
                            style={{ paddingLeft: item.level * 10 + 8 }}
                            title={currLayer.alias}
                            onClick={(e) => this.clickToSelectLayer(e, item, list)}
                            onContextMenu={(e) => this.handleLayerMouseUp(e, item.id)}
                            onMouseEnter={() => changeLayerAct({ opType: 'hover', idList: [item.id] })}
                            onMouseLeave={() => changeLayerAct({ opType: 'hover', idList: [] })}
                            onDragStart={(e) => this.layerDragStart(e, item)}
                            onDragEnter={(e) => this.layerDragEnter(e, item)}
                            onDragOver={(e) => this.layerDragOver(e, item)}
                            onDragEnd={this.layerDragEnd}
                        >
                            {item.type === 'group' ? (
                                <div
                                    className={[
                                        styles['layer-folder'],
                                        item.open ? styles['layer-folder-open'] : ''
                                    ].join(' ')}
                                    onClick={(e: any) => this.toggleFolder(e, item.id)}
                                >
                                    <i className={`icon-font icon-right-gui ${styles['layer-folder-arrow']}`} />
                                    <i className='icon-font icon-group' />
                                </div>
                            ) : viewType === 'thumbail' ? (
                                <img className={styles['layer-item-thumbail']} src={currLayer.icon} />
                            ) : (
                                <div className={styles['com-ico']}>
                                    <i className='icon-font icon-com-regular_line' />
                                </div>
                            )}

                            <div
                                className={[
                                    styles['layer-manager-thumbail'],
                                    styles['layer-manager-thumbail-wrap']].join(' ')
                                }
                            >
                                {currLayer.inputFocus && selected.includes(item.id) ? (
                                    <AliasInput
                                        currLayer={currLayer}
                                        selectedLayers={selected}
                                        changeLayerConfig={this.props.changeLayerConfig}
                                    />
                                ) : (
                                    <span
                                        className={styles['layer-item-span']}
                                        onDoubleClick={() => this.focusInput(item.id)}
                                    >{currLayer.alias}
                                    </span>
                                )}
                            </div>

                            {currLayer.attr.lock && (
                                <div
                                    className={styles['layer-thumbail-item']}
                                    onMouseUp={(e: any) => this.changeLayerLock(e, item.id)}
                                >
                                    <i className='icon-font icon-lock' />
                                </div>
                            )}

                            {!currLayer.attr.visible && (
                                <div
                                    className={styles['layer-thumbail-item']}
                                    onMouseUp={(e: any) => this.changeLayerVisible(e, item.id)}
                                >
                                    <i className='icon-font icon-hide' />
                                </div>
                            )}
                        </li>
                    );
                })}

                <div
                    className={styles['last-flex-item']}
                    onClick={() => this.updateLayerSelect('clear')}
                    onDragOver={(e) => this.layerDragOver(e, {}, true)}
                />
                {dropToGap && isDragging && (
                    <div
                        className={styles['layer-move-to-line']}
                        style={{ transform: `translate(${lineX}px, ${lineY}px)` }}
                    />
                )}

                <div className={styles['draging-wrap']} />
            </div>
        );
    }

    handleDraging = (clientY: number, item: any, isLast: boolean = false) => {
        const elem: any = document.querySelector(`.${styles['layer-manager-wrap']}`);
        const dragY = clientY - elem.getBoundingClientRect().y;

        const liElems: any = elem.querySelectorAll('li');
        const liLength = liElems.length;
        const liHeight = liElems[0].offsetHeight;
        const dragLine = dragY / liHeight;
        const dragLineNum = Math.round(dragLine);
        const lineY = (isLast ? liLength : dragLineNum) * liHeight;    // 指示线纵向位置
        const dropPosition = dragLineNum > dragLine || isLast ? 1 : 0; // 拖放位置(靠上 - 0, 靠下 - 1)

        let dropToGap = true;       // 鼠标停留在间隙
        let lineX = item.level * 10 || 0;    // 指示线长度

        if (item.type === 'group') {
            const pos = dragY % liHeight;
            // 鼠标停留在在组中间
            if (pos <= liHeight * 3 / 4 && pos >= liHeight / 4) {
                dropToGap = false;
            } else if (item.open && pos > liHeight / 2) {
                // 组是展开的时候，指示线短一个层级
                lineX = (item.level + 1) * 10;
            }
        }

        this.setState({
            lineX,
            lineY,
            dropToGap,
            dropLayer: item,
            dropPosition,
            dropToLast: isLast
        });
    }

    layerDragStart = (e: any, item: any) => {
        const { layerAct: { selected = [] } } = this.props;
        const startY = e.clientY;

        // 当多选中图层时，构建选中图层拖拽画像
        if (selected.includes(item.id)) {
            const dragWrap: any = document.querySelector(`.${styles['draging-wrap']}`);
            const dragLayers = document.querySelectorAll(`.${styles['selected']}`);

            dragLayers.forEach((i: any) => {
                const clone = i.cloneNode(true);
                dragWrap.appendChild(clone);
            });
            e.dataTransfer.setDragImage(dragWrap, 0, 0);
        }

        this.setState({
            dragLayer: item,
            isDragging: true
        }, () => {
            this.handleDraging(startY, item);
        });
    }

    layerDragEnter = (e: any, item: any) => {
        // 拖拽到组的时候显示hovered
        this.props.changeLayerAct({
            opType: 'hover',
            idList: item.type === 'group' ? [item.id] : []
        });
    }

    layerDragOver = (e: any, item: any, isLast?: boolean) => {
        e.preventDefault();
        this.handleDraging(e.clientY, item, isLast);
    }

    layerDragEnd = () => {
        const {
            config: { layerList },
            layerAct: { selected = [] }
        } = this.props;

        const {
            dragLayer,
            dropToGap,
            dropPosition,
            dropToLast
        } = this.state;

        // 清除拖拽中替换图片内容
        const dragingWrap: any = document.querySelector(`.${styles['draging-wrap']}`);
        dragingWrap.innerHTML = '';

        // 当拖拽到所有图层下方时，默认释放图层为最下方一级图层
        const dropLayer = dropToLast ? layerList[layerList.length - 1] : this.state.dropLayer;
        const dropInGroup = ((dropLayer.open && dropPosition === 1) || !dropToGap) && !dropToLast;

        let flag = true;
        if (dragLayer.type === 'group') {
            const list: any = layerUtils.layerToList(layerList);
            const childList = layerUtils.getChildrenLayerById(list, dragLayer.id);
            const idList = childList.map((item: any) => item.id);
            const levelList = childList.map((item: any) => item.level);
            const levelminus = Math.max.apply(null, levelList) - dragLayer.level;

            // 拖到最后层级为0
            dropLayer.level = dropToLast ? 0 : dropLayer.level;
            // 当拖进组内时，释放层级加1
            const dropLevel = (dropLayer.open && dropPosition === 1) || !dropToGap ?
                dropLayer.level + 1 : dropLayer.level;

            // 拖拽后最大层级数大于2, 则不允许操作图层层级
            if (levelminus + dropLevel > 2) {
                flag = false;
            }

            // 如果拖入自己的子层级, 则不允许操作图层层级
            if (idList.includes(dropLayer.id)) {
                flag = false;
            }
        }

        this.setState({
            lineX: 0,
            lineY: 0,
            dropToGap: false,
            isDragging: false,
            dragLayer: {},
            dropLayer: {},
            dropPosition: 1
        }, () => {
            const isDragSelected = selected.includes(dragLayer.id);
            const opLayers = isDragSelected ? selected : [dragLayer.id];

            if (flag) {
                this.props.changeLayerConfig({
                    key: 'layerList',
                    data: {
                        opType: 'drop',
                        opLayers,
                        dropLayer,
                        dropInGroup,
                        dropToGap,
                        dropPosition
                    }
                });

                this.props.changeLayerConfig({
                    key: 'layers',
                    data: {
                        opType: 'changeGroupSize'
                    }
                });
            }

            // 选中被拖拽图层
            this.props.changeLayerAct({
                opType: 'select',
                type: 'replaceArr',
                idList: opLayers
            });
        });
    }

    /**
     *  修改图层是否隐藏
     *  @param {*} e 鼠标事件对象
     *  @param {string} id 图层id
     *
     */
    changeLayerVisible = (e: any, id: string) => {
        e.stopPropagation();
        this.props.changeLayerConfig({
            key: 'layers',
            data: {
                opType: 'visible',
                opLayers: [id]
            }
        });
    }

    /**
     *  修改图层是否锁定
     *  @param {*} e 鼠标事件对象
     *  @param {string} id 图层id
     *
     */
    changeLayerLock = (e: any, id: string) => {
        e.stopPropagation();
        this.props.changeLayerConfig({
            key: 'layers',
            data: {
                opType: 'lock',
                opLayers: [id]
            }
        });
    }

    /**
     *  图层重命名输入框获取焦点
     *  @param {string} id 图层id
     *
     */
    focusInput = (id: string) => {
        this.props.changeLayerConfig({
            key: 'layers',
            data: {
                opType: 'inputFocus',
                opLayers: [id]
            }
        });
    }

    /**
     *  右键选中图层并且弹出操作菜单
     *  @param {*} e 鼠标事件对象
     *  @param {string} id 图层id
     *
     */
    handleLayerMouseUp = (e: any, id: string) => {
        e.preventDefault();
        const { layerAct: { selected } } = this.props;
        const top = e.clientY + 10;
        const left = e.clientX + 12;

        // 当右键未选中的图层时, 重新选中图层
        !selected.includes(id) && this.updateLayerSelect('replace', id);

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

    /**
     *  点击选中图层
     *  @param {*} e 鼠标事件对象
     *  @param {object} item 当前图层对象
     *  @param {object} layerList 图层树
     *
     */
    clickToSelectLayer = (e: any, item: any, layerList: any) => {
        const { layerAct: { selected } } = this.props;
        let type = 'replace';
        if (e.ctrlKey && selected && selected.length) {
            const selectedArr = layerList.filter((i: any) => selected.includes(i.id));
            // 必须在同一层级下才能多选
            if (selectedArr.length && selectedArr[0].level === item.level) {
                type = selected.includes(item.id) ? 'delete' : 'add';
            }
        }
        this.updateLayerSelect(type, item.id);
    }

    /**
     *  修改选中图层
     *  @param {string} type 修改类型 replace / add / delete / clear /replaceArr
     *  @param {string} id 图层id
     */
    updateLayerSelect = (type: string, id?: string) => {
        const { layerList } = this.props.config;
        this.props.changeLayerAct({
            opType: 'select',
            type,
            id,
            layerList
        });
    }

    /**
     *  修改组展开/收起
     *  @param {*} e 鼠标事件对象
     *  @param {string} id 组id
     */
    toggleFolder = (e: any, id: string) => {
        e.stopPropagation();

        this.props.changeLayerConfig({
            key: 'layerList',
            data: {
                opType: 'toggleFolder',
                layerId: id
            }
        });
    }

    folderCloseFilter = (list: Array<any>) => {
        const layerList: any = [];

        list.forEach((item: any) => {
            if (item.type === 'group') {
                let itemTemp: any = {};
                itemTemp = {...item};
                itemTemp.list = item.open ? this.folderCloseFilter(itemTemp.list) : [];
                layerList.push(itemTemp);
            } else {
                layerList.push(item);
            }
        });

        return layerList;
    }
}

export default LayerList;
