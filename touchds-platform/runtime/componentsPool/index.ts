/**
 * Created by tommyZZM.OSX on 2019/12/17.
 */
import sourcesFromIntl from './sources/fromIntl';
// import sourcesFromVerdaccio from './sources/fromVerdaccio';
import sourcesFromCdn from './sources/fromCdn';
import * as R from 'ramda';
import React from 'react';
import ISourceFromType from './sources/ISourceFrom.type';
import delay from 'delay';

const sourcesPool: Array<ISourceFromType> = [
    sourcesFromIntl,
    // sourcesFromVerdaccio,
    sourcesFromCdn
];

let isReady = false;

const mappingKeyToComponentUsing: any = {};

type IComponentDefine = (ctx: any) => ((props: any) => HTMLElement) | React.ComponentClass;

let isLoadingComponent: boolean = false;
let versionComponentLoading: string | null = null;

async function _getComponentDefineByKeyProcess(componentKey: string, version = 'latest') {
    // console.log('_getComponentDefineByKeyProcess', componentKey, version)
    // 0) 如果已经加载过组件就不需要重复加载
    const componentInfo = mappingKeyToComponentUsing[componentKey];
    if (componentInfo && componentInfo.version === version) {
        return void 0;
    }
    // 1) 如果有组件正在加载，需要等待上个组件加载完成，再逐个加载, 因为(2)所以需要逐个加载
    if (isLoadingComponent) {
        while (isLoadingComponent) {
            await delay(50);
        }
    }
    isLoadingComponent = true;
    // 这次正在加载组件的版本，注意这个是一个全作用域的变量
    // 2) 因为组件会回传的meta并不可控，所以只能够通过这个变量来记录正确的加载version
    versionComponentLoading = version;
    for (const source of sourcesPool) {
        if (mappingKeyToComponentUsing[componentKey]) {
            break;
        }
        try {
            await source.loadComponentBy(componentKey, version);
        } catch (error) {
            // ...
        }
    }
    // console.log('_getComponentDefineByKeyProcess finish', componentKey, version)
    isLoadingComponent = false;
    versionComponentLoading = null;
    return void 0;
}

function itouchtvDataPageDefineComponent(
    componentKey: string, // 组件的key
    componentMeta: any, // 组件的元数据配置，版本号，组件的类型，支持哪些设置项等等
    componentDefine: IComponentDefine // 定义一只组件
) {
    if (mappingKeyToComponentUsing[componentKey]) {
        // TODO: warning duplicated component
    }

    mappingKeyToComponentUsing[componentKey] = {
        componentKey,
        componentMeta,
        componentDefine,
        version: versionComponentLoading // 保存实际加载的组件version
    };
}

export interface IComponentPool {
    getComponentDefineByKey: (componentKey: string) => Promise<IComponentDefine>;
    getAllComponentMetaAsPairs: () => Promise<[string, any]>;
}

function _mayGetReady() {
    if (isReady) {
        return;
    }

    // 外部的组件，通过这个全局方法注册和定义
    (window as any).itouchtvDataPageDefineComponent = itouchtvDataPageDefineComponent;

    // 外部的组件，通过这个全局事件来判断Runtime是否已经加载，加载后才注册定义组件
    window.dispatchEvent(Object.assign(new Event('itouchtv-data-page-ready'), {
        itouchtvDataPageDefineComponent
    }));

    isReady = true;
}

const mappingKeyToComponentsMeta = {};

// 加载所有的组件的元数据列表
async function _transformListComponentsMeta() {
    for (const source of sourcesPool) {
        try {
            const list = await source.fetchListComponentsMeta();
            for (const item of list) {
                Object.assign(mappingKeyToComponentsMeta, {
                    [item.name]: item
                });
            }
        } catch (error) {
            console.warn(`source:${source.namespace} load failed`);
            console.error(error);
        }
    }
}

// 加载单个组件
async function getComponentDefineByKey(componentKey: string, version = 'latest'): Promise<any> {
    await _getComponentDefineByKeyProcess(componentKey, version);
    // @ts-ignore
    const { componentDefine } = mappingKeyToComponentUsing[componentKey];
    return componentDefine;
}

// 获取所有组件的元数据配置，用于返回给编辑器使用
async function getAllComponentMetaAsPairs(): Promise<[string, any]> {
    return R.toPairs(mappingKeyToComponentsMeta) as any;
}

export async function getInstance(): Promise<IComponentPool> {
    _mayGetReady();

    // 1) 加载组件列表
    // 2) 加载组件列表中的组件
    await _transformListComponentsMeta();

    return {
        getComponentDefineByKey,
        getAllComponentMetaAsPairs
    };
}
