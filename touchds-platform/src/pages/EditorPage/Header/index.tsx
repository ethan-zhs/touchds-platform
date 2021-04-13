import * as React from 'react';
import { observer } from 'mobx-react';
import { Icon } from 'antd';
import WithModalCreateTemplate from '@pages/EditorPage/_components/WithModalCreateTemplate';

const classNames = require('classnames');
const styles = require('./index.less');

interface IHeaderProps {
    // changePanelVisible: any;
    onClickPreview?: any;
    store: any;
    withModalPublish: (props: any) => React.ReactNode;
}

@observer
class Header extends React.Component<IHeaderProps, any> {

    constructor(props: IHeaderProps) {
        super(props);
    }

    componentDidMount() {
        this.listenKeyToTogglePanel();
    }

    render() {
        const {
            onClickPreview = () => null,
            withModalPublish
        } = this.props;

        const {
            panelVisible,
            screenDetail
        } = this.props.store;

        return (
            <div className={styles['datat-editor-header']}>
                <div className={styles['back-btn']} onClick={this.cancelEdit}>
                    <i className='icon-font icon-back' />
                </div>

                <div className={styles['editor-config']}>
                    <div
                        className={classNames({
                            [styles['header-btn']]: true,
                            [styles['__selected']]: panelVisible.includes('layer')
                        })}
                        onClick={() => this.changePanelVisible('layer')}
                    >
                        <i className='icon-font icon-layer' />
                    </div>
                    <div
                        className={classNames({
                            [styles['header-btn']]: true,
                            [styles['__selected']]: panelVisible.includes('component')
                        })}
                        onClick={() => this.changePanelVisible('component')}
                    >
                        <i
                            className={classNames({
                                ['icon-font icon-component-list']: true,
                                [styles['__rotate']]: !panelVisible.includes('component')
                            })}
                        />
                    </div>
                    <div
                        className={classNames({
                            [styles['header-btn']]: true,
                            [styles['__selected']]: panelVisible.includes('config')
                        })}
                        onClick={() => this.changePanelVisible('config')}
                    >
                        <i className='icon-font icon-right-panel' />
                    </div>
                </div>

                <div className={styles['drawer-actions']}>
                    <div className={styles['header-btn']}>
                        <i className='icon-font icon-filter' />
                    </div>
                    <div className={styles['header-btn']}>
                        <i className='icon-font icon-refresh' />
                    </div>
                </div>

                <div className={styles['screen-info']}>
                    <i className='icon-font icon-workspace' />
                    <span>{screenDetail.name}</span>
                </div>

                <div className={styles['global-actions']}>
                    <div className={styles['header-btn']}>
                        <i className='icon-font icon-nodal' title={'节点'}/>
                    </div>
                    <div className={styles['header-btn']} title={'帮助'}>
                        <i className='icon-font icon-help' />
                    </div>
                    <div className={styles['header-btn']} title={'镜像'}>
                        <i className='icon-font icon-monitor' />
                    </div>
                    <WithModalCreateTemplate
                        getReturnTemplateList={this.props.store.getReturnTemplateList}
                        onOkNew={({ name }: any) => {
                            this.props.store.createTemplate({ name });
                        }}
                        renderTrigger={({emitClick}: any) => {
                            return (
                                <div className={styles['header-btn']} title={'创建模板'} onClick={emitClick}>
                                    <Icon type='build' />
                                </div>
                            );
                        }}
                    />
                    {withModalPublish({
                        renderTrigger: ({emitClick}: any) => {
                            return (
                                <div className={styles['header-btn']} title={'发布'} onClick={emitClick}>
                                    <i className='icon-font icon-publish'/>
                                </div>
                            );
                        }
                    })}
                    <div className={styles['header-btn']} title={'预览'} onClick={() => onClickPreview()}>
                        <i className='icon-font icon-preview' />
                    </div>
                </div>
            </div>
        );
    }

    changePanelVisible = (type: string) => {
        this.props.store.changePanelVisible(type);
    }

    /**
     *  快捷键修改视图模块的隐藏与显示
     */
    listenKeyToTogglePanel = () => {
        document.addEventListener('keyup', (e) => {
            const keyCode = window.event ? e.keyCode : e.which;
            const keyCodeList = [
                { keyCode: 37, type: 'layer' },
                { keyCode: 38, type: 'component' },
                { keyCode: 39, type: 'config' }
            ];

            if (keyCodeList.map((item) => item.keyCode).includes(keyCode) && (e.ctrlKey || e.metaKey)) {
                const type: string = keyCodeList.filter((item) => item.keyCode === keyCode).map((item) => item.type)[0];
                this.changePanelVisible(type);
            }
        });
    }

    cancelEdit = () => {
        window.location.href = '/';
    }
}

export default Header;
