import * as React from 'react';

const classNames = require('classnames');
const styles = require('./index.less');

interface IProps {
    viewType: string;
    changeViewType: (type: string) => void;
    hideLayerPanel: () => void;
}

class LayerHeader extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            viewType,
            changeViewType,
            hideLayerPanel
        } = this.props;

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
                        onClick={() => changeViewType('thumbail')}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-list']: true,
                            [styles.selected]: viewType === 'simple'
                        })}
                        onClick={() => changeViewType('simple')}
                    />
                    <i
                        className='icon-font icon-back'
                        onClick={hideLayerPanel}
                    />
                </div>
            </div>
        );
    }
}

export default LayerHeader;
