import * as React from 'react';

import LayerHeader from './LayerHeader';
import ToolbarTop from './ToolbarTop';
import LayerList from './LayerList';
import ToolBarBottom from './ToolbarBottom';

const styles = require('./index.less');

interface ILayerProps {
    visible: boolean;
    config: any;
    layerAct: any;
    changeLayerAct: any;
    changeLayerConfig: any;
    changePanelVisible: any;
    selectLayer: any;
}

class EditorLayer extends React.Component<ILayerProps, any> {
    constructor(props: ILayerProps) {
        super(props);
    }

    render() {
        const { visible } = this.props;
        const { layerAct } = this.props;

        return (
            <div className={[styles['datat-editor-layer'], !visible ? styles['__hide'] : ''].join(' ')}>
                <div className={styles['layer-manage']}>
                    <LayerHeader
                        changePanelVisible={this.props.changePanelVisible}
                        changeLayerAct={this.props.changeLayerAct}
                        layerAct={layerAct}
                    />
                    <ToolbarTop
                        changeLayerConfig={this.props.changeLayerConfig}
                        layerAct={layerAct}
                    />
                    <LayerList
                        config={this.props.config}
                        changeLayerConfig={this.props.changeLayerConfig}
                        layerAct={layerAct}
                        changeLayerAct={this.props.changeLayerAct}
                    />
                    <ToolBarBottom
                        config={this.props.config}
                        changeLayerConfig={this.props.changeLayerConfig}
                        changeLayerAct={this.props.changeLayerAct}
                        selectLayer={this.props.selectLayer}
                        layerAct={layerAct}
                    />
                </div>
            </div>
        );
    }
}

export default EditorLayer;
