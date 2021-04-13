import * as React from 'react';
import { Popover } from 'antd';
import ColorPicker from '../ColorPicker';

const styles = require('./index.less');

interface IFieldColorPickerProps {
    flat?: Array<string>;
    color?: string;
    width?: number;
    changeColor?: (color: string) => void;
    addGlobalColor?: (color: string) => void;
}

class FieldColorPicker extends React.Component<IFieldColorPickerProps, any> {
    constructor(props: IFieldColorPickerProps) {
        super(props);

        this.state = {
            fillColor: '#000000',
            visible: false
        };
    }

    componentDidMount() {
        this.setState({
            fillColor: this.props.color || '#000000'
        });
    }

    componentDidUpdate(prevProps: IFieldColorPickerProps) {
        if (this.props.color !== prevProps.color) {
            this.setState({
                fillColor: this.props.color || '#000000'
            });
        }
    }

    render() {
        const { fillColor, visible } = this.state;
        const { color, flat } = this.props;
        const ColorPickerCom = (
            <ColorPicker
                color={color}
                globalColor={flat}
                changeColor={this.changeColor}
                addGlobalColor={this.addGlobalColor}
            />
        );

        return (
            <div className={styles['color-field']}>
                <span className={styles['color-fill']}>
                    <span style={{ background: color }} />
                </span>
                <input
                    className={styles['color-fill-input']}
                    value={fillColor}
                    onChange={this.colorFillChange}
                    onBlur={this.colorFillInputBlur}
                    onKeyUp={this.handleInputKeyUp}
                />

                <Popover
                    placement='bottomRight'
                    content={visible && ColorPickerCom}
                    overlayClassName={styles['color-picker-pop']}
                    trigger='click'
                    visible={visible}
                    onVisibleChange={this.handleVisibleChange}
                >
                    <img
                        draggable={false}
                        className={styles['color-picker-btn']}
                        src={require('../../../statics/images/icon/color_picker.png')}
                    />
                </Popover>
            </div>
        );
    }

    addGlobalColor = (color: string) => {
        const { addGlobalColor } = this.props;
        addGlobalColor && addGlobalColor(color);
    }

    changeColor = (color: string) => {
        const { changeColor } = this.props;
        changeColor && changeColor(color);
    }

    colorFillChange = (e: any) => {
        this.setState({
            fillColor: e.target.value
        });
    }

    handleInputKeyUp = (e: any) => {
        const keyCode = window.event ? e.keyCode : e.which;
        keyCode === 13 && e.target.blur();
    }

    colorFillInputBlur = () => {
        const { fillColor } = this.state;
        const { r, g, b, a, hex } = ColorPicker.colorFormat(fillColor);

        const color = a >= 1 ? `#${hex}` : `rgba(${r}, ${g}, ${b}, ${a})`;

        this.setState({ fillColor: color }, () => {
            this.changeColor(color);
        });
    }

    handleVisibleChange = (visible: boolean) => {
        this.setState({ visible });
    }
}

export default FieldColorPicker;
