import * as R from 'ramda';
import React from 'react';
import { camelCase } from 'camel-case/dist';
import { Spin, Checkbox, Input, Button, Icon, Table, Form, Badge, Tooltip, message } from 'antd';
import WithAnModalWithForm from '@itouchtv/react-components-crud/next/WithAnModalWithForm/ts';
import copy from 'copy-to-clipboard';

const classNames = require('classnames/bind').bind(require('./WithModalPublish.less'));

const EditableContext = React.createContext({});

const EditableRow = ({ form, index, ...props }: any) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class MaybeEditableCell extends React.Component<any, any> {
    refInput: React.RefObject<any>;

    constructor(props: any) {
        super(props);
        this.state = {
            isEditing: false
        };
        this.refInput = React.createRef();
    }
    _save = () => (e: any) => {
        // ...
        this.setState({ isEditing: false });

        const { onSaveComment = () => null } = this.props;
        const value = e.target.value;
        onSaveComment(value);
    }
    _enableEdit = () => {
        // ...
        this.setState({ isEditing: true }, () => {
            this.refInput.current.focus();
        });
    }
    _renderCell = (form: any) => {
        const { isEditing } = this.state;
        const {
            dataIndex,
            record
        } = this.props;
        const placeholderOverwrited = record[camelCase(`placeholder-${dataIndex}`)];
        const {
            children,
            title,
            // tslint:disable-next-line:no-shadowed-variable
            renderContent = (children: any) => children,
            placeholder = R.isNil(placeholderOverwrited) ?
                `可输入${title}` : placeholderOverwrited
        } = this.props;
        const initialValue = record[dataIndex];

        return isEditing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        // {
                        //     required: true,
                        //     message: `必须填写${title}`
                        // }
                    ],
                    initialValue
                })(
                    <Input
                        ref={this.refInput}
                        placeholder={placeholder}
                        onPressEnter={this._save()}
                        onBlur={this._save()}
                    />
                )}
            </Form.Item>
        ) : (
            <div
                className={classNames('editable-cell-value-wrap', {
                    readonly: record.readonly
                })}
                style={{ paddingRight: 10 }}
                onClick={!record.readonly ? this._enableEdit : () => null}
            >
                {renderContent(
                    initialValue ? children : (
                        <span
                            className={classNames(
                                'editable-cell-value-placeholder'
                            )}
                        >
                            {placeholder}
                        </span>
                    ),
                    record
                )}
            </div>
        );
    }

    render() {
        const {
            editable,
            dataIndex,
            index,
            title,
            record,
            onSaveComment,
            children,
            // tslint:disable-next-line:no-shadowed-variable
            renderContent = (children: any) => children,
            ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {this._renderCell}
                    </EditableContext.Consumer>
                ) : (
                    renderContent(children, record)
                )}
            </td>
        );
    }
}

class TableSnapshot extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    render() {
        const {
            rowKey,
            selectedSnapshotKeys = [],
            onChangeSelectedSnapshotIndexs = () => null,
            onClickDeleteButton = () => null,
            onSaveComment = () => null
        } = this.props;
        return (
            <Table
                rowKey={rowKey}
                components={{
                    body: {
                        row: EditableFormRow,
                        cell: MaybeEditableCell
                    }
                }}
                rowClassName={() => 'editable-row'}
                bordered={false}
                showHeader={false}
                pagination={false}
                dataSource={this.props.dataSource}
                rowSelection={{
                    type: 'radio',
                    selectedRowKeys: selectedSnapshotKeys,
                    onChange: (selectedRowKeys, selectedRows) => {
                        onChangeSelectedSnapshotIndexs(selectedRowKeys, selectedRows);
                    }
                }}
                columns={[
                    {
                        title: '标题',
                        dataIndex: 'name',
                        editable: false
                    } as any,
                    {
                        title: '注释',
                        dataIndex: 'comment',
                        width: '30%',
                        editable: true
                    } as any,
                    {
                        title: '操作',
                        dataIndex: 'operations',
                        width: '5%',
                        render: (_: any, record: any) => {
                            return (
                                <Button
                                    onClick={() => onClickDeleteButton(record)}
                                    size={'small'}
                                    type={'danger'}
                                >
                                    <Icon type={'delete'}/>
                                </Button>
                            );
                        }
                    } as any
                ].map((col, index) => ({
                    ...col,
                    onCell: (record) => {
                        const {
                            [camelCase(`render-${col.dataIndex}`)]:
                                renderContent = (children: any) => children
                        } = record;

                        return ({
                            record,
                            index,
                            renderContent,
                            editable: col.editable,
                            dataIndex: col.dataIndex,
                            title: col.title,
                            onSaveComment: (value: any) => onSaveComment(value, record)
                        });
                    }
                }))}
            />
        );
    }
}

