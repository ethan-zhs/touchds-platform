import * as R from 'ramda';
import * as React from 'react';
import { observer } from 'mobx-react';
import { Spin, message } from 'antd';

import Header from './Header';
import Layer from './Layer';
import ContextMenu from './ContextMenu';
import Config from './Config';
import ComponentList from './ComponentList';
import EditorMain from './EditorMain';
// import GlobalStore from '../../global/layer/globalStore';
import Store from './store';

import WithModalPublish from '@src/pages/EditorPage/_components/WithModalPublish';

const styles = require('./index.less');

interface IProps {
    store: Store;
    // globalStore: GlobalStore;
    match: any;
}

// interface IDatatEditorState {
//     panelVisible: any;
// }

@observer
class DatatEditorPage extends React.Component<IProps, any> {
    static defaultProps = {
        store: new Store()
        // globalStore: new GlobalStore()
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoadingSecondary: false,
            mappingCategoryToComponentsMetaPairs: {},
            isGettingType: false,
            mappingCategoryToTypes: {}
        };
    }

    componentWillMount() {
        // 获得本地存储的模块显示状态信息
        const panelVisible = localStorage.getItem('panelVisible');
        if (panelVisible) {
            this.setState({ panelVisible: JSON.parse(panelVisible) });
        }
    }

    async componentDidMount() {
        // this.props.globalStore.getUploadToken();
        this.props.store.getScreenDetail({
            screenId: this.props.match.params.id
        });
        await this.setState({
            isGettingType: true
        });
        await this.props.store.getComponentType();
        const { componentType } = this.props.store;
        const mappingCategoryToTypes = R.fromPairs(R.map((item: any) => {
            // console.log('item', item, R.head(item), R.nth(3, item));
            return [R.head(item), R.nth(3, item) || []];
        }, componentType) as any);
        // console.log('componentType', componentType, mappingCategoryToTypes);
        await this.setState({
            isGettingType: false,
            mappingCategoryToTypes
        });
    }

    _handleFlushComponentMetaPairs = (componentsMetaPairs: any = []) => {
        const { mappingCategoryToTypes } = this.state;
        // ...
        const categories: any = R.toPairs(mappingCategoryToTypes);
        const mappingCategoryToTypesComponentsInitial = R.fromPairs(categories.map(([key, types]: any) => {
            return ([key, R.fromPairs(types.map(R.head).map((type: any) => {
                return [type, []];
            }))]);
        }));

        const mappingCategoryToComponentsMetaPairs = componentsMetaPairs.reduce((mapping: any, pair: any) => {
            // @ts-ignore
            const [_, meta] = pair;
            const { categoryComponent = 'others', typeComponent = 'others' } = meta;
            const categoryFinal = R.has(categoryComponent, mapping || {}) ? categoryComponent : 'others';
            const typeFinal = R.has(typeComponent, mapping[categoryFinal] || {}) ? typeComponent : 'others';
            const componentsOfType: any = R.path([categoryFinal, typeFinal], mapping);
            return {
                ...mapping,
                [categoryFinal]: {
                    ...mapping[categoryFinal],
                    [typeFinal]: R.uniqBy(R.prop('name'), R.append(meta, componentsOfType))
                }
            };
        }, mappingCategoryToTypesComponentsInitial);
        this.setState({ mappingCategoryToComponentsMetaPairs });
    }

    _handleAddComponentFromMeta = (meta: any) => {
        const { config } = this.props.store;
        const { width, height } = config.screenConfig;
        const widthItem = 300;
        const heightItem = 150;
        this.props.store.addComponentAsLayer({
            metaComponent: meta,
            attr: {
                x: width / 2 - widthItem / 2,
                y: height / 2 - heightItem / 2,
                w: widthItem,
                h: heightItem,
                deg: 0,
                opacity: 1,
                visible: true
            }
        });
    }

    _handleClickPreview = async () => {
        // ...
        // const { config } = this.props.store;
        const screenId = this.props.match.params.id;
        const key = await this.props.store.postSaveConfigForPreview(screenId);
        window.open(`/preview/${key}`, '_blank');
    }

    render() {
        const {
            mappingCategoryToComponentsMetaPairs,
            isLoadingSecondary,
            isGettingType,
            mappingCategoryToTypes
        } = this.state;

        // const { token } = this.props.globalStore;

        const {
            componentType,
            config,
            screenDetail
        } = this.props.store;

        const isExitComponent = (Object.keys(mappingCategoryToTypes || {}) || []).length > 0;

        // console.log('isExitComponent', isExitComponent, screenDetail);

        return (
            <div className={styles['datat-editor-wrapper']}>
                <Header
                    store={this.props.store}
                    // changePanelVisible={this.changePanelVisible}
                    onClickPreview={this._handleClickPreview}
                    withModalPublish={(props: any) => {
                        const withScreenId = {
                            screenId: this.props.match.params.id
                        };
                        return (
                            <WithModalPublish
                                {...props}
                                screenDetailHash={screenDetail.share_hash}
                                getHashCurrent={async () => {
                                    try {
                                        return await this.props.store
                                            .getHashCurrentConfigOnline(withScreenId);
                                    } catch (error) {
                                        message.error(error.message);
                                        throw error;
                                    }
                                }}
                                getListSnapshotSelectable={async () => {
                                    try {
                                        return await this.props.store
                                            .getListSnapshotSelectable(withScreenId);
                                    } catch (error) {
                                        message.error(error.message);
                                        throw error;
                                    }
                                }}
                                onSaveCurrentConfigAsSnapshot={async () => {
                                    try {
                                        return await this.props.store
                                            .saveCurrentConfigAsSnapshot({
                                                ...withScreenId,
                                                config
                                            });
                                    } catch (error) {
                                        message.error(error.message);
                                        throw error;
                                    }
                                }}
                                onOk={async (id: any, formFields: any) => {
                                    await this.props.store.postPublishRelease({
                                        ...formFields,
                                        ...withScreenId,
                                        id
                                    });
                                    message.success(
                                        id === null ? '实时页面已发布' : '快照已发布'
                                    );
                                    window.open(`/publish/${screenDetail.share_hash}`, '_blank');
                                }}
                                onClickOffline={async (hash: any) => {
                                    await this.props.store.deletePublishRelease({
                                        ...withScreenId
                                    });
                                    message.success('上次的发布已下线');
                                }}
                                onClickDelete={async (hash: any) => {
                                    await this.props.store.deletePublishSnapshot({
                                        hash
                                    });
                                    message.success('快照已删除');
                                }}
                                onSaveComment={async (comment: any, hash: any) => {
                                    await this.props.store.saveCommentOfSnapshot({
                                        comment,
                                        hash
                                    });
                                }}
                            />
                        );
                    }}
                />
                <div
                    className={styles['loading-indicator']}
                    style={{
                        ...(isLoadingSecondary && {
                            height: 1
                        })
                    }}
                />
                <div className={styles['datat-editor-main']}>
                    <Layer store={this.props.store} />
                    <Spin spinning={isGettingType}>
                        {isExitComponent &&
                            (
                                <ComponentList
                                    store={this.props.store}
                                    componentType={componentType}
                                    mappingCategoryToTypes={mappingCategoryToTypes}
                                    mappingCategoryToComponentsMetaPairs={mappingCategoryToComponentsMetaPairs}
                                    onAddComponentFromMeta={this._handleAddComponentFromMeta}
                                />
                            )}
                    </Spin>
                    <EditorMain
                        store={this.props.store}
                        onFlushComponentMetaPairs={this._handleFlushComponentMetaPairs}
                    />
                    <Config store={this.props.store} token={null} />
                </div>
                <ContextMenu store={this.props.store} />
            </div >
        );
    }
}

export default DatatEditorPage;
