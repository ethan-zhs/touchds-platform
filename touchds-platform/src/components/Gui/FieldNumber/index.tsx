import * as React from 'react';

const styles = require('./index.less');

interface IFieldNumberProps {
    fieldWidth?: number;
    suffix?: string;
    value?: number;
    step?: number;
    min?: number;
    max?: number;
    onChange?: (value: number) => void;
    onChangeImmediately?: (value: number) => void;
}

class FieldNumber extends React.Component<IFieldNumberProps, any> {
    constructor(props: IFieldNumberProps) {
        super(props);
        this.state = {
            inputValue: 0
        };
    }

    componentDidMount() {
        this.setState({
            inputValue: this.props.value
        });
    }

    componentDidUpdate(prevProps: IFieldNumberProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                inputValue: this.props.value
            });
        }
    }

    render() {
        const { inputValue } = this.state;
        const { fieldWidth = 90, suffix = '', min = -12000, max = 12000 } = this.props;

        return (
            <div className={styles['number-field']} style={{ width: fieldWidth }}>
                <div className={styles['number-field-input']}>
                    <input
                        min={min}
                        max={max}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={() => this.handleNumChange(inputValue)}
                        onKeyUp={this.handlerInputKeyup}
                    />
                    <span className={styles['number-field-suffix']}>{suffix}</span>
                </div>

                <div className={styles['number-field-button']}>
                    <span className={styles['add-btn']} onClick={this.stepAdd}>+</span>
                    <span className={styles['minus-btn']} onClick={this.stepMinus}>-</span>
                </div>
            </div>
        );
    }

    handlerInputKeyup = (e: any) => {
        const keyCode = window.event ? e.keyCode : e.which;
        keyCode === 13 && e.target.blur();
    }

    handleInputChange = (e: any) => {
        const { onChangeImmediately } = this.props;
        const value = e.target.value.trim();
        if (/^(\-|\+)?\d*(\.\d*)?$/.test(value)) {
            this.setState({
                inputValue: value
            });
            // 获得实时输入变化数据
            onChangeImmediately && onChangeImmediately(Number(value) || 0);
        }
    }

    handleNumChange = (val: number | string) => {
        const { onChange, max = 12000, min = -12000, value = 0 } = this.props;
        // 空则不改变原来的值
        val = val === '' ? value : val;

        // 如果不能成功转换为数值类型，则不改变原来的值
        val = Number(val) === 0 || Number(val) ? Number(val) : value;
        const newVal = val > max ? max : val < min ? min : val;
        this.setState({
            inputValue: newVal
        }, () => {
            onChange && onChange(newVal);
        });
    }

    stepAdd = () => {
        const { inputValue } = this.state;
        const { step = 1, max = 12000 } = this.props;
        let value = Number(inputValue) + step;

        // 处理浮点数加减误差
        value = Math.round(value * 100) / 100;

        value <= max && this.handleNumChange(value);
    }

    stepMinus = () => {
        const { inputValue } = this.state;
        const { step = 1, min = -12000 } = this.props;
        let value = Number(inputValue) - step;

        // 处理浮点数加减误差
        value = Math.round(value * 100) / 100;

        value >= min && this.handleNumChange(value);
    }
}

export default FieldNumber;
