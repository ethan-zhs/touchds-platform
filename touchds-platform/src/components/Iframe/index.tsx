import React from 'react';

export default class extends React.Component<any, any> {
    refWrapper: React.RefObject<any>;

    lastIframeElement: HTMLIFrameElement | null;

    constructor(props: any) {
        super(props);
        this.state = {
            isLoadingIframe: false,
            widthIframe: '100%',
            heightIframe: '100%'
        };
        this.refWrapper = React.createRef();
        this.lastIframeElement = null;
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any): void {
        const prevState = this.state;
        if (
            nextProps.width !== prevState.widthIframe ||
            nextProps.height !== prevState.heightIframe
        ) {
            this.setState({
                ...prevState,
                widthIframe: nextProps.width,
                heightIframe: nextProps.height
            });
            this.lastIframeElement?.setAttribute('width', nextProps.width);
            this.lastIframeElement?.setAttribute('height', nextProps.height);
        }
    }

    _mayUpdateIframeElement = (src: any = 'about:blank') => {
        const {
            onLoadIframe = () => null,
            scrolling = false,
            width = '100%',
            height = '100%'
        } = this.props;
        try {
            if (this.lastIframeElement && this.lastIframeElement.contentWindow &&
                typeof this.lastIframeElement.contentWindow.removeEventListener === 'function') {
                this.lastIframeElement.contentWindow.removeEventListener('message', this._byPassMessage, false);
            }
        } catch (error) {
            console.error(error);
            return null;
        }
        this.setState({ isLoadingIframe: true });
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', src);
        iframe.setAttribute('width', width);
        iframe.setAttribute('height', height);
        iframe.setAttribute('style', 'border: none;overflow: hidden;min-width:100%;min-height: 100%;');
        iframe.setAttribute('scrolling', scrolling ? 'yes' : 'no');
        this.refWrapper.current.appendChild(iframe);
        iframe.onload = () => {
            this.setState({ isLoadingIframe: false });
            try {
                // @ts-ignore
                onLoadIframe({ getContentWindow: this.getContentWindow });
                iframe.contentWindow?.addEventListener('message', this._byPassMessage, false);
                iframe.contentWindow?.postMessage(
                    JSON.stringify({ messageType: 'hostReady' }), '*'
                );
            } catch (error) {
                // console.log('error', error);
            }
        };
        iframe.onerror = () => null;
        this.lastIframeElement = iframe;
    }
    getContentWindow = () => {
        if (this.lastIframeElement) {
            return this.lastIframeElement.contentWindow;
        }
        return null;
    }
    _byPassMessage = (event: any) => {
        const { onMessage = () => null } = this.props;
        const refresh = () => {
            if (this.refWrapper.current) {
                this.refWrapper.current.innerHTML = '';
                this._mayUpdateIframeElement(this.props.src);
            }
        };
        onMessage(event, { getContentWindow: this.getContentWindow, refresh });
    }
    componentDidUpdate(prevProps: any) {
        if (prevProps.src !== this.props.src) {
            this._mayUpdateIframeElement(this.props.src);
        }
    }
    componentDidMount() {
        this._mayUpdateIframeElement(this.props.src);
    }
    componentWillUnmount() {
        this.refWrapper.current.innerHTML = '';
        if (this.lastIframeElement && this.lastIframeElement.contentWindow &&
            typeof this.lastIframeElement.contentWindow.removeEventListener === 'function') {
            this.lastIframeElement.contentWindow.removeEventListener('message', this._byPassMessage, false);
        }
    }
    render() {
        const {
            tag = 'div',
            src = null,
            children = [],
            onMessage = () => null,
            width,
            height,
            style,
            ...propsRest
        } = this.props;

        return React.createElement(
            tag, {
                ...propsRest,
                style: {
                    ...style,
                    ...width !== void 0 && { width },
                    ...height !== void 0 && { height }
                }
            },
            <div style={{ width: '100%', height: '100%' }} ref={this.refWrapper}/>
        );
    }
}
