import * as React from 'react';
import { Tabs } from 'antd';
import MonacoEditor from 'react-monaco-editor';

import FieldOpacity from '@components/Gui/FieldOpacity';
import FieldPosition from '@components/Gui/FieldPosition';
import FieldSize from '@components/Gui/FieldSize';
import FieldRotate from '@components/Gui/FieldRotate';
import IconButton from '@components/Gui/IconButton';
import tryJSONParse from '@src/utils/tryJSONParse';
import SettingPanelEnvInterface from '@pages/EditorPage/Config/ComSetting/SettingPanelEnvInterface';
import SettingPanelConfigDataSource from '@pages/EditorPage/Config/ComSetting/SettingPanelDataSourceConfig';
import tryJSONStringify from '@utils/tryJSONStringify';

const styles = require('./index.less');
const { TabPane } = Tabs;

interface IComSettingProps {
    layers: any;
    layerAct: any;
    config: any;
    onChangeLayerConfig: any;
}

class ComSetting extends React.Component<IComSettingProps, any> {
    constructor(props: IComSettingProps) {
        super(props);
        this.state = {
            currGroupPropsRaw: null,
            currEnvSetterRaw: null,
            currEnvGetterRaw: null
        };
    }

    componentDidMount(): void {
        this.setState({
            currGroupPropsRaw: null
        });
    }

    render() {
        const TAB_LIST = [
            { name: '配置', icon: 'icon-setting', components: this.renderConfigPanel() },
            { name: '数据', icon: 'icon-data-config', components: this.renderSettingPanelConfigDataSource() },
            { name: '交互', icon: 'icon-interact', components: this.renderSettingPanelEnvInterface() }
            // { name: '交互', icon: 'icon-interact', components: () => null  }
        ];

        return (
            <div
                className={styles['config-manage']}
                style={{ height: '100%' }}
            >
                <Tabs className={styles['tabs-fill']} defaultActiveKey='0' onChange={() => void 0} animated={false}>
                    {TAB_LIST.map((item: any, index: number) => (
                        <TabPane
                            key={index.toString()}
                            tab={(
                                <IconButton title={item.name} placement={'bottom'}>
                                    <i className={`icon-font ${item.icon}`} />
                                </IconButton>
                            )}
                        >
                            {item.components}
                        </TabPane>
                    ))}
                </Tabs>
            </div>
        );
    }

    renderSettingPanelConfigDataSource = () => {
        const { config } = this.props;
        const {
            currDataSourceConfig
        } = this.state;
        return (
            <SettingPanelConfigDataSource
                currDataSourceConfig={currDataSourceConfig || (config.dataSourceConfigRaw || null)}
                onChangeDataSourceConfig={(nextConfigDataSource: any) => {
                    // console.log('onChangeConfigDataSource...')
                    this.setState({
                        currDataSourceConfig: nextConfigDataSource
                    }, () => {
                        this.changeConfigDataSource();
                    });
                }}
            />
        );
    }

    changeConfigDataSource = () => {
        const {
            currDataSourceConfig
        } = this.state;

        // console.log('changeConfigDataSource', this.props.onChangeLayerConfig)

        this.props.onChangeLayerConfig({
            key: 'dataSource',
            data: {
                dataSourceConfig: currDataSourceConfig
            }
        });
    }

    renderSettingPanelEnvInterface = () => {
        const {
            currEnvSetterRaw,
            currEnvGetterRaw
        } = this.state;

        const { layers, layerAct } = this.props;
        const currGroup = layers[layerAct.selected[0]];

        const { envInterfaceProps = {} } = currGroup;

        return (
            <SettingPanelEnvInterface
                currEnvSetterRaw={currEnvSetterRaw || (envInterfaceProps.envSetter || null)}
                currEnvGetterRaw={currEnvGetterRaw || (envInterfaceProps.envGetter || null)}
                onChangeEnvSetterRaw={(nextEnvSetterRaw: any) => {
                    this.setState({
                        currEnvSetterRaw: nextEnvSetterRaw
                    }, () => {
                        this.changeEnvInterface();
                    });
                }}
                onChangeEnvGetterRaw={(nextEnvGetterRaw: any) => {
                    this.setState({
                        currEnvGetterRaw: nextEnvGetterRaw
                    }, () => {
                        this.changeEnvInterface();
                    });
                }}
            />
        );
    }

    changeEnvInterface = () => {
        const {
            currEnvSetterRaw,
            currEnvGetterRaw
        } = this.state;
        const { layerAct } = this.props;
        this.props.onChangeLayerConfig({
            key: 'layers',
            data: {
                opType: 'envInterfaceProps',
                layerId: layerAct.selected[0],
                envInterfaceProps: {
                    envSetter: currEnvSetterRaw || '',
                    envGetter: currEnvGetterRaw || ''
                }
            }
        });
    }

