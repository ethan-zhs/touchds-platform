import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';

const styles = require('./index.less');

const ENV_SETTER_RAW = `function (ctx, param) {
    return param
}
`;

const ENV_GETTER_RAW = `function (ctx, env, data) {
    return null
}
`;

function editorWillMount() {
    return void 0;
}

export default function(props: any) {
    const {
        // currEnvSetterRaw,
        // currEnvGetterRaw,
        onChangeEnvSetterRaw,
        onChangeEnvGetterRaw
    } = props;

    // const [state, setData] = useState({
    // } as any);

    return (
        <div
            className={styles['setting-panel-basic']}
            style={{ height: '100%' }}
        >
            <div className={styles['form-group']} style={{ height: '40%' }}>
                <strong style={{ color: '#fff', marginBottom: 5 }}>envSetter</strong>
                <MonacoEditor
                    width={'100%'}
                    language={'javascript'}
                    theme={'vs-dark'}
                    value={props.currEnvSetterRaw || ENV_SETTER_RAW}
                    options={{
                        automaticLayout: true,
                        wordWrap: 'on'
                    }}
                    onChange={(nextEnvSetterRaw) => {
                        // TODO: 1) 检查
                        onChangeEnvSetterRaw(nextEnvSetterRaw);
                    }}
                />
            </div>
            <div className={styles['form-group']} style={{ height: '40%' }}>
                <strong style={{ color: '#fff', marginBottom: 5 }}>envGetter</strong>
                <MonacoEditor
                    width={'100%'}
                    language={'javascript'}
                    theme={'vs-dark'}
                    value={props.currEnvGetterRaw || ENV_GETTER_RAW}
                    options={{
                        automaticLayout: true,
                        wordWrap: 'on'
                    }}
                    editorWillMount={editorWillMount}
                    onChange={(nextEnvGetterRaw) => {
                        // TODO: 同上
                        onChangeEnvGetterRaw(nextEnvGetterRaw);
                    }}
                />
            </div>
        </div>
    );
}
