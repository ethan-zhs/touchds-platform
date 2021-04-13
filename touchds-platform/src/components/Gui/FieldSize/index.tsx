import * as React from 'react';

import FieldNumber from '../../Gui/FieldNumber';

const styles = require('./index.less');

interface IFieldSizeProps {
    width: number;
    height: number;
    isLock: boolean;
    changeLayerSize: (data: { w: number, h: number }) => void;
    changeLayerSizeLock: () => void;
}

class FieldSize extends React.Component<IFieldSizeProps, any> {
    constructor(props: IFieldSizeProps) {
        super(props);
    }

    render() {
        const { width, height, isLock } = this.props;

        return (
            <div className={styles['group-size']}>
                <FieldNumber
                    fieldWidth={85}
                    value={width}
                    onChange={this.changeLayerWidth}
                />
                <div className={styles['lock-btn']}>
                    <i
                        className={`icon-font ${isLock ? 'icon-link' : 'icon-unlink'}`}
                        onClick={this.changeSizeLock}
                    />
                </div>
                <FieldNumber
                    fieldWidth={85}
                    value={height}
                    onChange={this.changeLayerHeight}
                />
            </div>
        );
    }

    changeLayerWidth = (value: number) => {
        this.changeLayerSize('w', value);
    }

    changeLayerHeight = (value: number) => {
        this.changeLayerSize('h', value);
    }

    changeLayerSize = (type: string, value: number) => {
        const { width, height, isLock } = this.props;
        const newWidth = type === 'w' ? value : isLock ? value * width / height : width;
        const newHeight = type === 'h' ? value : isLock ? value * height / width : height;

        this.props.changeLayerSize({
            w: Math.round(newWidth),
            h: Math.round(newHeight)
        });
    }

    changeSizeLock = () => {
        this.props.changeLayerSizeLock();
    }
}

export default FieldSize;
