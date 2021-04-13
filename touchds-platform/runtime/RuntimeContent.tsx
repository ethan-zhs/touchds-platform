import * as React from 'react';
import * as R from 'ramda';
import RuntimeComponentPositioner from './RuntimeComponentPositioner';
import RuntimeComponentAnything from './RuntimeComponentAnything';
import {getInstance, IComponentPool} from './componentsPool';
import Spin from 'antd/lib/spin';

import 'antd/lib/spin/style/index.less';
import 'antd/lib/icon/style/index.less';

import CTX from './lib/ctx';
import runUnSafeScript from './lib/runUnSafeScript';
import createTaskDataSource from './lib/createTaskDataSource';
// import {message} from 'antd';

const classNames = require('./RuntimeContent.less');

interface IRuntimeContent {
    className?: string;
    config: any; // 传入屏幕内容的配置json数据
    onFlushComponentMetaPairs?: any; // 返回已知的组件元数据配置信息等
}

interface IComponentEnvInterfaceProps {
    envSetter: (ctx: any, param: any) => any;
    envGetter: (ctx: any, env: any, envDataSource: any) => any;
}

function setEnv(
    ctx: any,
    callbackParam: any,
    envInterfaceProps: IComponentEnvInterfaceProps,
    state: any,
    setState: any,
    onError: any = void 0
) {
    const { envSetter = (_: any, pass: any) => pass } = envInterfaceProps;
    const { env: envLast } = state;
    // console.log(runUnSafeScript(envSetter, [ctx, callbackParam, envLast], onError));
    setState({
        env: {
            ...envLast,
            ...runUnSafeScript(envSetter, [ctx, callbackParam, envLast], onError)
        }
    });
}

// 这个组件的主要功能是
// 1) 根据配置渲染屏幕内容
// 2) 返回组件列表和每个组件元数据，用于编辑器展示配置界面
export default class RuntimeContent extends React.Component<IRuntimeContent, any> {

    _componentsPoolInstance: IComponentPool | null = null;

    constructor(props: IRuntimeContent) {
        super(props as any);
        this.state = {
            isLoading: true,
            env: {},
            envDataSource: {},
            lastDataSourceConfigRaw: ''
        };
    }

    componentDidMount(): void {
        this._loadComponentsPool();
    }

    componentWillReceiveProps(nextProps: Readonly<IRuntimeContent>, nextContext: any): void {
        const { config = {} } = nextProps;
        const { dataSourceConfigRaw = '' }  = config || {};

        if (dataSourceConfigRaw !== this.state.lastDataSourceConfigRaw) {
            this._reloadDataSource(dataSourceConfigRaw);
        }

        this.setState({ lastDataSourceConfigRaw: dataSourceConfigRaw });
    }

    _reloadDataSource = async (dataSourceConfigRaw: any) => {
        const { taskDataSource = null, env = {}, envDataSource = {} } = this.state;
        let tasksDefinition = null;
        tasksDefinition = await runUnSafeScript(dataSourceConfigRaw, [], (error: any) => {
            console.error(error);
        });
        if (!tasksDefinition || !dataSourceConfigRaw) {
            return void 0;
        }
        if (taskDataSource) {
            await taskDataSource.cancelAll();
        }
        this.setState({ envDataSource: {} });
        const taskNext = createTaskDataSource(tasksDefinition, {
            env,
            envDataSource,
            emit: (callbackName: string, callbackParam: any) => {
                if ('setEnvDataSource' === callbackName) {
                    this.setState({
                        envDataSource: {
                            ...this.state.envDataSource,
                            ...callbackParam
                        }
                    });
                } else if ('setEnvDataSourceError' === callbackName) {
                    const [name, error] = callbackParam;
                    // message.warning(`dataSource:${name} caught Error:${error.message}`);
                }
            }
        });
        await taskNext.runAll();
        this.setState({
            taskDataSource: taskNext
        });
    }

    _loadComponentsPool = async () => {
        this.setState({ isLoading: true });
        this._componentsPoolInstance = await getInstance();
        const componentMetaPairs = await this._componentsPoolInstance.getAllComponentMetaAsPairs();
        const { onFlushComponentMetaPairs = () => null } = this.props;
        onFlushComponentMetaPairs(componentMetaPairs);
        this.setState({ isLoading: false });
    }

    _renderItem = (item: any, key: any, offset: any = { x: 0, y: 0 }) => {
        const { isLoading = true } = this.state as any;
        const { config } = this.props;
        const { layers } = config;
        const itemProps = layers[item.id];
        if (!itemProps) {
            return null;
        }

        const { staticProps = {}, envInterfaceProps = {} } = itemProps;

        const setState = (patchState: any) => this.setState(patchState);

        const { env = {}, envDataSource = {} } = this.state;

        const { envGetter = (_: any, pass: any = {}) => null } = envInterfaceProps;

        // console.log('_renderItem', envGetter);

        const envLocal = runUnSafeScript(
            envGetter,
            [CTX, {...env}, {...envDataSource}],
            (error: any) => {
                console.error(item.id, itemProps.comName, 'envGetter', error.message);
            }
        );

        // console.log(item.id, itemProps.comName, envGetter, envLocal);

        return (
            <RuntimeComponentPositioner
                key={`${key}_${item.id}`}
                attr={itemProps.attr}
                offset={offset}
            >
                {isLoading ?
                    <Spin size={'large'} className={classNames.spinFill}/> :
                    (
                        <RuntimeComponentAnything
                            {...staticProps}
                            comName={itemProps.comName}
                            version={itemProps.version}
                            componentsPoolInstance={this._componentsPoolInstance}
                            emit={(callbackName: string, callbackParam: any) => { // P0 传给组件的emit方法，让组件可以向外传递信息
                                if (callbackName === 'setEnv') {
                                    setEnv(
                                        CTX,
                                        callbackParam,
                                        envInterfaceProps,
                                        this.state,
                                        setState,
                                        (error: any) => {
                                            console.error(item.id, itemProps.comName, 'envSetter', error.message);
                                        }
                                    );
                                }
                            }}
                            envLocal={envLocal}
                        />
                    )
                }
            </RuntimeComponentPositioner>
        );
    }

    _renderLayer = (item: any, key: any, offset: any = { x: 0, y: 0 }): any => {
        const { config } = this.props;
        const { layers } = config;
        if (item.type === 'group') {
            const itemProps = layers[item.id];
            return (
                <RuntimeComponentPositioner
                    key={`${key}_${item.id}`}
                    attr={itemProps.attr}
                >
                    {R.reverse(item.list).map((child: any, index: any) => {
                        return this._renderLayer(child, `${key}-${index}`, {
                            x: -itemProps.attr.x + offset.x,
                            y: -itemProps.attr.y + offset.y
                        });
                    })}
                </RuntimeComponentPositioner>
            );
        }
        return this._renderItem(item, key, offset);
    }

    render() {
        const {
            config,
            className
        } = this.props;

        if (config === null) {
            return null;
        }

        const {
            layerList = [],
            screenConfig = {}
            // dataSourceConfig = {}
        } = config;

        return (
            <div
                className={className}
                style={{
                    position: 'relative',
                    backgroundRepeat: 'no-repeat, no-repeat',
                    backgroundSize: 'cover,contain',
                    backgroundPosition: 'center,right bottom',
                    width: screenConfig.width,
                    height: screenConfig.height,
                    backgroundImage: `url(${screenConfig.backgroundImage})`,
                    backgroundColor: screenConfig.backgroundColor
                }}
            >
                {R.reverse(layerList).map((item, index) => this._renderLayer(item, index))}
            </div>
        );
    }
}
