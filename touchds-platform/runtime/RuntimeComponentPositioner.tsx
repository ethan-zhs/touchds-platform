import * as React from 'react';
import { mat4 } from 'gl-matrix';

const IDENTITY_MATRIX_3D = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
];

const RAD_1_DEG = Math.PI / 180;

export default class RuntimeComponentPositioner extends React.Component<any> {
    refSelf: React.RefObject<any>;

    constructor(props: any) {
        super(props);
        this.state = {
            transformMatrix: IDENTITY_MATRIX_3D,
            width: 0,
            height: 0
        };
        this.refSelf = React.createRef();
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        const { attr, offset = { x: 0, y: 0 } } = nextProps;

        // @ts-ignore
        const {
            w = prevState.width,
            h = prevState.height,
            oldW = w,
            oldH = h
        } = attr;

        const scaleW = w / oldW;
        const scaleH = h / oldH;
        // @ts-ignore
        const m = mat4.fromValues(...IDENTITY_MATRIX_3D);
        mat4.translate(m, m, [w / 2, h / 2, 0]);
        mat4.translate(m, m, [attr.x, attr.y, 0]);
        mat4.translate(m, m, [offset.x, offset.y, 0]);
        mat4.scale(m, m, [scaleW, scaleH, 1]);
        mat4.rotate(m, m, attr.deg * RAD_1_DEG, [0, 0, 1]);
        mat4.translate(m, m, [-w / 2 / scaleW, -h / 2 / scaleH, 0]);

        return {
            transformMatrix: Array.from(m),
            width: oldW,
            height: oldH
        };
    }
    render() {
        const {
            transformMatrix,
            width,
            height
        } = this.state as any;

        const { attr } = this.props;

        const { opacity = 1 } = attr;

        return (
            <div
                style={{
                    display: 'inline-block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transformOrigin: 'top left',
                    transform: `matrix3d(${transformMatrix.join(',')})`,
                    width,
                    height,
                    overflow: 'hidden',
                    opacity
                }}
                ref={this.refSelf}
            >
                {this.props.children}
            </div>
        );
    }
}
