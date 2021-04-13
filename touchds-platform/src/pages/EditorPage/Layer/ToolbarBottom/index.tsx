import * as React from 'react';
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

@observer
class ToolBarBottom extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener('keyup', (e) => {
            const keyCode = window.event ? e.keyCode : e.which;
            const targetElem: any = e.target;

            // 焦点在input/textarea时, 不触发删除图层事件
            if (targetElem && (targetElem.tagName === 'INPUT' || targetElem.tagName === 'TEXTAREA')) {
                return false;
            }

            if ((keyCode === 46 || keyCode === 8)) {
                const { layerAct: { selected } } = this.props.store;
                selected && selected.length && this.deleteLayers();
            }
        });
    }

    render() {
        const {
            layerAct: { selected },
            config: { layerList, layers }
        } = this.props.store;

        // 是否有显示的图层
        const hasVisible = selected.some((id: string) => layers[id] && layers[id].attr.visible);

        // 是否全部锁定
        const allLock = selected.every((id: string) => layers[id] && layers[id].attr.lock);

        // 是否选中图层
        const hasSelectLayer = selected && selected.length;

        // 是否可以成组
        const canSetGroup = !layerUtils.canSetGroup(layerList, selected);

        return (
            <div
                className={classNames({
                    [styles['layer-manager-toolbar']]: true,
                    [styles['layer-toolbar-bottom']]: true,
                    [styles['toolbar-disable']]: !hasSelectLayer
                })}
            >
                <span
                    className={classNames({
                        [styles['disable']]: canSetGroup
                    })}
                    onClick={this.setGroup}
                >
                    <i className='icon-font icon-group' />
                </span>

                <span onClick={this.deleteLayers}>
                    <i className='icon-font icon-delete' />
                </span>

                <span
                    className={classNames({
                        [styles['selected']]: hasSelectLayer && allLock
                    })}
                    onClick={this.changeLayerLock}
                >
                    <i className='icon-font icon-lock' />
                </span>

                <span
                    className={classNames({
                        [styles['selected']]: hasSelectLayer && !hasVisible
                    })}
                    onClick={this.changeLayerVisible}
                >
                    <i className='icon-font icon-hide' />
                </span>
            </div>
        );
    }

    /**
     *  修改图层是否可见
     *
     */
    changeLayerVisible = (e: any) => {
        e.stopPropagation();
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
     *
     */
    changeLayerLock = (e: any) => {
        e.stopPropagation();
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
     *
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

    /**
     *  成组
     *
     */
    setGroup = () => {
        const {
            layerAct: { selected },
            config: { layerList },
            changeLayerConfig,
            changeLayerAct
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
}

export default ToolBarBottom;
