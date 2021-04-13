import React from 'react';
import Iframe from '../components/Iframe';

export default class PreviewWrapperPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    componentWillMount() {
        // console.log('PreviewPage', this.props);
    }
    render() {
        const { idHash } = this.props.match.params;

        if (!idHash) {
            // TODO: 提示并且跳转返回或关闭窗口
            return null;
        }

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <Iframe
                    scrolling={true}
                    width={'100%'}
                    height={'100%'}
                    src={`/index.preview.html#${idHash}`}
                />
            </div>
        );
    }
}
