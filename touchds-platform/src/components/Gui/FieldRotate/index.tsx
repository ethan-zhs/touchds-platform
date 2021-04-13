import * as React from 'react';

import FieldNumber from '../FieldNumber';

const classNames = require('classnames');
const styles = require('./index.less');

interface IFieldRotateProps {
    deg: number;
    flipV: boolean;
    flipH: boolean;
    onChange: (data: { deg: number, flipH: boolean, flipV: boolean }) => void;
}

class FieldRotate extends React.Component<IFieldRotateProps, any> {
    constructor(props: IFieldRotateProps) {
        super(props);
        this.state = {
            angle: 0
        };
    }

    render() {
        const { deg, flipV, flipH } = this.props;

        return (
            <div className={styles['rotate-field']}>
                <FieldNumber
                    fieldWidth={85}
                    value={deg}
                    min={0}
                    max={360}
                    onChange={this.changeDeg}
                />
                <div className={styles['rotate-icon-wraper']} onClick={this.clickChangeDeg}>
                    <span
                        className={styles['rotate-icon']}
                        style={{ transform: `rotate(${this.state.angle}deg)` }}
                    />
                </div>
                <div className={styles['rotate-flip-wp']}>
                    <button
                        className={classNames({
                            [styles['hor']]: true,
                            [styles['selected']]: flipH
                        })}
                        onClick={this.changeFlipH}
                    />
                    <button
                        className={classNames({
                            [styles['ver']]: true,
                            [styles['selected']]: flipV
                        })}
                        onClick={this.changeFlipV}
                    />
                </div>
            </div>
        );
    }

    changeFlipH = () => {
        const { deg, flipV, flipH } = this.props;
        this.props.onChange({
            deg,
            flipV,
            flipH: !flipH
        });
    }

    changeFlipV = () => {
        const { deg, flipV, flipH } = this.props;
        this.props.onChange({
            deg,
            flipH,
            flipV: !flipV
        });
    }

    changeDeg = (value: number) => {
        const { flipV, flipH } = this.props;
        this.props.onChange({
            deg: value,
            flipH,
            flipV
        });
    }

    clickChangeDeg = (e: any) => {
        const angle = this.getAngle(e.clientX, e.clientY, e.target);
        const deg = angle >= 360 ? angle % 360 : angle;
        this.changeDeg(deg);
    }

    /**
     *  获得旋转夹角
     *  @param {*} x1 旋转点1
     *  @param {*} y1
     *  @param {*} x2 旋转点2
     *  @param {*} y2
     */
    getAngle = (x2: number, y2: number, target: any) => {

        // 获取组件的位置信息
        const { x, y, width, height } = target.getBoundingClientRect();

        // 中心点
        const cx = x + width / 2;
        const cy = y + height / 2;

        const x1 = cx;
        const y1 = y;

        // 2个点之间的角度获取
        let c1 = Math.atan2(y1 - cy, x1 - cx) * 180 / (Math.PI);
        let c2 = Math.atan2(y2 - cy, x2 - cx) * 180 / (Math.PI);
        let angle;
        c1 = c1 <= -90 ? (360 + c1) : c1;
        c2 = c2 <= -90 ? (360 + c2) : c2;

        // 夹角获取
        angle = Math.floor(c2 - c1);
        angle = angle < 0 ? angle + 360 : angle;
        return angle;
    }
}

export default FieldRotate;
