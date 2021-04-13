import { message } from 'antd';

import './index.less';

class DatatMessage {

    static success = (messgae: string, time?: number) => {
        message.success({
            content: messgae,
            duration: time ?? 1
        });
    }

    static error = (messgae: string, time?: number) => {
        message.warning({
            content: messgae,
            duration: time ?? 1
        });
    }
}

export default DatatMessage;
