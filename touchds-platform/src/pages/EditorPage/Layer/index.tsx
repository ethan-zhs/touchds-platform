import * as React from 'react';
import { observer } from 'mobx-react';

import LayerHeader from './LayerHeader';
import ToolbarTop from './ToolbarTop';
import LayerList from './LayerList';
import ToolBarBottom from './ToolbarBottom';

const classNames = require('classnames');
const styles = require('./index.less');

interface ILayerProps {
    store: any;
}

@observer
class Layer extends React.Component<ILayerProps, any> {
    constructor(props: ILayerProps) {
        super(props);

        this.state = {
            viewType: localStorage.getItem('viewType') || 'thumbail'
        };
    }

    render() {
        const { panelVisible } = this.props.store;
        const { viewType } = this.state;

        return (
            <div
                className={classNames({
                    [styles['datat-editor-layer']]: true,
                    [styles['__hide']]: !panelVisible.includes('layer')
                })}
            >
                <div className={styles['layer-manage']}>
                    <LayerHeader
                        hideLayerPanel={this.hideLayerPanel}
                        changeViewType={this.changeViewType}
                        viewType={viewType}
                    />
                    <ToolbarTop store={this.props.store} />
                    <LayerList
                        store={this.props.store}
                        viewType={viewType}
                    />
                    <ToolBarBottom store={this.props.store} />
                </div>
            </div>
        );
    }

    /**
     *  修改图层视图展示模式
     *  @param {string} type 模式类型
     */
    changeViewType = (type: string) => {
        localStorage.setItem('viewType', type);
        this.setState({
            viewType: type
        });
    }

    /**
     *  隐藏图层面板
     */
    hideLayerPanel = () => {
        this.props.store.changePanelVisible('layer');
    }
}

export default Layer;
