import React from 'react';
import Iframe from '@components/Iframe';
import tryJSONParse from '@utils/tryJSONParse';
import { toJS } from 'mobx';

// @ts-ignore
function throttleRaf(fn: any): any {
    let busy = false;
    return function() {
        if (busy) {
            return;
        }
        busy = true;
        fn.apply(this, arguments);
        // using rAF to remove the "busy" plate, when browser is ready
        window.requestAnimationFrame(function() {
            busy = false;
        });
    };
}

export default class IframeWrapRuntimeContent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            widthIframe: '100%',
            heightIframe: '100%'
        };
    }

    componentDidMount(): void {
        this._updateIframe(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any): void {
       this._updateIframe(nextProps);
    }

    _updateIframe = (props: any) => {
        const { config, styleWrapper } = props;
        const { getContentWindow } = this.state;
        if (this.state.isReady && getContentWindow) {
            try {
                // 如果能访问iframe的内容则直接调用传递，这样的通信效率更快，避免延时
                (getContentWindow() as any).runtimeContentDirectReceiveProps({
                    config: toJS(config),
                    styleWrapper: toJS(styleWrapper)
                });
            } catch (error) {
                getContentWindow().postMessage(
                    JSON.stringify({ messageType: 'receiveProps', props: { config, styleWrapper } }), '*'
                );
            }
        }
    }

    _handleOnMessage = async (event: any, { getContentWindow }: any) => {
        this.setState({ getContentWindow });
        if (!this.state.isReady) {
            this.setState({ isReady: true });
            this._updateIframe(this.props);
        }
        const eventData = tryJSONParse(event.data, { messageType: 'unknow' });
        if (eventData.messageType === 'flushComponentMetaPairs') {
            const { onFlushComponentMetaPairs = () => null } = this.props;
            onFlushComponentMetaPairs(eventData.componentMetaPairs);
        } else if (eventData.messageType === 'resizeIframe') {
            // const { percent = 1 } = this.props;
            this.setState({
                widthIframe: eventData.width,
                heightIframe: eventData.height
            });
        }
    }

    render() {
        const { width, height } = this.props;
        const { widthIframe, heightIframe } = this.state;
        // const { screenConfig } = config;
        return (
            <React.Fragment>
                <Iframe
                    style={{
                        width: widthIframe,
                        height: heightIframe,
                        minWidth: width,
                        minHeight: height,
                        pointerEvents: 'none'
                    }}
                    width={widthIframe}
                    height={heightIframe}
                    src={'/index.editor.html'}
                    onMessage={this._handleOnMessage}
                    onLoadIframe={this._updateIframe}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        minWidth: width,
                        minHeight: height,
                        width: widthIframe,
                        height: heightIframe
                    }}
                />
            </React.Fragment>
        );
    }
}