    renderConfigPanel = () => {
        const { layers, layerAct } = this.props;
        const currGroup = layers[layerAct.selected[0]];
        const sliderValue = Math.round(currGroup.attr.opacity * 100);

        const { currGroupPropsRaw } = this.state;

        return (
            <div
                className={styles['setting-panel-basic']}
            >
                <div className={styles['form-group']}>
                    <div className={styles['form-item']}>
                        <label className={styles['form-label']}>图表尺寸</label>
                        <div className={styles['form-field']}>
                            <FieldSize
                                width={currGroup.attr.w}
                                height={currGroup.attr.h}
                                isLock={currGroup.attr.sizeLock}
                                changeLayerSize={this.changeLayerSize}
                                changeLayerSizeLock={this.changeLayerSizeLock}
                            />
                        </div>
                    </div>
                    <div className={styles['form-item']}>
                        <label className={styles['form-label']}>图表位置</label>
                        <div className={styles['form-field']}>
                            <FieldPosition
                                posX={currGroup.attr.x}
                                posY={currGroup.attr.y}
                                changeLayerPosition={this.changeLayerPosition}
                            />
                        </div>
                    </div>
                    <div className={styles['form-item']}>
                        <label className={styles['form-label']}>旋转角度</label>
                        <div className={styles['form-field']}>
                            <FieldRotate
                                deg={currGroup.attr.deg}
                                flipH={currGroup.attr.flipH}
                                flipV={currGroup.attr.flipV}
                                onChange={this.changeRotate}
                            />
                        </div>
                    </div>
                    <div className={styles['form-item']}>
                        <label className={styles['form-label']}>透明度</label>
                        <div className={styles['form-field']}>
                            <FieldOpacity
                                opacity={sliderValue / 100}
                                onChange={this.changeOpacity}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['form-group']}>
                    <MonacoEditor
                        width={'100%'}
                        height={'360'}
                        language={'json'}
                        theme={'vs-dark'}
                        options={{
                            automaticLayout: true,
                            wordWrap: 'on',
                            scrollbar: {
                                horizontal: 'visible'
                            }
                        }}
                        value={currGroupPropsRaw || JSON.stringify(currGroup.staticProps, null, 2)}
                        onChange={(propsRaw) => {
                            this.setState({
                                currGroupPropsRaw: propsRaw
                            });
                            this.changeProps(propsRaw);
                        }}
                    />
                </div>
            </div>
        );
    }

    changeProps = (propsRaw: any) => {
        const staticProps = tryJSONParse(propsRaw, null);
        if (!staticProps) {
            return;
        }
        const { layerAct } = this.props;
        this.props.onChangeLayerConfig({
            key: 'layers',
            data: {
                opType: 'staticProps',
                layerId: layerAct.selected[0],
                staticProps
            }
        });
        // ...
    }

    changeRotate = (value: any) => {
        const { layerAct } = this.props;

        this.props.onChangeLayerConfig({
            key: 'layers',
            data: {
                opType: 'angle',
                layerId: layerAct.selected[0],
                ...value,
                type: 'assign',
                opLayers: [layerAct.selected[0]]
            }
        });
    }

    changeOpacity = (value: number) => {
        const { layerAct: { selected } } = this.props;

        this.props.onChangeLayerConfig({
            key: 'layers',
            data: {
                opType: 'attr',
                opLayers: selected,
                value: {
                    opacity: value
                }
            }
        });
    }

    changeLayerPosition = (data: { x: number, y: number }) => {
        const { layerAct } = this.props;
        this.props.onChangeLayerConfig({
            key: 'layers',
            data: {
                opType: 'pos',
                layerId: layerAct.selected[0],
                x: data.x,
                y: data.y
            }
        });
    }

    changeLayerSize = (data: { w: number, h: number }) => {
        const { layerAct } = this.props;
        this.props.onChangeLayerConfig({
            key: 'layers',
            data: {
                opType: 'size',
                opLayers: layerAct.selected,
                w: data.w,
                h: data.h
            }
        });
    }

    changeLayerSizeLock = () => {
        const {
            layers,
            layerAct: { selected }
        } = this.props;

        this.props.onChangeLayerConfig({
            key: 'layers',
            data: {
                opType: 'attr',
                opLayers: selected,
                value: {
                    sizeLock: !layers[selected[0]].attr.sizeLock
                }
            }
        });
    }
}

export default ComSetting;
