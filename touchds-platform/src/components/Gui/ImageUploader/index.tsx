import * as React from 'react';
import { Icon } from 'antd';
import { createOssUploader } from '../../../utils/uploaderUtils';

const styles = require('./index.less');

interface IImageUploaderProps {
    token: any;
    key?: string;
    imgUrl: string;
    changeUrl: (url: string, key?: string) => void;
}

interface IImageUploaderState {
    fileInputId: string;
    url: string;
    urlValue: string;
    isUploading: boolean;
    uploadBtnVisible: boolean;
    isImageBroken: boolean;
}

declare global {
    interface Window { ComposeOss: any; }
}

class ImageUploader extends React.Component<IImageUploaderProps, IImageUploaderState> {
    constructor(props: IImageUploaderProps) {
        super(props);

        this.state = {
            fileInputId: `upload-input${Math.round(Math.random() * 100000)}`,
            url: '',
            urlValue: '',
            isUploading: false,
            uploadBtnVisible: false,
            isImageBroken: false
        };
    }

    componentDidMount() {
        this.setState({ urlValue: this.props.imgUrl });
    }

    componentDidUpdate(prevProps: IImageUploaderProps) {
        if (this.props.imgUrl !== prevProps.imgUrl) {
            this.setState({
                urlValue: this.props.imgUrl,
                isImageBroken: false
            });
        }
    }

    render() {
        const { imgUrl } = this.props;
        const {
            uploadBtnVisible,
            fileInputId,
            urlValue,
            isImageBroken,
            isUploading
        } = this.state;

        return (
            <div className={styles['background-img']}>
                <div className={styles['background-img-url-field']}>
                    <i className='icon-font icon-link-gui' />
                    <input
                        placeholder='输入图片地址'
                        value={urlValue}
                        onChange={this.changeUrlValue}
                        onBlur={this.handleChangeImageUrl}
                        onKeyUp={this.handleInputKeyUp}
                    />
                </div>

                <div
                    className={styles['background-img-uploader']}
                    onMouseEnter={this.uploaderHover}
                    onMouseLeave={this.uploaderLeave}
                    onDragEnter={this.handleDragEnter}
                    onDragOver={this.handleDragOver}
                    onDrop={this.handleDrop}
                >
                    <input
                        accept='image/png,image/jpeg,image/jpg,image/gif,.ico'
                        type='file'
                        className={styles['fileinput']}
                        id={fileInputId}
                        onChange={this.handleFileInputChange}
                    />

                    {isUploading ? (
                        <div className={styles['img-loaderror']}>
                            <Icon type='loading' />
                        </div>
                    ) : imgUrl === '' ? (
                        <div className={styles['img-empty']} onClick={this.handleUploadImage}>
                            <i className='icon-font icon-image-placeholder' />
                            <div>点击或拖拽文件到这里更换</div>
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '100%' }}>
                            {isImageBroken ? (
                                <div className={styles['img-loaderror']}>
                                    <i className='icon-font icon-image-error' />
                                </div>
                            ) : (
                                <img src={imgUrl} onError={this.imgLoadError} />
                            )}

                            {uploadBtnVisible && (
                                <div className={styles['uploader-btn']}>
                                    <span onClick={this.handleUploadImage}>更改</span>
                                    <span>|</span>
                                    <span onClick={this.handleDeleteImage}>删除</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    imgLoadError = (e: any) => {
        this.setState({ isImageBroken: true });
    }

    handleDragEnter = (e: any) => {
        e.preventDefault();
    }

    handleDragOver = (e: any) => {
        e.preventDefault();
    }

    handleDrop = async (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        const files = e.dataTransfer.files; // 获取文件
        this.uploadFiles(files[0]);
    }

    handleFileInputChange = (e: any) => {
        const files = e.target.files;
        this.uploadFiles(files[0]);
    }

    handleUploadImage = () => {
        const uploadBtn: any = document.querySelector(`#${this.state.fileInputId}`);
        uploadBtn && uploadBtn.click();
    }

    handleDeleteImage = () => {
        this.props.changeUrl('');
    }

    handleInputKeyUp = (e: any) => {
        const keyCode = window.event ? e.keyCode : e.which;
        keyCode === 13 && e.target.blur();
    }

    handleChangeImageUrl = () => {
        this.props.changeUrl(this.state.urlValue);
    }

    changeUrlValue = (e: any) => {
        this.setState({ urlValue: e.target.value });
    }

    uploadFiles = async (file: File) => {
        const { token } = this.props;
        const uploader = createOssUploader(
            'OSS',
            token,
            token.imagePosition,
            { types: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', '.ico'] }
        );

        this.setState({ isUploading: true });
        try {
            const res: any = await uploader.upload(file);
            this.props.changeUrl(res.sourceLink);
        } catch (err) {
            console.log(err);
        }
        this.setState({ isUploading: false });
    }

    uploaderHover = () => {
        this.setState({ uploadBtnVisible: !this.state.uploadBtnVisible });
    }

    uploaderLeave = () => {
        this.setState({ uploadBtnVisible: false });
    }
}

export default ImageUploader;
