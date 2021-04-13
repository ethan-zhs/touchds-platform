import * as React from 'react';
import { observer } from 'mobx-react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { History } from 'history';

import CommonModal from '../../components/Gui/CommonModal';

import Store from './store';

const queryString = require('query-string');
const classNames = require('classnames');
const styles = require('./index.less');

interface IProps extends FormComponentProps {
    store: Store;
    location: Location;
    history: History;
}

@observer
class ProjectPage extends React.Component<IProps, any> {
    static defaultProps = {
        store: new Store()
    };

    constructor(props: IProps) {
        super(props);
        this.state = {
            previewHeight: 0,
            previewWidth: 0
        };
    }

    componentDidMount = () => {
        this.props.store.getTemplateList();

        window.addEventListener('resize', () => {
            const previewElem: any = document.querySelector(`.${styles['preview-img']}`);
            const { offsetWidth, offsetHeight } = previewElem;
            this.resizePreview(offsetWidth || window.innerWidth, offsetHeight || window.innerHeight);
        });
    }

    render() {
        const { templateList, templateId } = this.props.store;
        const { previewHeight, previewWidth } = this.state;

        const currTemplate: any = templateList.find((item: any) => item.id === templateId) || {};

        return (
            <div className={styles['create-screen']}>
                <div className={styles['top-bar']}>
                    <div className={styles['skew-decorator']} />
                    <div className={styles['cancel-btn']} onClick={this.cancelCreate}>
                        <span>取消创建</span>
                    </div>
                </div>
                <div className={styles['creator-wp']}>
                    <div className={styles['template-list']}>
                        <div className={styles['template-selector']}>
                            {templateList.map((item: any, index: number) => (
                                <a
                                    key={index}
                                    onClick={() => this.handleSelectTemplate(item.id)}
                                    className={classNames({
                                        [styles['selected']]: item.id === templateId,
                                        [styles['template-selector-item']]: true
                                    })}
                                >
                                    <div className={styles['template-content-wp']}>
                                        <div className={styles['template-thumbnail-wp']}>
                                            <img className={styles['template-thumbnail']} src={item.thumbnail} alt='template-thumbnail' />
                                        </div>
                                        <div className={styles['template-desc']}>
                                            <div className={styles['desc-name']}>
                                                <div className={styles['name-text']}>{item.name}</div>
                                                <i
                                                    className={classNames({
                                                        [styles['right-arrow']]: true,
                                                        [styles['arrow-hide']]: item.id !== templateId
                                                    })}
                                                />
                                            </div>
                                            <div className={styles['desc-info']}>
                                                <p>{item.size_width}</p>
                                                <p>{item.size_height}</p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className={styles['template-preview']}>
                        <div className={styles['preview-title']}>选则模板</div>
                        <div className={styles['preview-content']}>
                            <div className={styles['preview-wrapper']} style={{ height: previewHeight, width: previewWidth }}>
                                <div className={styles['preview-img-wp']}>
                                    {this.imgPreload(currTemplate.snapshot)}
                                    <img
                                        className={styles['preview-img']}
                                        src={currTemplate.snapshot}
                                        alt='snapshot'
                                    />
                                    <div className={styles['preview-img-mask']}>
                                        <CommonModal
                                            form={this.props.form}
                                            footer={{ ok: { text: '创建' } }}
                                            onOk={this.createScreen}
                                            modalProps={{
                                                title: '创建数据大屏',
                                                width: 417
                                            }}
                                            modalContent={this.renderModalContent}
                                        >
                                            <button
                                                className={styles['create-button']}
                                            >
                                                <span>创建</span>
                                            </button>
                                        </CommonModal>
                                    </div>
                                </div>

                                <div className={styles['preview-info']}>
                                    <div className={styles['preview-desc']}>{currTemplate.description}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderModalContent = () => {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={styles['form-item']}>
                <label>数据大屏名称</label>
                <Form.Item>
                    {getFieldDecorator('screenName', {
                        rules: [{ required: true, message: '请输入大屏名称' }]
                    })(
                        <input type='text' placeholder='请输入大屏名称' />
                    )}
                </Form.Item>
            </div>
        );
    }

    cancelCreate = () => {
        window.location.href = '/';
    }

    imgPreload = (url: string) => {
        if (url) {
            let img: any = new Image();
            img.src = url;
            img.onload = ((e: any) => {
                const { width, height } = e.target;
                this.resizePreview(width, height);
            });
            img = null;
        }
    }

    handleSelectTemplate = (id: number) => {
        this.props.store.changeTemplate(id);
    }

    resizePreview = (width: number, height: number) => {
        const contentElem: any = document.querySelector(`.${styles['preview-content']}`);
        const previewElem: any = document.querySelector(`.${styles['preview-wrapper']}`);

        const contentHeight = contentElem.offsetHeight - 30;
        const contentWidth = contentElem.offsetWidth;
        const descHeight = 30;

        let _previewHeight = 0;
        let _previewWidth = 0;

        if ((height + descHeight) / width  >= contentHeight / contentWidth) {
            _previewHeight = contentHeight;
            _previewWidth = (_previewHeight - descHeight) * width / height;
        } else {
            _previewWidth = contentWidth - 100;
            _previewHeight = _previewWidth * height / width;
        }

        previewElem.style.width = `${_previewWidth}px`;
        previewElem.style.height = `${_previewHeight}px`;
    }

    createScreen = async (fieldValues: any) => {
        const { location, history } = this.props;
        const { templateId } = this.props.store;
        const params = queryString.parse(location.search);

        const data: any = {
            name: fieldValues.screenName.trim(),
            project_id: params.project_id
        };

        params.group_id && (data.group_id = params.group_id);

        const res = await this.props.store.createScreen(data, templateId);

        if (res.data && res.data.id) {
            history.replace(`/screen/${res.data.id}`);
        }
    }
}

export default Form.create<IProps>()(ProjectPage);
