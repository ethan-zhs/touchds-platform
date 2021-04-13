import * as React from 'react';
import { Tooltip } from 'antd';

const classNames = require('classnames');
const styles = require('./index.less');

interface IIconButtonProps {
    theme?: string;
    title: string;
    placement?: 'top' | 'left' | 'right' | 'bottom' | 'bottomRight' | 'bottomLeft'| 'topLeft'| 'topRight';
}

class IconButton extends React.Component<IIconButtonProps, any> {
    constructor(props: IIconButtonProps) {
        super(props);
    }

    render() {
        const { title, children, placement, theme = 'default' } = this.props;

        return (
            <Tooltip
                title={title}
                placement={placement || 'bottom'}
                overlayClassName={classNames({
                    [styles['tooltip-com']]: theme === 'default',
                    [styles['tooltip-com1']]: theme === 'theme1'
                })}
            >
                {children}
            </Tooltip>
        );
    }
}

export default IconButton;