const ID_REAL_TIME = '$';

function assertSnapshotHash(hashNotNil: any) {
    if (!hashNotNil) {
        throw new TypeError('expect hash to be not nil');
    }
    if (hashNotNil === '$') { return null; }
    return hashNotNil;
}

export default class WithAnModalPublish extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isSelected: null,
            listSnapshotSelectable: [],
            storedPassingData: {},
            hasPasswordCurrent: false
        };
    }
    render() {
        const {
            getListSnapshotSelectable = () => ([]),
            getHashCurrent = () => null,
            onSaveCurrentConfigAsSnapshot = () => null,
            onClickOffline = () => null,
            onClickDelete = () => null,
            onSaveComment = () => null,
            // renderTrigger = () => null,
            onOk = () => null,
            screenDetailHash,
            children
        } = this.props;

        const {
            listSnapshotSelectable,
            isSelected,
            // hashCurrent,
            idCurrent
        } = this.state;

        const _handleClickOffline = (record: any) => async () => {
            await onClickOffline(assertSnapshotHash(record.id));
            this.setState({
                listSnapshotSelectable: await getListSnapshotSelectable()
            });
            // tslint:disable-next-line:no-shadowed-variable
            const { hash: hashCurrent, id: idCurrent } = await getHashCurrent();
            this.setState({ hashCurrent, idCurrent });
        };

        const _handleClickDelete = (record: any) => async () => {
            await onClickDelete(assertSnapshotHash(record.id));
            this.setState({
                listSnapshotSelectable: await getListSnapshotSelectable()
            });
            // tslint:disable-next-line:no-shadowed-variable
            const { hash: hashCurrent, id: idCurrent } = await getHashCurrent();
            this.setState({ hashCurrent, idCurrent });
        };

        return (
            <WithAnModalWithForm
                onShouldShowModalWithData={async ({ setFieldsValue, showModal }: any) => {
                    if (!screenDetailHash) {
                        message.error('当前大屏数据异常，缺少hash');
                        throw new Error('screen.id is nil!');
                    }

                    await showModal();

                    // tslint:disable-next-line:no-shadowed-variable
                    const listSnapshotSelectable = await getListSnapshotSelectable();
                    // tslint:disable-next-line:no-shadowed-variable
                    const { hash: hashCurrent, share_status, hasPassword, id: idCurrent } = await getHashCurrent();

                    if (hasPassword) {
                        setFieldsValue({ isUnlimited: false });
                    }

                    return new Promise((resolve) => {
                        this.setState({
                            isSelected: idCurrent,
                            hashCurrent,
                            idCurrent,
                            ...share_status === 'realtime' && {
                                isSelected: ID_REAL_TIME,
                                idCurrent: ID_REAL_TIME
                            },
                            listSnapshotSelectable
                        }, resolve);
                    });
                }}
                {...this.props}
                okButtonProps={{
                    disabled: !this.state.isSelected
                }}
                onOk={async (formFields: any, { resetFields }: any) => {
                    await onOk(assertSnapshotHash(this.state.isSelected), formFields);
                    return resetFields();
                }}
                onCancel={(_: any, { resetFields }: any) => {
                    return resetFields();
                }}
                modalProps={{
                    title: '发布',
                    centered: false,
                    width: 600
                }}
                renderModalContent={({ isWaiting, form, emitUpdateWith }: any) => {
                    const isUnlimited = form.getFieldValue('isUnlimited');
                    return (
                        <Spin spinning={isWaiting}>
                            <div className={classNames('modalContent')}>
                                <div className={classNames('rowTitle')}>分享链接</div>
                                <div className={classNames('rowFlex')}>
                                    <Input
                                        className={classNames('flexFill')}
                                        style={{}}
                                        value={location.origin + `/publish/${screenDetailHash}`}
                                        readOnly={true}
                                    />
                                    <Button
                                        style={{whiteSpace: 'nowrap'}}
                                        type={'primary'}
                                        onClick={() => {
                                            copy(location.origin + `/publish/${screenDetailHash}`);
                                            message.success('分享链接已复制');
                                        }}
                                    >
                                        复制
                                    </Button>
                                </div>
                                <div className={classNames('rowTitle')}>
                                    <span style={{marginRight: 10}}>访问限制</span>
                                    {form.getFieldDecorator('isUnlimited', {
                                        initialValue: true
                                    })(
                                        <Checkbox
                                            checked={isUnlimited}
                                            onChange={() => {
                                                form.resetFields();
                                            }}
                                        >
                                            无限制
                                        </Checkbox>
                                    )}
                                </div>
                                <div className={classNames('rowFlex')}>
                                    <div className={classNames('blockWrapper', 'flexFill')}>
                                        <Form.Item label={'密码'}>
                                            {form.getFieldDecorator('password', {
                                                rules: isUnlimited ?
                                                    [] : [{ required: true, message: '请输入密码' }]
                                            })(
                                                <Input
                                                    type={'password'}
                                                    disabled={isUnlimited}
                                                    {...!isUnlimited && {
                                                        placeholder: '请输入密码'
                                                    }}
                                                />
                                            )}
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className={classNames('rowTitle')}>
                                    <span style={{marginRight: 10}}>发布页面</span>
                                    <Button
                                        type={'primary'}
                                        onClick={emitUpdateWith(async () => {
                                            if (listSnapshotSelectable.length >= 2) {
                                                message.warn('你暂时最多可以保存2个快照', 6);
                                                throw Error('too many snapshot');
                                            }
                                            await onSaveCurrentConfigAsSnapshot();
                                            const listSnapshotSelectableNew = await getListSnapshotSelectable();
                                            this.setState({
                                                // isSelected: hashNew,
                                                listSnapshotSelectable: listSnapshotSelectableNew
                                            });
                                        })}
                                    >
                                        <Icon type={'save'}/>
                                        <span>保存当前时间为快照</span>
                                    </Button>
                                </div>
                                <div className={classNames('rowFlex')}>
                                    <div className={classNames('blockWrapper', 'flexFill')}>
                                        <TableSnapshot
                                            rowKey={(record: any) => record.id}
                                            selectedSnapshotKeys={[isSelected]}
                                            onChangeSelectedSnapshotIndexs={
                                                // tslint:disable-next-line:no-shadowed-variable
                                                (selectedSnapshotKeys: any) => {
                                                    // tslint:disable-next-line:no-shadowed-variable
                                                    const [ isSelected ] = selectedSnapshotKeys;
                                                    this.setState({
                                                        isSelected
                                                    });
                                                }
                                            }
                                            onClickDeleteButton={async (record: any) => {
                                                await emitUpdateWith(_handleClickDelete(record))();
                                            }}
                                            onSaveComment={async (value: any, record: any) => {
                                                await emitUpdateWith(async () => {
                                                    await onSaveComment(value, assertSnapshotHash(record.id));
                                                    const listSnapshotSelectableNew = await getListSnapshotSelectable();
                                                    this.setState({
                                                        // isSelected: hashNew,
                                                        listSnapshotSelectable: listSnapshotSelectableNew
                                                    });
                                                })();
                                            }}
                                            dataSource={[
                                                {
                                                    name: '实时屏幕',
                                                    id: ID_REAL_TIME,
                                                    readonly: true,
                                                    placeholderComment: '',
                                                    renderOperations: () => null
                                                },
                                                ...listSnapshotSelectable.map((item: any) => ({
                                                    ...item,
                                                    name: `${item.created_at} 快照`
                                                }))
                                            ].map((item: any) => ({
                                                ...item,
                                                renderName: (tuple: any) => {
                                                    const name = R.nth(2, tuple);
                                                    return (
                                                        <React.Fragment>
                                                            {name}
                                                            {item.id === idCurrent &&
                                                            <Badge style={{ marginLeft: 10 }} color={'green'}/>}
                                                        </React.Fragment>
                                                    );
                                                },
                                                renderOperations: (tuple: any, record: any) => {
                                                    const defaultOperations = R.nth(2, tuple);
                                                    if (item.id === idCurrent) {
                                                        return (
                                                            <Tooltip title={'下线'}>
                                                                <Button
                                                                    onClick={emitUpdateWith(
                                                                        _handleClickOffline(record)
                                                                    )}
                                                                    size={'small'}
                                                                    type={'danger'}
                                                                >
                                                                    <Icon type={'disconnect'}/>
                                                                </Button>
                                                            </Tooltip>
                                                        );
                                                    }
                                                    if (item.renderOperations) {
                                                        return item.renderOperations(defaultOperations);
                                                    }
                                                    return defaultOperations;
                                                }
                                            }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Spin>
                    );
                }}
            >
                {children}
            </WithAnModalWithForm>
        );
    }
}
