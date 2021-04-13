import * as React from 'react';

const classNames = require('classnames');
const styles = require('./index.less');

interface IProps {
    layerAct: any;
    changeLayerAct: any;
    changePanelVisible: (com: string) => void;
}

class LayerHeader extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const { viewType } = this.props.layerAct;

        return (
            <div className={styles['layer-manager-head']}>
                <span>图层</span>
                <div className={styles['layer-head-btn']}>
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-logo']: true,
                            [styles.selected]: viewType === 'thumbail'
                        })}
                        onClick={() => this.changeViewType('thumbail')}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-list']: true,
                            [styles.selected]: viewType === 'simple'
                        })}
                        onClick={() => this.changeViewType('simple')}
                    />
                    <i
                        className='icon-font icon-back'
                        onClick={() => this.props.changePanelVisible('layer')}
                    />
                </div>
            </div>
        );
    }

    /**
     *  修改图层显示模式
     *  @param {string} type 图层显示模式类型
     *
     */
    changeViewType = (type: string) => {
        localStorage.setItem('viewType', type);
        this.props.changeLayerAct({
            opType: 'viewType',
            viewType: type
        });
    }
}

export default LayerHeader;
