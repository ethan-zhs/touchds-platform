// @ts-ignore
import * as R from 'ramda';
import { action, observable, flow } from 'mobx';
// import md5 from '../../../lib/md5';
import configOp from './_configutils/index';
import { apiPrefix, callApi } from '@src/services/callApi';
import { MetaComponent } from '../../../runtime/componentsPool/sources/ISourceFrom.type';
import debounce from 'lodash.debounce';

'use strict';

const isCanUseCrypto = typeof crypto === 'object';

const isCanUseCryptoGetRandomValues = isCanUseCrypto && typeof crypto.getRandomValues === 'function';

const getRandomWithUnit8: any = isCanUseCryptoGetRandomValues ?
    () => crypto.getRandomValues(new Uint8Array(1))[0] :
    () => Math.round(Math.random() * 256);

function getUUID(): string {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        // tslint:disable-next-line:no-bitwise
        (c ^ getRandomWithUnit8() & 15 >> c / 4).toString(16)
    );
}

export default class Store {
    private static _instance: Store;
    @observable componentType: any = [];
    @observable screenDetail: any = {};
    @observable configDetail: any = {};
    @observable config: any = {};
    @observable layerAct: any = {
        selected: [],
        hovered: [],
        copied: [],
        focusId: '',
        contextMenu: {
            visible: false,
            x: 0,
            y: 0
        }
    };

    @observable panelVisible: string = localStorage.getItem('panel-visible') || 'layer,config';

    @action
    changePanelVisible = (type: string) => {
        const arr = this.panelVisible.split(',');
        const index = arr.indexOf(type);
        if (index >= 0) {
            arr.splice(index, 1);
        } else {
            arr.push(type);
        }
        this.panelVisible = arr.join(',');
        localStorage.setItem('panel-visible', this.panelVisible);
    }

    async getHashCurrentConfigOnline(payload: any = null) {
        const response: any = await callApi(
            apiPrefix(`/v1/screen-release/screen/${payload.screenId}/online`), 'GET', null
        );
        const responseData = response.data;
        return {
            hash: responseData.share_hash,
            share_status: responseData?.release?.share_status,
            id: responseData?.release?.id,
            hasPassword: responseData?.release && responseData?.release?.has_password
        };
    }

    async saveCurrentConfigAsSnapshot(payload: any = null) {
        const response: any = await callApi(
            apiPrefix(`/v1/screen-release/screen/${payload.screenId}/snapshot`), 'POST',
            { config: payload.config }
        );
        return response.hash;
    }

    async getListSnapshotSelectable(payload: any) {
        const response: any = await callApi(
            apiPrefix(`/v1/screen-release/screen/${payload.screenId}/snapshot/metas`), 'GET', null
        );
        return response.data;
    }

    async postPublishRelease(payload: any) {
        const { password } = payload;
        if (!payload.id) {
            const responseRealtime: any = await callApi(
                apiPrefix(`/v1/screen-release/release-realtime/${payload.screenId}`), 'POST', {
                    password
                }
            );
            return responseRealtime.id;
        }
        const response: any = await callApi(
            apiPrefix(`/v1/screen-release/release-snapshot/${payload.id}`), 'POST', {
                password
            }
        );
        return response.data;
    }

    async deletePublishRelease(payload: any) {
        await callApi(
            apiPrefix(`/v1/screen-release/un-release/${payload.screenId}`), 'DELETE', null
        );
    }

    async deletePublishSnapshot(payload: any) {
        await callApi(
            apiPrefix(`/v1/screen-release/snapshot/${payload.hash}`), 'DELETE', null
        );
    }

    async saveCommentOfSnapshot(payload: any) {
        await callApi(
            apiPrefix(`/v1/screen-release/snapshot/${payload.hash}/comment`), 'PUT', {
                comment: payload.comment
            }
        );
    }

    @action.bound
    getScreenDetail = flow(function* getScreenDetail(data: any) {
        this.isRequesting = true;
        try {
            const res: any = yield callApi(apiPrefix('/v1/screen'), 'GET', data);
            this.screenDetail = res.data ?? {};

            // 初始化config
            this.configDetail = this.screenDetail.config ?? {};

            const config = this.configDetail.json || {};
            this.config = config;

            if (Array.isArray(config.layerList)) {
                for (const layer of config.layerList) {
                    if (!config.layers[layer.id]) {
                        console.warn(`layer ${layer.id}`, layer, 'not defined in layers');
                    }
                }
            }

            this.isRequesting = false;
        } catch (err) {
            this.isRequesting = false;
        }
    });

    @action.bound
    changeLayerAct(data: any) {
        this.layerAct = configOp.layerActOp(this.layerAct, data);
    }

