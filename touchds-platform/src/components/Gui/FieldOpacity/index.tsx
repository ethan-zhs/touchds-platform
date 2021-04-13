import * as React from 'react';

import FieldNumber from '../FieldNumber';

const styles = require('./index.less');

interface IFieldOpacityProps {
    opacity: number;
    onChange: (value: number) => void;
}

class FieldOpacity extends React.Component<IFieldOpacityProps, any> {
    constructor(props: IFieldOpacityProps) {
        super(props);
        this.state = {
            sliderValue: 100
        };
    }

    componentDidMount() {
        this.changeSlideValue(this.props.opacity);
    }

    componentDidUpdate(prevProps: IFieldOpacityProps) {
        if (this.props.opacity !== prevProps.opacity) {
            this.changeSlideValue(this.props.opacity);
        }
    }

    render() {
        const { opacity } = this.props;
        const { sliderValue } = this.state;

        return (
            <div className={styles['opacity-range']}>
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
                <div>
                    <FieldNumber
                        fieldWidth={85}
                        value={opacity}
                        max={1}
                        min={0}
                        step={0.05}
                        onChange={this.changeOpacity}
                        onChangeImmediately={this.changeSlideValue}
                    />
                </div>
            </div>
        );
    }

    changeSlideValue = (value: number) => {
        value = value >= 1 ? 1 : value <= 0 ? 0 : value;
        this.setState({
            sliderValue: Math.round(value * 100)
        });
    }

    slideChange = (e: any) => {
        const value = Math.round(e.target.value / 5) * 5;
        this.props.onChange(value / 100);
    }

    changeOpacity = (value: number) => {
        this.props.onChange(value);
    }
}

export default FieldOpacity;
