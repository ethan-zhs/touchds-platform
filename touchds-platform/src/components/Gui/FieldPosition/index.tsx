import * as React from 'react';

import FieldNumber from '../FieldNumber';

const styles = require('./index.less');

interface IFieldPositionProps {
    posX: number;
    posY: number;
    changeLayerPosition: (data: { x: number, y: number }) => void;
}

class FieldPosition extends React.Component<IFieldPositionProps, any> {
    constructor(props: IFieldPositionProps) {
        super(props);
    }

    render() {
        const { posX, posY } = this.props;

        return (
            <div className={styles['position-field']}>
                <FieldNumber
                    fieldWidth={85}
                    value={posX}
                    onChange={this.changeLayerX}
                />
                <FieldNumber
                    fieldWidth={85}
                    value={posY}
                    onChange={this.changeLayerY}
                />
            </div>
        );
    }

    changeLayerX = (value: number) => {
        this.changeLayerPos('x', value);
    }

    changeLayerY = (value: number) => {
        this.changeLayerPos('y', value);
    }

    changeLayerPos = (type: string, value: number) => {
        const { posX, posY } = this.props;
        this.props.changeLayerPosition({
            x: type === 'x' ? value : posX,
            y: type === 'y' ? value : posY
        });
    }
}

export default FieldPosition;
