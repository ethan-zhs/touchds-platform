/**
 * Created by tommyZZM.OSX on 2019/12/17.
 */

const KEY = '--debug-base';

const VERSION = '0.1.0';

function tryStringify(input: any) {
    try {
        return JSON.stringify(input);
    } catch (error) {
        return error.message;
    }
}

export async function define() {
    const { itouchtvDataPageDefineComponent } = (window as any);
    itouchtvDataPageDefineComponent(KEY, {
        version: VERSION
    }, async function({ React }: any) {
        return class extends React.Component<any, any> {
            render() {
                const { emit, envLocal } = this.props;
                // console.log(KEY, 'envLocal', envLocal)
                return (
                    <div>
                        <div>
                            <button
                                onClick={() => emit('setEnv', { debugCountAdd: 1 })}
                            >
                                debugCount + 1
                            </button>
                        </div>
                        <div style={{ color: '#c6c6c6' }}>
                             {tryStringify(envLocal)}
                        </div>
                    </div>
                );
            }
        };
    });
}

export default {
    name: KEY,
    nameComponent: 'debug',
    version: VERSION,
    typeComponent: 'others',
    categoryComponent: 'regular',
    initialProps: {},
    define
};
