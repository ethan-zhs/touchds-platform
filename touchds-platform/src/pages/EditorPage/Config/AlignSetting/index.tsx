import * as React from 'react';

const styles = require('./index.less');

interface IComSettingProps {
    layers: any;
    layerAct: any;
}

class AlignSetting extends React.Component<IComSettingProps, any> {
    constructor(props: IComSettingProps) {
        super(props);
    }

    render() {
        return (
            <div className={styles['config-manage']}>
                <div className={styles['config-manage-head']}>排列布局</div>
                <div
                    className={styles['setting-panel-basic']}
                >
                    <div className={styles['form-group']}>
                        <div className={styles['form-item']}>
                            <label className={styles['form-label']}>对齐</label>
                            <div className={styles['form-field']}>
                                <div className={styles['align-box']}>
                                    <i className='icon-font icon-align-left' />
                                    <i className='icon-font icon-align-center' />
                                    <i className='icon-font icon-align-right' />
                                    <i className='icon-font icon-align-top' />
                                    <i className='icon-font icon-align-middle' />
                                    <i className='icon-font icon-align-bottom' />
                                </div>
                            </div>
                        </div>
                        <div className={styles['form-item']}>
                            <label className={styles['form-label']}>分布</label>
                            <div className={styles['form-field']}>
                                <div className={styles['align-box']}>
                                    <i className='icon-font icon-align-horizontal' />
                                    <i className='icon-font icon-align-vertical' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AlignSetting;
