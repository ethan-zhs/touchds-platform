import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';

const styles = require('./index.less');

const DEFINITION_DATA_SOURCE_RAW = `function () {
    return {}
}
`;

export default function(props: any) {
    const {
        currDataSourceConfig,
        onChangeDataSourceConfig = () => null
    } = props;
    return (
        <div
            className={styles['setting-panel-basic']}
            style={{ height: '100%' }}
        >
            <MonacoEditor
                width={'100%'}
                language={'javascript'}
                theme={'vs-dark'}
                value={currDataSourceConfig || DEFINITION_DATA_SOURCE_RAW}
                options={{
                    automaticLayout: true,
                    wordWrap: 'on'
                }}
                onChange={(next) => {
                    // TODO: 1) 检查
                    // console.log('MonacoEditor onChange', onChangeConfigDataSource);
                    onChangeDataSourceConfig(next);
                }}
            />
        </div>
    );
}
