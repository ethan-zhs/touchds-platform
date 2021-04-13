/**
 * Created by tommyZZM.OSX on 2020/1/10.
 */
import * as R from 'ramda';
import React from 'react';
import RuntimeContent from './RuntimeContent';
import DISPLAY_TYPE from './constants/displayType';

const classNames = require('./RuntimeContent.less');

const mappingDisplayTypeToStyle = {
    [DISPLAY_TYPE.FILL_SCREEN]: (props: any) => {
        const {
            scaleWidth,
            scaleHeight,
            width,
            height
        } = props;
        const spaceHeight = height * scaleHeight;
        const spaceWidth = width * scaleWidth;
        return ({
            transform: `scale3d(${scaleWidth}, ${scaleHeight}, 1)`,
            height: spaceHeight,
            width: spaceWidth
        });
    },
    [DISPLAY_TYPE.ASPECT_RATIO_FILL_AUTO_SCROLL]: (props: any) => {
        const {
            scaleWidth,
            scaleHeight,
            width,
            height
        } = props;
        let spaceHeight: any;
        let spaceWidth: any;
        if (scaleWidth > scaleHeight) {
            spaceHeight = height * scaleWidth;
            spaceWidth = width * scaleWidth;
            return ({
                transform: `scale3d(${scaleWidth}, ${scaleWidth}, 1)`,
                height: spaceHeight,
                width: spaceWidth
                // overflow: 'scroll'
            });
        }
        spaceHeight = height * scaleHeight;
        spaceWidth = width * scaleHeight;
        return ({
            transform: `scale3d(${scaleHeight}, ${scaleHeight}, 1)`,
            height: spaceHeight,
            width: spaceWidth
            // overflow: 'scroll'
        });
    },
    [DISPLAY_TYPE.ASPECT_RATIO_FILL_HEIGHT]: (props: any) => {
        const {
            scaleHeight,
            width,
            height
        } = props;
        const spaceHeight = height * scaleHeight;
        const spaceWidth = width * scaleHeight;
        return ({
            transform: `scale3d(${scaleHeight}, ${scaleHeight}, 1)`,
            height: spaceHeight,
            width: spaceWidth,
            maxWidth: window.innerWidth,
            overflow: 'hidden'
        });
    },
    [DISPLAY_TYPE.ASPECT_RATIO_FILL_WIDTH]: (props: any) => {
        const {
            scaleWidth,
            width,
            height
        } = props;
        const spaceHeight = height * scaleWidth;
        const spaceWidth = width * scaleWidth;
        return ({
            transform: `scale3d(${scaleWidth}, ${scaleWidth}, 1)`,
            height: spaceHeight,
            width: spaceWidth,
            maxHeight: window.innerHeight,
            overflow: 'hidden'
        });
    }
};

export default class RuntimeContentWithPositioner extends React.Component<any, any> {

    refPositioner: React.RefObject<any>;

    constructor(props: any) {
        super(props);
        this.state = {
            styleDisplayTypePosition: {},
            transformDisplayTypePosition: '',
            scaleWidth: 1,
            scaleHeight: 1
        };
        this.refPositioner = React.createRef();
    }
    componentDidMount(): void {
        window.addEventListener('resize', this._onResize);
        this._onResize();
    }
    componentWillUnmount(): void {
        window.removeEventListener('resize', this._onResize);
    }
    _onResize = () => {
        const { screenConfig = {} } = this.props.config;
        const rect = this.refPositioner.current.getBoundingClientRect();
        const scaleWidth = (rect.width / (screenConfig.width || 0));
        const scaleHeight = (rect.height / (screenConfig.height || 0));
        this.setState({
            scaleWidth,
            scaleHeight,
            widthPositioner: rect.width,
            heightPositioner: rect.height
        }, () => {
            const nextState = RuntimeContentWithPositioner.getDerivedStateFromProps(
                this.props, this.state
            );
            this.setState({ nextState });
        });
    }
    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        const { config } = nextProps;
        const { screenConfig = {} } = config;
        const { scaleWidth, scaleHeight, widthPositioner, heightPositioner } = prevState;
        const getStyleOfDisplayType = R.prop(
            screenConfig.display, mappingDisplayTypeToStyle
        ) || (() => null);
        const style = getStyleOfDisplayType({
            scaleWidth,
            scaleHeight,
            widthPositioner,
            heightPositioner,
            ...screenConfig
        }) || {};
        const { transform, ...styleRest } = style;
        return {
            styleDisplayTypePosition: styleRest,
            transformDisplayTypePosition: transform
        };
    }
    render() {
        const { config } = this.props;
        const {
            styleDisplayTypePosition,
            transformDisplayTypePosition
        } = this.state;
        return (
            <div
                className={classNames.runtimeContentPositioner}
                ref={this.refPositioner}
            >
                <div className={classNames.positionAnchor} style={styleDisplayTypePosition}>
                    <div className={classNames.positionAnchorCenter}>
                        <div className={classNames.transformAnchor} style={{ transform: transformDisplayTypePosition }}>
                            <RuntimeContent className={classNames.runtimeContent} config={config}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
