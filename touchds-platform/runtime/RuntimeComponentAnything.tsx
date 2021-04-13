import * as React from 'react';
import * as R from 'ramda';
import Spin from 'antd/lib/spin';
import makeElementResizeDetector from 'element-resize-detector';
import Icon from 'antd/lib/icon';

// https://github.com/wnr/element-resize-detector
const erdUltraFast = makeElementResizeDetector({
    strategy: 'scroll'
});

const classNames = require('./RuntimeContent.less');

export default class RuntimeComponentAnything extends React.Component<any> {
    refSelf: React.RefObject<any>;

    poolListenerResize: Array<any>;

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: false,
            isReactComponent: false,
            ConstructorReactComponent: null
        };
        this.poolListenerResize = [];
        this.refSelf = React.createRef();
    }

    componentDidCatch(error: any, info: any) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        console.log('render error', error, info);
    }

    componentDidMount() {
        this.poolListenerResize = [];

        erdUltraFast.listenTo(this.refSelf.current, this.dispatchResize);

        this._loadComponent();

        this.dispatchResize(this.refSelf.current);
    }

    dispatchResize = (element: any) => {
        for (const fn of this.poolListenerResize) {
            fn({ width: element.offsetWidth, height: element.offsetHeight });
        }
    }

    componentWillUnmount(): void {
        erdUltraFast.removeAllListeners(this.refSelf.current);
    }

    _loadComponent = async () => {
        const {
            comName,
            comKey = comName,
            version,
            componentsPoolInstance
        } = this.props;

        this.setState({ isLoading: true });

        try {
            const componentDefine = await componentsPoolInstance.getComponentDefineByKey(comKey, version);

            const componentConstructor = await componentDefine({
                React,
                width: this.refSelf.current.offsetWidth,
                height: this.refSelf.current.offsetHeight,
                listenResize: (fn: any) => {
                    const self = this;
                    if (typeof fn !== 'function') {
                        throw new TypeError('expect listener to be a function');
                    }
                    self.poolListenerResize.push(fn);
                    return function cancel() {
                        self.poolListenerResize = self.poolListenerResize
                            .filter((thatFn: any) => thatFn !== fn);
                    };
                }
            });

            this.dispatchResize(this.refSelf.current);

            if (R.path(['prototype', 'isReactComponent'], componentConstructor) && typeof componentConstructor === 'function') {
                this.setState({
                    isReactComponent: true,
                    ConstructorReactComponent: componentConstructor
                });
            }

            this.setState({ hasError: false });
        } catch (error) {
            this.setState({ hasError: true });
        }

        this.setState({ isLoading: false });
    }

    renderContent() {
        const {
            hasError,
            isLoading,
            isReactComponent,
            ConstructorReactComponent
        } = this.state as any;

        if (isLoading) {
            return <Spin size={'large'} className={classNames.spinFill}/>;
        }

        const {
            comName,
            comKey = comName,
            version,
            componentsPoolInstance,
            ...propsRest
        } = this.props;

        if (hasError) {
            // You can render any custom fallback UI
            return (
                <div className={classNames.placeholderErrorDefault}>
                    <Icon title={'Something went wrong.'} type={'warning'}/>
                </div>
            );
        }

        if (isReactComponent) {
            return <ConstructorReactComponent {...propsRest}/>;
        }

        return null;
    }

    render() {
        return (
            <div
                ref={this.refSelf}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }}
            >
                {this.renderContent()}
            </div>
        );
    }
}
