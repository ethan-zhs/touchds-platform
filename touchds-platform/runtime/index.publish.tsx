// TODO: Runtime单独的页面入口 for 预览
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import RuntimeContent from './RuntimeContent';

import '@babel/polyfill';
import 'antd/lib/message/style';
import 'antd/lib/modal/style';
import 'antd/lib/input/style';

import Spin from 'antd/lib/spin';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
import RuntimeContentWithPositioner from './RuntimeContentWithPositioner';
// import message from 'antd/lib/message';
import {apiPrefix, callApi} from '@service/callApi';

const classNames = require('./RuntimeContent.less');

class IndexPreview extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isModalPasswordVisible: false,
            configIntl: null,
            inputedPassword: null,
            isLoading: true
        };
    }

    _fetchScreenPublishReleased = async (payload: any = {}) => {
        this.setState({ isLoading: true });
        const screenHash = window.location.hash.substring(1);
        const response: any = await callApi(
            apiPrefix(`/v1/screen-release/get-released/${screenHash}`), 'POST', payload
        );
        // const config = JSON.parse(configRaw as string);
        this.setState({ configIntl: response.data });
        this.setState({ isLoading: false });
    }

    componentDidMount(): void {
        (async () => {
            // const configRaw = localStorage.getItem(`config_${hash}`);
            try {
                await this._fetchScreenPublishReleased();
                this.setState({ isModalPasswordVisible: false });
            } catch (error) {
                console.error(error);
                if (error.code === 403 && error.flag === 'password') {
                    this.setState({
                        isLoading: false,
                        isModalPasswordVisible: true
                    });
                } else {
                    message.error(`链接无效`, 600000);
                }
            }
        })();
    }

    _renderRuntimeContent = () => {
        const {
            configIntl
            // isModalPasswordVisible
        } = this.state;

        if (!configIntl) {
            return (
                <div style={{ width: '100%', height: '100%' }}>
                    <Spin size={'large'} className={classNames.spinFill}/>
                </div>
            );
        }

        return (
            <RuntimeContentWithPositioner
                config={configIntl}
            />
        );
    }

    _updatePassword = (e: any) => {
        this.setState({
            inputedPassword: e.target.value
        });
    }

    render() {
        const {
            isLoading,
            isModalPasswordVisible,
            inputedPassword
        } = this.state;

        return (
            <React.Fragment>
                {this._renderRuntimeContent()}
                <Modal
                    visible={isModalPasswordVisible}
                    title={'输入密码访问'}
                    closable={false}
                    maskClosable={false}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    onOk={async () => {
                        try {
                            await this._fetchScreenPublishReleased({
                                password: this.state.inputedPassword
                            });
                            this.setState({ isModalPasswordVisible: false });
                            message.success('验证通过');
                        } catch (error) {
                            if (error.code === 403 && error.flag === 'password') {
                                this.setState({ isLoading: false });
                                return message.error('密码不正确');
                            }
                            return message.error('请求未成功');
                        }
                    }}
                >
                    <Spin spinning={isLoading}>
                        <Input
                            type={'password'}
                            value={inputedPassword}
                            onChange={this._updatePassword}
                        />
                    </Spin>
                </Modal>
            </React.Fragment>
        );
    }
}

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<IndexPreview/>, document.getElementById('app'));
});
