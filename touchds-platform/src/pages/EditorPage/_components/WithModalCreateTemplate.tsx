import React, { useState } from 'react';
import { Spin, Checkbox, Input, Button, Icon, Table, Form, Badge, Tooltip, message } from 'antd';
import WithAnModalWithForm from '@itouchtv/react-components-crud/next/WithAnModalWithForm/ts';
import WithModalInput from '@components/WithModalInput';
import Noop from '@components/Noop';

export default function WithModalConfirmCreateTemplate(props: any) {
    const {
        renderTrigger = () => null,
        getReturnTemplateList = () => [],
        onOkNew = () => null,
        onOkReplace = () => null
    } = props;

    const [state, setState] = useState({
        listOwnedTemplates: []
    });

    return (
        <WithAnModalWithForm
            modalProps={{ title: '保存模板' }}
            onShouldShowModalWithData={async ({ showModal }: any) => {
                await showModal();
                setState({
                    listOwnedTemplates: await getReturnTemplateList()
                });
            }}
            onOk={async ({ name, selectedTemplate }: any) => {
                if (!selectedTemplate) {
                    return onOkNew({ name });
                }
                return onOkReplace({ name, id: selectedTemplate.id });
            }}
            renderTrigger={renderTrigger}
            renderModalContent={({ form }: any) => {
                return (
                    <div>
                        {form.getFieldDecorator('name')(<Noop/>)}
                        {form.getFieldDecorator('selectedTemplate')(<Noop/>)}
                        <Table
                            showHeader={false}
                            columns={[
                                {
                                    title: '预览图',
                                    dataIndex: 'name',
                                    width: '20%',
                                    editable: false
                                } as any,
                                {
                                    title: '标题',
                                    dataIndex: 'comment',
                                    width: '75%',
                                    editable: true
                                } as any,
                                {
                                    title: '操作',
                                    dataIndex: 'operations',
                                    width: '5%'
                                }
                            ]}
                            dataSource={state.listOwnedTemplates}
                        />
                    </div>
                );
            }}
            renderFooter={(propsFooter: any) => {
                const {
                    isWaitingClose,
                    emitOnClickCancel,
                    emitOnClickOk,
                    form
                } = propsFooter;
                return (
                    <div>
                        <Button
                            loading={isWaitingClose}
                            onClick={emitOnClickCancel}
                            type={'danger'}
                            style={{ marginLeft: 8 }}
                        >
                            <span>取消</span>
                        </Button>
                        <WithModalInput
                            maxLength={10}
                            modalProps={{ title: '填写模板名称' }}
                            onOk={({ value }: any) => {
                                form.setFieldsValue({ name: value });
                                emitOnClickOk();
                            }}
                            renderTrigger={({ emitClick }: any) => {
                                return (
                                    <Button
                                        type={'primary'}
                                        loading={isWaitingClose}
                                        onClick={emitClick}
                                        style={{ marginLeft: 8 }}
                                    >
                                        <span>新建保存</span>
                                    </Button>
                                );
                            }}
                        />
                    </div>
                );
            }}
        />
    );
}
