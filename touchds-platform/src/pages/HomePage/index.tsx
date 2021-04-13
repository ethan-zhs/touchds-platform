import * as React from 'react';
import { fromJS } from 'immutable';

import FieldColorPicker from '../../components/Gui/FieldColorPicker';

const classNames = require('classnames');

class HomePage extends React.Component {
    componentDidMount() {
        const obj = { a: { c: 1 }, b: 2 };
        const map1 = fromJS(obj).toJS();
        map1.a.c = 3;
        console.log(obj, map1);
    }

    render() {
        return (
            <div style={{width: 300}}>
                <h1>Welcome to Home Page</h1>
                <FieldColorPicker changeColor={this.changeColor} color='#ffffff' />

                <div style={{margin: '20px 0'}}>
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-axis-gui']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-bottom-center']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-bottom-left']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-bottom-center-pos']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-horizontal']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-dashed-line']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-hover']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-item']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-middle-center-pos']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-right-outer']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-middle-right-pos']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-top-center-pos']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-percent-suffix']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-poly-line']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-top-right']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-top-left']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-solid']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-incline']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-bottom-right']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-percenter-prefix']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-dot-line']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-middle-left-po']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-smooth-line']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-top-center']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-vertical']: true
                        })}
                    />

                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-close']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-select']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-sort']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-keyboard']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-filter']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-map']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-regular_pie']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-more']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-cuowu']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-help']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-gongzuokongjian-jiuban']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-publish']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-viewport']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-monitor']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-interact']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-nodal']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-network']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-workspace-tmp']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-tool']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-regular_scatterplot']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-copy-screen']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-list']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-kegundong']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-data-config']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-move-prev']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-transfer-screen']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-refresh']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-edit']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-logo']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-favorite']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-sousuo']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-material']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-upload']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-gaodupuman']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-move']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-error']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-completed']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-hide']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-layer']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-lock']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-yulan']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-delete']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-show']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-align-left']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-kuandupuman']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-regular']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-move-next']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-zhibiao']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-align-right']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-zhongxin']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-custom']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-to-bottom']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-setting']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-bottom']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-preview']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-media']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-right-panel']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-to-top']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-regular_line']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-component-list']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-align-center']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-align-horizontal']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-align-vertical']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-unlock']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-line-hide']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-line-show']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-right']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-local-deploy']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-add']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-minus']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-zoom-out']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-zoom-in']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-fullscreen']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-jinggao']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-media_image']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-rili']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-tutorial']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-align-middle']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-guanxiwangluo']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-regular_bar']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-tutorial']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-others']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-my-data']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-media_video']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-screens']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-package']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-my-com']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-forum']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-help-doc-old']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-favorite-fold']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-align-bottom']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-align-top']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-text']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-authorize']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-all']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-exit']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-update']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-renew']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-workspace']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-back']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-group']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-ungroup']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-left']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-decorate']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-goto']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-workspace']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-help-doc']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-level']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-work-order']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-copy']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-to-workspace']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-carousel']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-array-add']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-plugin']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-link']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-unlink']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-axis']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-theme']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-opacity']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-contrast']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-assist']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-text']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-hue']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-saturate']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-background']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-brightness']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-replace']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-save']: true
                        })}
                    />

                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-link-gui']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-left-gui']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-add-gui']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-image-placeholder']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-image-error']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-delete-gui']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-description']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-hide-gui']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-show-gui']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-right-gui']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-map-gui']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-text_label']: true
                        })}
                    />
                    <i
                        className={classNames({
                            ['icon-font']: true,
                            ['icon-com-text_table']: true
                        })}
                    />
                </div>
            </div>
        );
    }

    changeColor = (color: string) => {
        console.log(color);
    }
}

export default HomePage;
