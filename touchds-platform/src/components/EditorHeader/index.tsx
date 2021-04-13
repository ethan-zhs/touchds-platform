import * as React from 'react';

const classNames = require('classnames');
const styles = require('./index.less');

interface IDatatHeaderProps {
    panelVisible: any;
    changePanelVisible: any;
    onClickPreview?: any;
    withModalPublish: (props: any) => React.ReactNode;
}

class EditorHeader extends React.Component<IDatatHeaderProps, any> {
    constructor(props: IDatatHeaderProps) {
        super(props);
    }

    render() {
        const {
            panelVisible,
            changePanelVisible,
            onClickPreview = () => null,
            withModalPublish
        } = this.props;

        return (
            <div className={styles['datat-editor-header']}>
                <div className={styles['back-btn']} onClick={this.cancelEdit}>
                    <i className='icon-font icon-back' />
                </div>

                <div className={styles['editor-config']}>
                    <div
                        className={[styles['header-btn'], panelVisible.layer ? styles['__selected'] : ''].join(' ')}
                        onClick={() => changePanelVisible('layer')}
                    >
                        <i className='icon-font icon-layer' />
                    </div>
                    <div
                        className={[styles['header-btn'], panelVisible.component ? styles['__selected'] : ''].join(' ')}
                        onClick={() => changePanelVisible('component')}
                    >
                        <i
                            className={classNames({
                                ['icon-font icon-component-list']: true,
                                [styles['__rotate']]: !panelVisible.component
                            })}
                        />
                    </div>
                    <div
                        className={[styles['header-btn'], panelVisible.config ? styles['__selected'] : ''].join(' ')}
                        onClick={() => changePanelVisible('config')}
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
                    <span>大屏名称</span>
                </div>

                <div className={styles['global-actions']}>
                    <div className={styles['header-btn']}>
                        <i className='icon-font icon-nodal' />
                    </div>
                    <div className={styles['header-btn']} title={'帮助'}>
                        <i className='icon-font icon-help' />
                    </div>
                    <div className={styles['header-btn']} title={'镜像'}>
                        <i className='icon-font icon-monitor' />
                    </div>
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

    cancelEdit = () => {
        window.location.href = '/';
    }
}

export default EditorHeader;
