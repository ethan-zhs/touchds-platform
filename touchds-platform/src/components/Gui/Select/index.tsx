import * as React from 'react';
import { Select } from 'antd';

// const classNames = require('classnames');
// const styles = require('./index.less');

const Option = Select.Option;

interface ISelectProps {
    theme?: string;
    title: string;
    placement?: 'top' | 'left' | 'right' | 'bottom' | 'bottomRight' | 'bottomLeft'| 'topLeft'| 'topRight';
}

class CommonSelect extends React.Component<ISelectProps, any> {
    constructor(props: ISelectProps) {
        super(props);
    }

    render() {
        return (
            <Select>
                <Option />
            </Select>
        );
    }
}

export default CommonSelect;
