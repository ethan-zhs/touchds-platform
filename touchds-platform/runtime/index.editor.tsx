// TODO: Runtime单独的页面入口 for iframe
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RuntimeContent from './RuntimeContent';

import '@babel/polyfill';

const classNames = require('./index.iframe.less');

function tryJSONParse(input: any, defaultValue: any = null) {
    try {
        return JSON.parse(input);
    } catch (error) {
        return defaultValue;
    }
}

const PADDING = 60;

class IndexEditor extends React.Component<any, any> {
    tasksHostReady: any = [];
    refSelf: React.RefObject<any>;
    widthSelf: number;
    heightSelf: number;
    constructor(props: any) {
        super(props);
        this.state = {
            isHostReady: false,
            propsReceived: {},
            isReady: false
        };
        this.tasksHostReady = [];
        this.refSelf = React.createRef();
    }
    componentDidMount() {
        window.addEventListener('message', this._handleMessage);

        (window as any).runtimeContentDirectReceiveProps = (propsReceived: any) => {
            // console.log('propsReceived', propsReceived);
            this.setState(
                { propsReceived },
                this._afterPropsReceived
            );
        };
    }
    _handleMessage = (event: any) => {
        const eventData = tryJSONParse(event.data, { eventType: 'unknow' });
        if (eventData.messageType === 'hostReady') {
            this.setState({ isHostReady: true });
            for (const fn of this.tasksHostReady) {
                fn();
            }
        }
        if (eventData.messageType === 'receiveProps') {
            this.setState({
                propsReceived: eventData.props
            }, this._afterPropsReceived);
        }
    }
    _afterPropsReceived = () => {
        const rect = this.refSelf.current.getBoundingClientRect();
        if (this.widthSelf !== rect.width ||
            this.heightSelf !== rect.height) {
            this._postMessage('resizeIframe', {
                width: rect.width + PADDING * 2,
                height: rect.height + PADDING * 2
            });
        }
        this.widthSelf = rect.width || 0;
        this.heightSelf = rect.height || 0;
    }
    _postMessage = (messageType: string, details: any) => {
        window.postMessage(
            JSON.stringify({ ...details, messageType }), '*'
        );
    }
    _doIfHostReady = (fn: any) => {
        if (this.state.isHostReady) { fn(); }
        this.tasksHostReady.push(fn);
    }
    _handleFlushComponentMetaPairs = async (componentMetaPairs: any = []) => {
        // console.log('_handleFlushComponentMetaPairs in iframe');
        this._doIfHostReady(() => {
            this._postMessage('flushComponentMetaPairs', { componentMetaPairs });
        });
    }
    render() {
        const {propsReceived = {}} = this.state;
        const {styleWrapper, config = null} = propsReceived;

        return (
            <div
                className={classNames.rootIframe}
                ref={this.refSelf}
                style={{
                    opacity: 0,
                    ...styleWrapper,
                    ...styleWrapper && {
                        opacity: 1
                    },
                    position: 'absolute',
                    left: PADDING,
                    top: PADDING
                }}
            >
                <RuntimeContent
                    config={config}
                    onFlushComponentMetaPairs={this._handleFlushComponentMetaPairs}
                />
            </div>
        );
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<IndexEditor/>, document.getElementById('app'));
});
