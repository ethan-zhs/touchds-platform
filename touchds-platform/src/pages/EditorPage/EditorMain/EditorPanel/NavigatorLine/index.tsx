import * as React from 'react';

const styles = require('./index.less');

interface INavigatorLineProps {
    positionX: number;
    positionY: number;
    percent: number;
}

class NavigatorLine extends React.Component<INavigatorLineProps, any> {
    constructor(props: INavigatorLineProps) {
        super(props);
    }

    render() {
        const { percent, positionX, positionY } = this.props;

        const lineLeftWidth = (positionX * percent / 100 + 60) * 100 / percent;
        const lineTopHeight = (positionY * percent / 100 + 60) * 100 / percent;
        const lineWidth = 1 * 100 / percent;

        return (
            <div className={styles['navigator-line']}>
                <div className={styles['navigator-left']} style={{ width: lineLeftWidth, borderWidth: lineWidth }} />
                <div className={styles['navigator-top']} style={{ height: lineTopHeight, borderWidth: lineWidth }} />
                <div
                    className={styles['navigator-account']}
                    style={{
                        fontSize: 12 * 100 / percent,
                        left: -6 * 100 / percent,
                        top: -6 * 100 / percent
                    }}
                >
                    {positionX}, {positionY}
                </div>
            </div>
        );
    }
}

export default NavigatorLine;
