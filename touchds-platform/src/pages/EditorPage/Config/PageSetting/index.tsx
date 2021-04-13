import * as React from 'react';
import html2canvas from 'html2canvas';
import { Icon } from 'antd';

import FieldNumber from '@components/Gui/FieldNumber';
import FieldColorPicker from '@components/Gui/FieldColorPicker';
import IconButton from '@components/Gui/IconButton';
import ImageUploader from '@components/Gui/ImageUploader';
import Uploader from '@components/Gui/Uploader';

import { DEFAULT_BACKGROUND, DEFAULT_SCREEN_SHOT_IMAGE } from '@src/constants/defaultTheme';
import { createOssUploader } from '@src/utils/uploaderUtils';
import { base64ToFile } from '@src/utils/utils';

const classNames = require('classnames');

const styles = require('./index.less');

interface IPageSettingProps {
    config: any;
    token: any;
    onChangeLayerConfig: any;
}

class PageSetting extends React.Component<IPageSettingProps, any> {
    constructor(props: IPageSettingProps) {
        super(props);

        this.state = {
            isScreenShot: false
        };
    }

    render() {
        const { isScreenShot } = this.state;
        const {
            config: {
                screenConfig = {},
                preset = {}
            },
            token
        } = this.props;

        return (
            <div className={styles['config-manage']}>
                <div className={styles['config-manage-head']}>页面配置</div>
                <div
                    className={styles['setting-panel-basic']}
                >
                    <div className={styles['form-group']}>
                        <div className={styles['form-item']}>
                            <label className={styles['form-label']}>屏幕大小</label>
                            <div className={styles['form-field']}>
                                <div className={styles['screen-size']}>
                                    <div className={styles['screen-width']}>
                                        <FieldNumber
                                            value={screenConfig.width}
                                            onChange={this.changePageWidth}
                                            min={0}
                                        />
                                        <p className={styles['caption']}>宽度</p>
                                    </div>
                                    <div className={styles['screen-height']}>
                                        <FieldNumber
                                            value={screenConfig.height}
                                            onChange={this.changePageHeight}
                                            min={0}
                                        />
                                        <p className={styles['caption']}>高度</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles['form-item']}>
                            <label className={styles['form-label']}>背景颜色</label>
                            <div className={styles['form-field']}>
                                <FieldColorPicker
                                    color={screenConfig.backgroundColor}
                                    flat={preset.flat}
                                    changeColor={this.changeBackgroundColor}
                                    addGlobalColor={this.addGlobalColor}
                                />
                            </div>
                        </div>

                        <div className={styles['form-item']}>
                            <label className={styles['form-label']}>背景图</label>
                            <div className={styles['form-field']}>
                                <ImageUploader
                                    imgUrl={screenConfig.backgroundImage}
                                    token={token}
                                    changeUrl={this.changeBackgroundUrl}
                                />
                            </div>
                        </div>

                        <div className={styles['form-item']}>
                            <label className={styles['form-label']}>重置</label>
                            <div className={styles['form-field']}>
                                <button
                                    className={styles['primary-button']}
                                    onClick={this.resetBackground}
                                >
                                    恢复默认背景
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles['form-group']}>
                        <div className={styles['form-item']}>
                            <label className={styles['form-label']}>页面缩放方式</label>
                            <div className={styles['form-field']}>
                                {this.renderDisplayRadio()}
                            </div>
                        </div>

