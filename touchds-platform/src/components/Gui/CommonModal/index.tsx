import * as React from 'react';
import { Modal } from 'antd';

const styles = require('./index.less');

const renderWrapperDefault = ({ emitClick, children }: any) => (
    <div
        onClick={emitClick}
    >
        {children}
    </div>
);

class CommonModal extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            visible: false,
            isRemoveModal: false
        };
    }

    componentDidMount() {
        console.log(this.props.children);
    }

    static confirm = (options: any) => {
        Modal.confirm({
            okText: '确认',
            cancelText: '取消',
            content: '确认删除后将无法恢复',
            className: styles['common-modal'],
            ...options
        });
    }

    render() {
        const { visible, isRemoveModal } = this.state;
        const {
            children,
            modalProps,
            modalContent
        } = this.props;

        return (
            <React.Fragment>
                {renderWrapperDefault({
                    emitClick: this.onShowModal,
                    children
                })}
                {!isRemoveModal && (
                    <Modal
                        className={styles['common-modal']}
                        visible={visible}
                        onCancel={this.handleOnCancel}
                        {...modalProps}
                        footer={this.renderFooter()}
                        afterClose={this.onRemoveModal}
                    >
                        {modalContent()}
                    </Modal>
                )}
            </React.Fragment>
        );
    }

    onShowModal = () => {
        this.setState({
            isRemoveModal: false,
            visible: true
        });
    }

    onHideModal = () => {
        this.setState({
            visible: false
        });
    }

    onRemoveModal = () => {
        this.setState({
            isRemoveModal: true
        });
    }

    handleOnCancel = () => {
        this.onHideModal();
    }

    handleOnSubmit = () => {
        const { form } = this.props;
        form.validateFields(async (errors: any, values: any) => {
            if (!errors) {
                const fieldValues = form.getFieldsValue();
                await this.props.onOk(fieldValues).then(() => {
                    this.onHideModal();
                });
            }
        });
    }

    renderFooter = () => {
        const { footer = {}, isWaiting } = this.props;
        const { cancel = {}, ok = {} } = footer;
        const canclBtn = (
            <button
                key='cancel-btn'
                onClick={this.handleOnCancel}
                className={styles['cancel-button']}
                disabled={isWaiting}
            >
                {cancel.text ?? '取消'}
            </button>
        );

        const okBtn = (
            <button
                key='on-btn'
                onClick={this.handleOnSubmit}
                className={styles['theme-button']}
                disabled={isWaiting}
            >
                {ok.text ?? '创建'}
            </button>
        );

        let footerArr = [];

        if (!this.props.footer) {
            footerArr = [canclBtn, okBtn];
        } else {
            footer.cancel && footerArr.push(canclBtn);
            footer.ok && footerArr.push(okBtn);
        }

        return footerArr;
    }
}

export default CommonModal;
