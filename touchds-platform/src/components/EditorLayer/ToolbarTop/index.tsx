import * as React from 'react';

const classNames = require('classnames');
const styles = require('./index.less');

interface IProps {
    changeLayerConfig: any;
    layerAct: any;
}

class ToolbarTop extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { layerAct: { selected } } = this.props;

        return (
            <div
                className={classNames({
                    [styles['layer-manager-toolbar']]: true,
                    [styles['layer-toolbar-top']]: true,
                    [styles['toolbar-disable']]: !(selected && selected.length)
                })}
            >
                <span title='上移一层' onClick={() => this.zIndexChange('step_up')}>
                    <i className='icon-font icon-move-prev' />
                </span>
                <span title='下移一层' onClick={() => this.zIndexChange('step_down')}>
                    <i className='icon-font icon-move-next' />
                </span>
                <span title='置顶' onClick={() => this.zIndexChange('up')}>
                    <i className='icon-font icon-to-top' />
                </span>
                <span title='置底' onClick={() => this.zIndexChange('down')}>
                    <i className='icon-font icon-to-bottom' />
                </span>
            </div>
        );
    }

    /**
     *  移动图层层级
     *  @param {string} type 移动类型
     *
     */
    zIndexChange = (type: string) => {
        const { layerAct: { selected } } = this.props;
        if (selected && selected.length) {
            this.props.changeLayerConfig({
                key: 'layerList',
                data: {
                    opType: 'zIndex',
                    moveType: type,
                    opLayers: selected
                }
            });
        }
    }
}

export default ToolbarTop;
