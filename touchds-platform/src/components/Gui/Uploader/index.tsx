import * as React from 'react';
import { createOssUploader } from '../../../utils/uploaderUtils';

import './index.less';

interface IUploaderProps {
    token: any;
    accept?: string;
    key?: string;
    styles?: React.CSSProperties;
    changeUrl: (url: string, key?: string) => void;
    children: (isUploading: boolean) => void;
}

declare global {
    interface Window { ComposeOss: any; }
}

class Uploader extends React.Component<IUploaderProps, any> {
    constructor(props: IUploaderProps) {
        super(props);

        this.state = {
            fileInputId: `upload-input${Math.round(Math.random() * 100000)}`,
            isUploading: false
        };
    }

    render() {
        const { children, accept, styles } = this.props;
        const { fileInputId, isUploading } = this.state;

        return (
            <div className='datat-file-uploader' onClick={this.handleUploadImage} style={styles}>
                <input
                    accept={accept || 'image/png,image/jpeg,image/jpg,image/gif,.ico'}
                    type='file'
                    className='fileinput'
                    id={fileInputId}
                    onChange={this.handleFileInputChange}
                />
                {children(isUploading)}
            </div>
        );
    }

    handleFileInputChange = (e: any) => {
        const files = e.target.files;
        this.uploadFiles(files[0]);
    }

    handleUploadImage = () => {
        const uploadBtn: any = document.querySelector(`#${this.state.fileInputId}`);
        uploadBtn && uploadBtn.click();
    }

    uploadFiles = async (file: File) => {
        const { token, accept = 'image/png,image/jpeg,image/jpg,image/gif,.ico' } = this.props;
        const uploader = createOssUploader(
            'OSS',
            token,
            token.imagePosition,
            { types: accept.split(',') }
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
}

export default Uploader;
