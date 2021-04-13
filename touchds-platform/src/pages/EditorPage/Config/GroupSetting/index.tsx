import * as React from 'react';

import FieldOpacity from '@components/Gui/FieldOpacity';
import FieldPosition from '@components/Gui/FieldPosition';
import FieldSize from '@components/Gui/FieldSize';

const styles = require('./index.less');

interface IComSettingProps {
    layers: any;
    layerAct: any;
    onChangeLayerConfig: any;
}

class GroupSetting extends React.Component<IComSettingProps, any> {
    constructor(props: IComSettingProps) {
        super(props);
    }

    render() {
        const { layers, layerAct } = this.props;
        const currGroup = layers[layerAct.selected[0]];
        const sliderValue = Math.round(currGroup.attr.opacity * 100);

        return (
            <div className={styles['config-manage']}>
                <div className={styles['config-manage-head']}>组内配置</div>
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
                            <label className={styles['form-label']}>透明度</label>
                            <div className={styles['form-field']}>
                                <FieldOpacity
                                    opacity={sliderValue / 100}
                                    onChange={this.changeOpacity}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
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

export default GroupSetting;
