import * as React from 'react';
import { observer } from 'mobx-react';

import ComSetting from './ComSetting';
import GroupSetting from './GroupSetting';
import PageSetting from './PageSetting';
import AlignSetting from './AlignSetting';

const classNames = require('classnames');
const styles = require('./index.less');

interface IConfigProps {
    token: any;
    store: any;
}

@observer
class DatatEditorConfig extends React.Component<IConfigProps, any> {
    constructor(props: IConfigProps) {
        super(props);
    }

    render() {
        const {
            panelVisible,
            changeLayerConfig,
            config,
            config: { layers },
            layerAct,
            token
        } = this.props.store;
        const { selected = [] } = layerAct;

        return (
            <div
                className={classNames({
                    [styles['datat-editor-config']]: true,
                    [styles['__hide']]: !panelVisible.includes('config')
                })}
            >
                {selected.length > 1 && (
                    <AlignSetting layers={layers} layerAct={layerAct} />
                )}
                {selected.length === 0 ? (
                    <PageSetting
                        token={token}
                        config={config}
                        onChangeLayerConfig={changeLayerConfig}
                    />
                ) : layers && layers[selected[0]] && layers[selected[0]].type === 'group' ? (
                    <GroupSetting
                        layers={layers}
                        layerAct={layerAct}
                        onChangeLayerConfig={changeLayerConfig}
                    />
                ) : layers && layers[selected[0]] && layers[selected[0]].type === 'com' && (
                    <ComSetting
                        layers={layers}
                        layerAct={layerAct}
                        config={config}
                        onChangeLayerConfig={changeLayerConfig}
                    />
                )}
            </div>
        );
    }
}

export default DatatEditorConfig;
