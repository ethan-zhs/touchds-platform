import * as R from 'ramda';
import * as React from 'react';
import { observer } from 'mobx-react';

import IconButton from '@components/Gui/IconButton';

const classNames = require('classnames');
const styles = require('./index.less');

interface IComProps {
    componentType: any[];
    mappingCategoryToTypes: {[category: string]: any[]};
    // 单个组件类别映射的组件类型列表，类别指组件一级分类，类型是组件的二级分类
    mappingCategoryToComponentsMetaPairs?: any;
    // 选择组件图标后的回调函数
    onAddComponentFromMeta: any;
    // 当前页面状态树
    store: any;
}

// @ts-ignore
// const CATEGORIES = [
//     ['regular', '常规图表', 'icon-com-regular',  [
//         // icon-logo
//         ['basic', '基本', 'icon-com-more'],
//         ['bar', '柱状图', 'icon-com-regular_bar'],
//         ['line', '线形图', 'icon-com-regular_line'],
//         ['pie', '圆形图', 'icon-com-regular_pie'],
//         ['scatterplot', '散点图', 'icon-com-regular_scatterplot']
//         // icon-com-more
//     ]],
//     ['map', '地图', 'icon-com-map-gui'],
//     ['media', '媒体', 'icon-com-media'],
//     ['text', '文本', 'icon-com-text'],
//     ['network', '关系网络', 'icon-com-network'],
//     ['meterial', '素材', 'icon-com-material'],
//     ['interact', '交互', 'icon-interact'],
//     ['others', '其他', 'icon-com-others']
//     // 'icon-favorite'
// ];

// function _patchListTypes(listTypes: any) {
//     return [
//         ...Array.isArray(listTypes) ? listTypes : [],
//         ['others', '其他', 'icon-com-more']
//     ];
// }

// @ts-ignore
// export const MAPPING_CATEGORY_TO_TYPES = R.fromPairs(R.map((item: any) => {
//     return [R.head(item), _patchListTypes(R.nth(3, item)) || []];
// }, CATEGORIES) as any);

@observer
class ComponentList extends React.Component<IComProps, any> {
    constructor(props: IComProps) {
        super(props);
        const currentCategory: any = R.nth(0, R.nth(0, props.componentType || []) as any);
        this.state = {
            currentCategory,
            currentType: R.pipe(R.head, R.head)(props.mappingCategoryToTypes[currentCategory] as any)
        };
    }

    render() {
        const {
            componentType = [],
            mappingCategoryToTypes = {},
            mappingCategoryToComponentsMetaPairs = {},
            onAddComponentFromMeta = () => null
        } = this.props;

        const { panelVisible, changePanelVisible } = this.props.store;

        const { currentCategory, currentType } = this.state;
        const TYPES_CURRENT_CATEGORY: any = mappingCategoryToTypes[currentCategory] || [];

        return (
            <div
                className={classNames({
                    [styles['datat-editor-component']]: true,
                    [styles['__hide']]: !panelVisible.includes('component')
                })}
            >
                <div className={styles['component-panel']}>
                    <div className={styles['component-head']}>
                        <span>组件列表</span>
                        <i className='icon-font icon-back' onClick={() => changePanelVisible('component')} />
                    </div>

                    <div className={styles['component-wrap']}>
                        <div className={styles['component-choose-box']}>
                            <div className={styles['component-nav']}>
                                <div className={styles['component-nav-wp']}>
                                    {componentType.map((item: any, index: number) => {
                                        const [categoryId, categoryName, icon] = item;
                                        return (
                                            <div
                                                key={index}
                                                onClick={async () => this.changeCategory(categoryId)}
                                                className={classNames({
                                                    [styles['component-tabs']]: true,
                                                    [styles['active']]: currentCategory === categoryId
                                                })}
                                            >
                                                <IconButton title={categoryName} placement='left'>
                                                    <i className={`icon-font ${icon}`} />
                                                </IconButton>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={styles['component-list']}>
                                <div className={styles['collapse']}>
                                    {TYPES_CURRENT_CATEGORY.map((item: any, index: number) => {
                                        const [typeId, typeName, icon] = item;
                                        const isSelected = currentType === typeId;
                                        const listMetaComponents: any = R.path([currentCategory, typeId], mappingCategoryToComponentsMetaPairs) || [];
                                        const countComponentCurrentType = listMetaComponents.length || 0;
                                        return (
                                            <div
                                                key={typeId}
                                                onClick={async () => {
                                                    this.setState({ currentType: typeId });
                                                }}
                                                className={styles['collapse-panel']}
                                            >
                                                <div className={styles['collapse-panel-header']}>
                                                    <i
                                                        className='icon-font icon-right-gui'
                                                        style={{
                                                            ...isSelected && {
                                                                transform: 'rotate(90deg)'
                                                            }
                                                        }}
                                                    />
                                                    <i className={`icon-font ${icon} ${styles['collapse-ico']}`} />
                                                    <span>{typeName} ({countComponentCurrentType})</span>
                                                </div>
                                                {isSelected && (
                                                    <ul className={styles['ul-components']}>
                                                        {listMetaComponents.map((meta: any) => {
                                                            return (
                                                                <li
                                                                    className={styles['li-components']}
                                                                    key={meta.name}
                                                                    onClick={() => onAddComponentFromMeta(meta)}
                                                                >
                                                                    {meta.nameComponent}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['search-box']}>
                        <input type='text' className={styles['search-input']} placeholder='搜索组件' />
                    </div>
                </div>
            </div>
        );
    }

    changeCategory = async (id: string) => {
        const {
            mappingCategoryToTypes = {}
        } = this.props;
        const TYPES_CATEGORY: any = mappingCategoryToTypes[id];
        const currentType = R.pipe(R.head, R.head)(TYPES_CATEGORY);
        this.setState({
            currentCategory: id,
            currentType
        });
    }
}

export default ComponentList;
