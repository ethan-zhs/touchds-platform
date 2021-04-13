import * as React from 'react';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react';

import * as layerUtils from '@utils/layerUtils';
import * as Utils from '@utils/utils';

import CommonModal from '@components/Gui/CommonModal';
import Message from '@components/Gui/Message';

const classNames = require('classnames');
const styles = require('./index.less');

interface IProps {
    store: any;
}

interface IState {
    posType: string;
}

@observer
class ContextMenu extends React.Component<IProps, IState> {
    private node: Element;

    constructor(props: IProps) {
        super(props);

        this.state = {
            posType: 'bottom'
        };

        this.node = document.createElement('div');
        document.body.appendChild(this.node);
    }

    componentDidMount() {
        document.addEventListener('click', (e) => {
            // 点击到禁用的菜单时不隐藏
            const target: any = e.target;
            const { className = '' } = target;
            if (className.includes && className.includes(styles['context-menu-wrap'])) {
                return false;
            }
            this.hideContextMenu();
        });

        document.addEventListener('contextmenu', (e) => {
            this.hideContextMenu();
        });

        window.addEventListener('resize', () => {
            this.hideContextMenu();
        });

        const contextMenu: any = document.querySelector(`.${styles['context-menu-wrap']}`);
        contextMenu.addEventListener('contextmenu', (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        this.keyForCopyLayer();
    }

    render() {
        const { config = {}, layerAct: { selected, contextMenu } } = this.props.store;
        const { layers = {}, layerList } = config;
        const { visible, x, y } = contextMenu;

        // 是否有子组件图层
        const hasCom = selected.some((id: string) => layers[id] && layers[id].type === 'com');

        // 是否有显示的图层
        const hasVisible = selected.some((id: string) => layers[id] && layers[id].attr.visible);

        // 是否全部锁定
        const allLock = selected.every((id: string) => layers[id] && layers[id].attr.lock);

        // 是否可以成组
        const canSetGroup = !layerUtils.canSetGroup(layerList, selected);

        // 根据屏幕高度，和右键菜单位置确定菜单向上还是向下展开
        const screenHeight = document.body.offsetHeight;
        const type = screenHeight - y - 364 < -30 ? 'top' : 'bottom';

        const menuList = [
            {
                id: 'group1',
                list: [
                    { name: '置顶', icon: 'icon-to-top', events: () => this.zIndexChange('up') },
                    { name: '置底', icon: 'icon-to-bottom', events: () => this.zIndexChange('down') },
                    { name: '上移一层', icon: 'icon-move-prev', events: () => this.zIndexChange('step_up') },
                    { name: '下移一层', icon: 'icon-move-next', events: () => this.zIndexChange('step_down') }
                ]
            },
            {
                id: 'group2',
                list: [
                    { name: '成组', icon: 'icon-group', isDisabled: canSetGroup, events: this.setGroup },
                    { name: '取消成组', icon: 'icon-ungroup', isDisabled: hasCom, events: this.cancelGroup },
                    { name: '成表单组', icon: 'icon-list', isDisabled: true, events: null }
                ]
            },
            {
                id: 'group3',
                list: [
                    { name: allLock ? '解锁' : '锁定', icon: allLock ? 'icon-unlock' : 'icon-lock', events: this.changeLayerLock },
                    { name: hasVisible ? '隐藏' : '显示', icon: hasVisible ? 'icon-hide' : 'icon-show', events: this.changeLayerVisible }
                ]
            },
            {
                id: 'group4',
                list: [
                    { name: '重命名', icon: 'icon-edit', events: this.renameFocus },
                    { name: '复制', icon: 'icon-copy', events: () => this.copyLayer(selected) },
                    { name: '删除', icon: 'icon-delete', events: this.deleteLayers },
                    { name: '收藏', icon: 'icon-favorite', isDisabled: true, events: null }
                ]
            }
        ];

        return createPortal((
            <div
                className={styles['context-menu-wrap']}
                style={{
                    display: visible ? 'block' : 'none',
                    left: x || 0,
                    top: y || 0,
                    transform: `translate(0px, ${type === 'top' ? -100 : 0}%)`
                }}
            >
                {menuList.map((item: any, index: number) => {
                    const menuGroup = item.list && item.list.map((m: any, i: number) => (
                        <div
                            key={index}
                            className={classNames({
                                [styles['context-menu-item']]: true,
                                [styles['disable']]: m.isDisabled
                            })}
                            onClick={m.events}
                        >
                            <i className={`icon-font ${m.icon}`} />
                            {m.name}
                        </div>
                    ));
                    menuGroup.push((
                        <div className={styles['context-menu-divider']} />
                    ));
                    return menuGroup;
                })}
            </div>
        ), this.node);
    }

    /**
     *  取消成组
     */
    cancelGroup = () => {
        const {
            layerAct: { selected },
            changeLayerConfig
        } = this.props.store;

        changeLayerConfig({
            key: ['layers', 'layerList'],
            data: {
                opType: 'cancelGroup',
                opLayers: selected
            }
        });
    }

    /**
     *  成组
     */
    setGroup = () => {
        const {
            layerAct: { selected },
            config: { layerList },
            changeLayerAct,
            changeLayerConfig
        } = this.props.store;

        const groupId = `group_${Utils.randomHash(5)}`;

        changeLayerConfig({
            key: ['layers', 'layerList'],
            data: {
                opType: 'setGroup',
                opLayers: selected,
                groupId
            }
        });

        changeLayerAct({
            opType: 'select',
            type: 'replace',
            id: groupId,
            layerList
        });
    }

    /**
     *  复制图层
     *  @param {string} idList 被复制图层的Id列表
     */
    copyLayer = (idList: Array<string>) => {
        const {
            config: { layerList },
            changeLayerAct,
            changeLayerConfig
        } = this.props.store;

        idList.forEach((id: string, index: number) => {
            const newLayer = layerUtils.getCopyLayerNode(layerList, id);

            // 选中拷贝后的图层
            changeLayerAct({
                opType: 'select',
                type: index === 0 ? 'replace' : 'add',  // 第一个元素替换选中图层id
                id: newLayer.id
            });

            changeLayerConfig({
                key: ['layerList', 'layers'],
                data: {
                    opType: 'copy',
                    opLayerId: id,
                    posId: idList[0],  // 被拷贝的第一个元素id
                    newLayer
                }
            });
        });
    }

    /**
     *  快捷键复制图层
     */
    keyForCopyLayer = () => {
        const { changeLayerAct } = this.props.store;
        const TYPE_LIST = [
            'text',
            'textarea'
        ];

        document.addEventListener('copy', (e: any) => {
            const { layerAct: { selected } } = this.props.store;
            const type = (e.target.type || '').toLowerCase();

            if (selected.length && !TYPE_LIST.includes(type)) {
                changeLayerAct({
                    opType: 'copy',
                    idList: selected
                });
            }
        });

        document.addEventListener('paste', (e: any) => {
            const { layerAct: { copied } } = this.props.store;
            const type = (e.target.type || '').toLowerCase();

            if (copied.length && !TYPE_LIST.includes(type)) {
                try {
                    this.copyLayer(copied);
                } catch (err) {
                    console.log('copy fail');
                }
            }
        });
    }

    /**
     *  移动图层层级
     *  @param {string} type 移动类型
     */
    zIndexChange = (type: string) => {
        const {
            layerAct: { selected },
            changeLayerConfig
        } = this.props.store;

        changeLayerConfig({
            key: 'layerList',
            data: {
                opType: 'zIndex',
                opLayers: selected,
                moveType: type
            }
        });
    }

    /**
     *  隐藏右键菜单
     */
    hideContextMenu = () => {
        this.props.store.changeLayerAct({
            opType: 'contextMenu',
            type: 'hide'
        });
    }

    /**
     *  重命名图层获取焦点
     */
    renameFocus = () => {
        const {
            layerAct: { selected },
            changeLayerAct
        } = this.props.store;

        changeLayerAct({
            opType: 'focus',
            layerId: selected[0]
        });
    }

    /**
     *  修改图层是否可见
     */
    changeLayerVisible = () => {
        const {
            layerAct: { selected },
            config: { layers },
            changeLayerConfig
        } = this.props.store;

        const hasVisible = selected.some((id: string) => layers[id].attr.visible);

        changeLayerConfig({
            key: 'layers',
            data: {
                opType: 'attr',
                opLayers: selected,
                value: {
                    visible: !hasVisible
                }
            }
        });
    }

    /**
     *  修改图层是否锁定
     */
    changeLayerLock = () => {
        const {
            layerAct: { selected },
            config: { layers },
            changeLayerConfig
        } = this.props.store;

        const allLock = selected.every((id: string) => layers[id].attr.lock);

        changeLayerConfig({
            key: 'layers',
            data: {
                opType: 'attr',
                opLayers: selected,
                value: {
                    lock: !allLock
                }
            }
        });
    }

    /**
     *  删除图层
     */
    deleteLayers = () => {
        const {
            layerAct: { selected },
            changeLayerConfig,
            changeLayerAct
        } = this.props.store;

        CommonModal.confirm({
            title: `是否删除选中的${selected.length}个组件?`,
            onOk: () => {
                try {
                    changeLayerConfig({
                        key: ['layers', 'layerList'],
                        data: {
                            opType: 'delete',
                            opLayers: selected
                        }
                    });

                    // 删除后取消选中图层
                    changeLayerAct({
                        opType: 'select',
                        type: 'clear'
                    });
                } catch (err) {
                    Message.error('操作失败');
                }
            }
        });
    }
}

export default ContextMenu;
