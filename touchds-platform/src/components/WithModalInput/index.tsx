import React from 'react';
import WrapModalConfirmWithForm from '@itouchtv/react-components-crud/next/WithAnModalWithForm';
import InputWithSoftMaxLength from '@itouchtv/react-components-crud/es6/InputWithSoftMaxLength';
import { Button, Form } from 'antd';

const classNamesCommonStyles = require('classnames/bind').bind(require('./index.less'));

function getClassNameValueLength({ valueLength, maxLength }: any) {
    if (valueLength === 0) {
        return '';
    }
    if (valueLength > maxLength) {
        return classNamesCommonStyles('color-red');
    }
    if (valueLength === maxLength) {
        return classNamesCommonStyles('color-yellow');
    }
    return '';
}

export default class extends React.Component<any, any> {
    render() {
        const {
            modalProps,
            renderTrigger,
            onShouldShowModalWithData = ({ showModal, resetFields }: any) => {
                resetFields();
                showModal();
            },
            renderContentModal = ({ nodeTextAreaField }: any) => (
                <Form.Item
                    style={{ marginBottom: -10 }}
                    wrapperCol={{ span: 24 }}
                >
                    {nodeTextAreaField}
                </Form.Item>
            ),
            onOk,
            placeholder,
            initialValue,
            maxLength = 500,
            textCancel = '取消',
            textOk = '确定',
            required
        } = this.props as any;
        return (
            <WrapModalConfirmWithForm
                modalProps={{
                    destroyOnClose: true,
                    ...modalProps
                }}
                renderTrigger={renderTrigger}
                onOk={onOk}
                onShouldShowModalWithData={onShouldShowModalWithData}
                renderModalContent={({ form }: any) => {
                    const value = form.getFieldValue('value');
                    const nodeTextAreaField = form.getFieldDecorator('value', {
                        initialValue,
                        rules: [
                            {
                                max: maxLength,
                                message: `不能超过${maxLength}个字`
                            },
                            ...required ? [
                                {
                                    required: true,
                                    message: placeholder
                                }
                            ] : []
                        ]
                    })(
                        <InputWithSoftMaxLength
                            maxLength={maxLength}
                            placeholder={placeholder}
                            getClassNameValueLength={getClassNameValueLength}
                        />
                    );
                    return renderContentModal({ nodeTextAreaField });
                }}
                renderFooter={({ form, isWaitingClose, emitOnClickCancel, emitOnClickOk }: any) => {
                    const value = form.getFieldValue('value');
                    return (
                        <div>
                            <Button
                                style={{ marginLeft: 8 }}
                                loading={isWaitingClose}
                                onClick={emitOnClickCancel}
                                type={'danger'}
                            >
                                <span>{textCancel}</span>
                            </Button>
                            <Button
                                type={'primary'}
                                style={{ marginLeft: 8 }}
                                loading={isWaitingClose}
                                onClick={emitOnClickOk}
                                disabled={value?.length > maxLength}
                            >
                                <span>{textOk}</span>
                            </Button>
                        </div>
                    );
                }}
            />
        );
    }
}
