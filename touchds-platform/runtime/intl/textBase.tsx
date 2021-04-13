/**
 * Created by tommyZZM.OSX on 2019/12/17.
 */

const KEY = '--text-base';

const VERSION = '0.1.0';

export async function define() {
    const { itouchtvDataPageDefineComponent } = (window as any);
    itouchtvDataPageDefineComponent(KEY, {
        version: VERSION
    }, async function({ React }: any) {
        return class extends React.Component<any, any> {
            render() {
                const {text, fontSize, color, textAlign} = this.props;
                return (
                    <div
                        style={{
                            color,
                            fontSize,
                            textAlign
                        }}
                    >
                        {text}
                    </div>
                );
            }
        };
    });
}

export default {
    name: KEY,
    nameComponent: '基础文本',
    version: VERSION,
    typeComponent: 'others',
    categoryComponent: 'regular',
    initialProps: {
        text: '新的文本',
        color: '#fff',
        fontSize: 20,
        textAlign: 'left'
    },
    define
};
