import ISourceFrom, { ListMetaComponents } from './ISourceFrom.type';
import axios from 'axios';

declare global {
    interface Window {
        'ITOUCHTV_DATA_COMPONETS': any;
    }
}
async function loadScript(name: string, version: string) {
    const { data } = await axios.get(`http://localhost:3998/api/v1/com?name=${name}&version=${version}`);
    const { url } = data && data.data;
    if (data.code === 200 && url) {
        return new Promise((resolve, reject) => {
            let script: HTMLScriptElement | null = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            const onScriptComplete = (event: Event | any) => {
                console.log(event?.type);
                // @ts-ignore
                script.onload = script.onerror = null;
                clearTimeout(timeout);
                script = null;
                resolve();
            };
            const timeout = setTimeout(() => {
                script && document.body.removeChild(script);
                onScriptComplete({ type: 'timeout', target: script });
            }, 120000);
            script.onload = script.onerror = onScriptComplete;
            script.setAttribute('src', url);
            document.body.appendChild(script);
        });
    }
}

async function fetchListComponentsMeta(): Promise<ListMetaComponents> {
    const response = await axios.get(`http://localhost:3998/api/v1/com/all?r=` + (+ new Date()));
    const listResult = response?.data?.data || [];
    listResult.map((item: any) => {
        try {
            item.initialProps = JSON.parse(item.config)?.initialProps;
        } catch (e) {
            console.log(e);
        }
    });
    return listResult;
}

function getComponentDefineFunc(name: string, version: string) {
    const globalCdnComponents = window['ITOUCHTV_DATA_COMPONETS'];
    const func = globalCdnComponents && globalCdnComponents[`${name}_${version}`];
    return func && typeof func === 'function' ? func : void 0;
}

async function loadComponentBy(key: string, version: string = 'latest'): Promise<void> {
    try {
        await loadScript(key, version);
        const comsDefineFunc = getComponentDefineFunc(key, version);
        if (comsDefineFunc) {
            const {
                getComponentMeta,
                getComponentDefine,
                getEditorComponentDefine
            } = comsDefineFunc();
            const viewDefine = getComponentDefine;
            const editorDefine = getEditorComponentDefine;
            const config = getComponentMeta();
            (window as any).itouchtvDataPageDefineComponent(`${key}`, config, viewDefine, editorDefine);
        }
        return void 0;
    } catch (e) {
        console.log(e);
        return void 0;
    }
}

// tslint:disable-next-line:no-object-literal-type-assertion
export default ({
    namespace: 'fromCdn',
    fetchListComponentsMeta,
    loadComponentBy
}) as ISourceFrom;