    @action.bound
    changeLayerConfig({key, data}: any) {
        // console.log('changeLayerConfig...', key, data);
        if (key === 'dataSource') {
            this.config = {
                ...this.config,
                dataSourceConfigRaw: data.dataSourceConfig
            };
        } else if (key.includes('lines')) {
            this.config = configOp.linesOp(this.config, data);
        } else if (key.includes('layers')) {
            this.config = configOp.layersOp(this.config, data);
        } else if (key.includes('layerList')) {
            this.config = configOp.layerListOp(this.config, data);
        } else if (key.includes('screen')) {
            this.config = configOp.screenOp(this.config, data);
        } else if (key.includes('preset')) {
            this.config = configOp.presetOp(this.config, data);
        }

        const config = { ...this.config };

        config.layerList = config.layerList.filter((layer: any) => {
            const hasThisLayer = !!config.layers[layer.id];
            return hasThisLayer;
        });

        this.updateScreenConfig({
            json: JSON.stringify(R.pick([
                'layers',
                'layerList',
                'dataSourceConfigRaw',
                'screenConfig',
                'lines'
            ], config))
        }, this.configDetail.id);
    }

    @action.bound
    updateScreenConfig = debounce(async function updateScreenConfig(data: any, configId: number) {
        this.isRequesting = true;
        try {
            await callApi(apiPrefix(`/v1/screen/config/${configId}`), 'PUT', data);
            this.isRequesting = false;
        } catch (err) {
            this.isRequesting = false;
        }
    }, 1000, { trailing: true });

    // 添加一个组件到新的Layer
    @action.bound
    addComponentAsLayer({ metaComponent, attr = {} }: { metaComponent: MetaComponent, attr: any } = {} as any) {
        const uuid: string = getUUID();
        const { layers = {}, layerList = [] } = this.config as any;
        if (R.has(uuid, layers) || R.find(R.propEq('id', uuid), layerList)) {
            throw Object.assign(Error(`unexpected uuid: ${uuid}`), { config: { ...this.config } });
        }

        const layer = {
            id: uuid,
            type: 'com',
            comName: metaComponent.name,
            version: metaComponent.version,
            alias: `新图层 ${metaComponent.nameComponent}`,
            attr,
            staticProps: {
                ...metaComponent.initialProps
            }
        };
        this.config = {
            ...this.config,
            layers: {
                ...layers,
                [uuid]: layer
            },
            layerList: [
                ...layerList,
                { id: uuid, type: 'com' }
            ]
        };
        this.layerAct = {
            ...this.layerAct,
            selected: [uuid]
        };
    }

    async getIdHashSaveConfig(config: any) {
        const response: any = await callApi(
            apiPrefix('/v1/screen-release/get-hash'), 'POST', { config }
        );
        return response.hash;
    }

    @action.bound
    async postSaveConfigForPreview(screenId: any) {
        const response: any = await callApi(apiPrefix(`/v1/screen-preview?screen_id=${screenId}`), 'POST', null);
        return response.hash;
    }

    @action.bound
    async getComponentType() {
        try {
            const response: any = await callApi(apiPrefix(`/v1/type/all`), 'GET', null);
            const serialize: any = {};
            const responseData = response && response.data as any[];
            const responseDataPatched = [
                ...responseData,
                {
                    id: -1,
                    parentId: 0,
                    iconName: 'others',
                    name: 'others',
                    cnName: '其他'
                },
                {
                    id: -1,
                    parentId: -1,
                    iconName: 'others',
                    name: 'others',
                    cnName: '其他'
                }
            ];
            (responseDataPatched).forEach(({ id, parentId, iconName, name, cnName }) => {
                if (!serialize[parentId]) {
                    serialize[parentId] = [];
                }
                const item = [name, cnName, iconName];
                serialize[parentId].push(parentId === 0 ? { [id]: item } : item);
            });
            const categories = serialize[0] || [];
            const typeParentIds = Object.keys(serialize).filter((i) => i !== '0');
            typeParentIds.forEach((item) => {
                const categoryIndex = categories.findIndex((i: { [key: string]: any[] }) => !!i[item]);
                if (categoryIndex >= 0) {
                    const _item = categories[categoryIndex][item];
                    _item && Array.isArray(_item) && _item.length >= 3 && (_item.push(serialize[item]));
                }
            });
            const categoriesFinal = [
                ...categories
            ];
            this.componentType = categoriesFinal.map((i: { [key: string]: any[] }) => {
                const valuelist = Object.values(i);
                return valuelist && Array.isArray(valuelist) && valuelist.length >= 1 ? valuelist[0] : [];
            });
        } catch (e) {
            console.log(e);
        }
    }

    @action.bound
    getReturnTemplateList = flow(function*() {
        const res: any =  yield callApi(apiPrefix('/v1/template'), 'GET');
        return res ?? [];
    });

    @action.bound
    createTemplate = flow(function*({ name }: any) {
        const config = { ...this.config };

        config.layerList = config.layerList.filter((layer: any) => {
            const hasThisLayer = !!config.layers[layer.id];
            return hasThisLayer;
        });

        yield callApi(apiPrefix('/v1/template/create'), 'POST', {
            name,
            size_width: R.path(['screenConfig', 'width'], config),
            size_height: R.path(['screenConfig', 'height'], config),
            json: JSON.stringify(R.pick([
                'layers',
                'layerList',
                'dataSourceConfigRaw',
                'screenConfig',
                'lines'
            ], config))
        });
    });

    static get instance(): Store {
        if (!this._instance) {
            this._instance = new Store();
            return this._instance;
        }
        return this._instance;
    }
}
