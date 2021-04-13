import * as React from 'react';

import { Popover } from 'antd';

interface IRulerProps {
    className?: string;
    changePercent: any;
    percent: number;
}

const styles = require('./index.less');

class EditorSlider extends React.Component<IRulerProps, any> {
    constructor(props: IRulerProps) {
        super(props);
    }

    render() {
        const { percent, className } = this.props;

        const sliderValue = this.percentToSliderValue(percent);

        return (
            <div className={`${styles['datat-slider']} ${className}`}>
                <Popover content={this.keyboardPanelRender()} overlayClassName={styles['keyboard-pop']}>
                    <div className={styles['keys-event']}>
                        <i className='icon-font icon-keyboard' />
                    </div>
                </Popover>
                <Popover content={this.percentPanelRender()} overlayClassName={styles['percent-pop']} trigger='click'>
                    <div className={styles['percent-select']}>
                        <span className={styles['scale-input']}>{percent}</span>
                        <span className={styles['percent-unit']}>%</span>
                        <i className='icon-font icon-bottom' />
                    </div>
                </Popover>
                <div className={styles['slider-bar']}>
                    <i
                        className='icon-font icon-zoom-out'
                        onClick={() => this.handleChangeSlide(sliderValue > 0 ? 'remove' : 'nochange')}
                    />
                    <input
                        type='range'
                        value={sliderValue}
                        onChange={this.slideChange}
                        className={styles['input-range']}
                        style={{ background: `linear-gradient(to right, rgb(0, 251, 255),
                            rgb(0, 176, 255) ${sliderValue / 10 + 1}%,
                            rgb(38, 42, 53) ${(sliderValue + 10) * 1.1}%,
                            rgb(38, 42, 53))` }}
                    />
                    <i
                        className='icon-font icon-zoom-in'
                        onClick={() => this.handleChangeSlide(sliderValue < 100 ? 'add' : 'nochange')}
                    />

                    <i className='icon-font icon-viewport' />
                </div>
            </div>
        );
    }

    /**
     *  提示快捷键面板
     *
     */
    keyboardPanelRender = () => {
        const config = [
            { name: '开关图层面板', key: '←' },
            { name: '开关组件面板', key: '↑' },
            { name: '开关右侧面板', key: '→' },
            { name: '画布缩放到最佳位置', key: 'a' }
        ];
        return (
            <div className={styles['keyboard-panel']}>
                {config.map((item: any, index: number) => (
                    <div className={styles['keyboard-item']} key={index}>
                        <span>{item.name}</span>
                        <div className={styles['key-use']}>
                            <span>Ctrl/Cmd</span>
                            <span> + {item.key}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    /**
     *  点击缩放可视区域
     *
     */
    percentPanelRender = () => {
        const config = [
            { name: '200%', percent: 200 },
            { name: '150%', percent: 150 },
            { name: '100%', percent: 100 },
            { name: '50%', percent: 50 },
            { name: '自适应', percent: 0 }
        ];
        return (
            <div className={styles['percent-panel']}>
                {config.map((item: any, index: number) => (
                    <div
                        className={styles['percent-item']}
                        key={index}
                        onClick={() => this.props.changePercent(item.percent, item.percent === 0 && 'auto')}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        );
    }

    /**
     *  点击改变缩放滑动控件的滑动位置和缩放比例
     *  @param {string} type 缩放类型(放大-add / 缩小-remove)
     *
     */
    handleChangeSlide = (type: string) => {
        const { percent } = this.props;
        const sliderValue = this.percentToSliderValue(percent);
        if (type === 'add' || type === 'remove') {
            const value = sliderValue + (type === 'add' ? 10 : - 10);
            this.handleChangePercent(value);
        }
    }

    /**
     *  拖动或点击滑动控件修改缩放比例
     *  @param {object} e 缩放控件对象
     *
     */
    slideChange = (e: any) => {
        const value = Math.round(e.target.value / 10) * 10;
        this.handleChangePercent(value);
    }

    /**
     *  修改缩放百分比
     *  @param {number} value 缩放百分比数值
     *
     */
    handleChangePercent = (value: number) => {
        const percentArr = [18, 35, 52, 70, 88, 105, 122, 140, 158, 175, 200];
        this.props.changePercent(percentArr[value / 10]);
    }

    /**
     *  百分比映射到滑动控件数值
     *  @param {number} percent 百分比数值
     *
     */
    percentToSliderValue = (percent: number) => {
        let slideValue = 0;
        const percentArr = [35, 52, 70, 88, 105, 122, 140, 158, 175, 200];

        percentArr.every((item: number, index: number) => {
            if (percent < item) {
                slideValue = index * 10;
                return false;
            } else if (percent >= 200) {
                slideValue = 100;
                return false;
            }

            return true;
        });

        return slideValue;
    }
}

export default EditorSlider;
