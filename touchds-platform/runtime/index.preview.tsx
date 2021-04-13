// TODO: Runtime单独的页面入口 for 预览
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import RuntimeContent from './RuntimeContent';

import '@babel/polyfill';
import 'antd/lib/message/style';

import Spin from 'antd/lib/spin';
import message from 'antd/lib/message';
import RuntimeContentWithPositioner from './RuntimeContentWithPositioner';
// import message from 'antd/lib/message';
import {apiPrefix, callApi} from '@service/callApi';

const classNames = require('./RuntimeContent.less');

class IndexPreview extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            configIntl: null
        };
    }
    componentDidMount(): void {
        (async () => {
            const hash = window.location.hash.substring(1);
            // const configRaw = localStorage.getItem(`config_${hash}`);
            try {
                const response: any = await callApi(
                    apiPrefix(`/v1/screen-preview/${hash}`), 'GET', null
                );
                // const config = JSON.parse(configRaw as string);
                this.setState({ configIntl: response.data });
            } catch (error) {
                console.error(error);
                message.error(`找不到该预览，链接已过期`, 600000);
                localStorage.removeItem(`config_${hash}`);
            }
        })();
    }

    render() {
        const { configIntl } = this.state;

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
}

window.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<IndexPreview/>, document.getElementById('app'));
});
