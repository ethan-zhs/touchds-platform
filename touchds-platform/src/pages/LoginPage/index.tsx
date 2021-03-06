import * as React from 'react';
import { Tabs, Button, Spin, message } from 'antd';
import FormFieldsType0 from '@itouchtv/react-components-crud/es6/FormFieldsType0';

import classNames from 'classnames/bind';
import Store from './store';
import accountStore from '@global/accountStore';

const imgDecal01New = require('./assets/decal-01-new.png');
const imgDecal02New = require('./assets/decal-02-new.png');

const classNamesStyles = classNames.bind(require('./index.less'));

const ENUM_STATE_FLAG = {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER'
};

const {
    renderCol1,
    fieldInput
} = FormFieldsType0;

const FieldInput = fieldInput(renderCol1(1));

class LoginPage extends React.Component<any, any> {
    static defaultProps = {
        store: new Store(),
        accountStore: accountStore.instance
        // globalStore: new GlobalStore()
    };
    constructor(props: any) {
        super(props);
        this.state = {
            isLogining: false,
            stateFlag: ENUM_STATE_FLAG.LOGIN
        };
    }
    render() {
        const {
            isLogining
        } = this.state;

        return (
            <div className={classNamesStyles('page-login', 'version2')} style={{ position: 'relative' }}>
                <img
                    className={classNamesStyles('decal')}
                    alt={''}
                    src={imgDecal02New}
                    style={{
                        position: 'absolute',
                        top: '60%',
                        left: '12%',
                        width: 173,
                        height: 200
                    }}
                />
                <img
                    className={classNamesStyles('decal')}
                    alt={''}
                    src={imgDecal01New}
                    style={{
                        position: 'absolute',
                        top: '10%',
                        right: '12%',
                        width: 140 * 0.8,
                        height: 30 * 0.8
                    }}
                />
                <div className={classNamesStyles('wrap-login-panel')}>
                    <h2 className={classNamesStyles('content-page-title')}>Touchtv????????????</h2>
                    <div className={classNamesStyles('panel')}>
                        <Spin spinning={isLogining}>
                            <Tabs defaultActiveKey={ENUM_STATE_FLAG.LOGIN}>
                                <Tabs.TabPane tab='??????' key={ENUM_STATE_FLAG.LOGIN}>
                                    <FormFieldsType0
                                        onSubmit={async (formFields: any) => {
                                            try {
                                                await this.props.store.accountLogin(formFields);
                                                await this.props.accountStore.fetchMySelf();
                                                message.success(`????????????, ${formFields.account}`);
                                                this.props.history.replace('/');
                                            } catch (error) {
                                                console.error(error);
                                                message.error('????????????');
                                            }
                                        }}
                                        defaultComponentFieldItem={FieldInput}
                                        styleCol={{ marginBottom: 10 }}
                                        className={classNamesStyles('form-login')}
                                        formFieldsSource={[
                                            [
                                                [null, 'account', { placeholder: '??????????????????' }]
                                            ],
                                            [
                                                [null, 'password', {
                                                    type: 'password',
                                                    placeholder: '???????????????',
                                                    styleCol: { marginBottom: 18 }
                                                }]
                                            ]
                                        ]}
                                        renderFooter={({ emitSubmit }: any) => {
                                            return (
                                                <Button
                                                    onClick={emitSubmit}
                                                    size={'large'}
                                                    type={'primary'}
                                                    htmlType='submit'
                                                    className={classNamesStyles('btn-login')}
                                                >??????
                                                </Button>
                                            );
                                        }}
                                    />
                                </Tabs.TabPane>
                                <Tabs.TabPane tab='??????' key={ENUM_STATE_FLAG.REGISTER}>
                                    <FormFieldsType0
                                        onSubmit={async (formFields: any) => {
                                            try {
                                                await this.props.store.accountRegister(formFields);
                                                await this.props.accountStore.fetchMySelf();
                                                message.success(`????????????, ${formFields.account}`);
                                                this.props.history.replace('/');
                                            } catch (error) {
                                                console.error(error);
                                                message.error('????????????');
                                            }
                                        }}
                                        defaultComponentFieldItem={FieldInput}
                                        styleCol={{ marginBottom: 10 }}
                                        className={classNamesStyles('form-login')}
                                        formFieldsSource={[
                                            [
                                                [null, 'account', { placeholder: '??????????????????' }]
                                            ],
                                            [
                                                [null, 'passwordNew', {
                                                    type: 'password',
                                                    placeholder: '??????????????????'
                                                }]
                                            ],
                                            [
                                                [null, 'passwordDoubleConfirm', ({ form }: any) => {
                                                    return {
                                                        styleCol: { marginBottom: 20 },
                                                        type: 'password',
                                                        placeholder: '?????????????????????',
                                                        rules: [
                                                            {
                                                                validator: (rule: any, value: any, callback: any) => {
                                                                    if (value !== form.getFieldValue('passwordNew')) {
                                                                        callback('???????????????????????????');
                                                                    }
                                                                    callback();
                                                                }
                                                            }
                                                        ]
                                                    };
                                                }]
                                            ]
                                        ]}
                                        renderFooter={({ emitSubmit }: any) => {
                                            return (
                                                <Button
                                                    onClick={emitSubmit}
                                                    size={'large'}
                                                    type={'primary'}
                                                    htmlType='submit'
                                                    className={classNamesStyles('btn-login')}
                                                >??????
                                                </Button>
                                            );
                                        }}
                                    />
                                </Tabs.TabPane>
                            </Tabs>
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginPage;