                        <div className={styles['form-item']}>
                            <label className={styles['form-label']}>栅格间距</label>
                            <div className={styles['form-field']}>
                                <div>
                                    <FieldNumber
                                        suffix='px'
                                        value={screenConfig.grid}
                                        fieldWidth={96}
                                        onChange={this.changePageGrid}
                                        min={1}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles['form-group']}>
                        <div className={styles['form-item']}>
                            <label className={styles['form-label']}>缩略图</label>
                            <div className={styles['form-field']}>
                                <div className={styles['screen-cover']}>
                                    <div className={styles['cover-btn']}>
                                        <button onClick={this.screenShot}>
                                            {isScreenShot ? <Icon type='loading' /> : '截取封面'}
                                        </button>
                                        <Uploader
                                            changeUrl={this.changeScreenShotUrl}
                                            token={token}
                                            styles={{ width: '50%' }}
                                        >
                                            {(isUploading: boolean) => (
                                                <button style={{ width: '100%' }}>
                                                    {isUploading ? <Icon type='loading' /> : '上传封面'}
                                                </button>
                                            )}
                                        </Uploader>
                                    </div>
                                    <div className={styles['screen-preview']}>
                                        <img src={screenConfig.screenShot || DEFAULT_SCREEN_SHOT_IMAGE.screenShot} />
                                    </div>
                                    <span className={styles['upload-tip']}>*选中封面，从剪贴板粘贴</span>
                                </div>
                            </div>
                       </div>
                   </div>
                </div>
            </div>
        );
    }

    addGlobalColor = (color: string) => {
        this.props.onChangeLayerConfig({
            key: 'preset',
            data: {
                opType: 'flat',
                value: color
            }
        });
    }

    changeScreenShotUrl = (url: string) => {
        this.props.onChangeLayerConfig({
            key: 'screen',
            data: {
                opType: 'screenShot',
                value: url
            }
        });
    }

    uploadScreenShot = async (file: File) => {
        const { token } = this.props;
        const uploader = createOssUploader(
            'OSS',
            token,
            token.imagePosition,
            { types: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', '.ico'] }
        );
        const res: any = await uploader.upload(file);
        return res.sourceLink;
    }

    screenShot = () => {
        const divElem: HTMLElement = document.querySelector('.canvas-panel') as HTMLElement;
        const cloneElem: HTMLElement = divElem.cloneNode(true) as HTMLElement;
        const parentElem: HTMLElement = divElem.parentNode as HTMLElement;

        cloneElem.style.transform = '';
        cloneElem.style.left = '-30000px';
        parentElem.appendChild(cloneElem);
        this.setState({ isScreenShot: true });
        html2canvas(cloneElem, {
            useCORS: true,
            scale: 0.2
        }).then(async (canvas) => {
            parentElem.removeChild(cloneElem);
            const img = canvas.toDataURL();
            const imgFile = base64ToFile(img);
            try {
                const url = await this.uploadScreenShot(imgFile);
                this.props.onChangeLayerConfig({
                    key: 'screen',
                    data: {
                        opType: 'screenShot',
                        value: url
                    }
                });
            } catch (err) {
                console.log(err);
            }
            this.setState({ isScreenShot: false });
        });
    }

    changeBackgroundUrl = (url: string) => {
        this.props.onChangeLayerConfig({
            key: 'screen',
            data: {
                opType: 'background',
                backgroundImage: url
            }
        });
    }

    changeBackgroundColor = (color: string) => {
        this.props.onChangeLayerConfig({
            key: 'screen',
            data: {
                opType: 'background',
                backgroundColor: color
            }
        });
    }

    resetBackground = () => {
        this.props.onChangeLayerConfig({
            key: 'screen',
            data: {
                opType: 'background',
                backgroundColor: DEFAULT_BACKGROUND.backgroundColor,
                backgroundImage: DEFAULT_BACKGROUND.backgroundImg
            }
        });
    }

    renderDisplayRadio = () => {
        const { config: { screenConfig = {} } } = this.props;
        const DISPLAY_TYPE = [
            { type: 1, title: '全屏铺满',  placement: 'bottom', icon: 'icon-zhongxin' },
            { type: 2, title: '等比缩放宽度铺满',  placement: 'bottom', icon: 'icon-kuandupuman' },
            { type: 3, title: '等比缩放高度铺满',  placement: 'bottom', icon: 'icon-gaodupuman' },
            { type: 4, title: '等比缩放高宽铺满 (可滚动)',  placement: 'bottomRight', icon: 'icon-kegundong' }];
        return (
            <div className={styles['scale-type']}>
                {DISPLAY_TYPE.map((item: any) => {
                    return (
                        <IconButton key={item.type} title={item.title} placement={item.placement}>
                            <button
                                onClick={() => this.changePageDisplay(item.type)}
                                className={classNames({
                                    [styles['selected']]: screenConfig.display === item.type
                                })}
                            >
                                <i
                                    className={classNames({
                                        ['icon-font']: true,
                                        [item.icon]: true
                                    })}
                                />
                            </button>
                        </IconButton>
                    );
                })}
            </div>
        );
    }

    changePageDisplay = (type: number) => {
        this.props.onChangeLayerConfig({
            key: 'screen',
            data: {
                opType: 'display',
                value: type
            }
        });
    }

    changePageWidth = (value: number) => {
        this.changePageSize('w', value);
    }

    changePageHeight = (value: number) => {
        this.changePageSize('h', value);
    }

    changePageSize = (type: string, value: number) => {
        this.props.onChangeLayerConfig({
            key: 'screen',
            data: {
                opType: 'size',
                type,
                value
            }
        });
    }

    changePageGrid = (value: number) => {
        this.props.onChangeLayerConfig({
            key: 'screen',
            data: {
                opType: 'grid',
                value
            }
        });
    }
}

export default PageSetting;
