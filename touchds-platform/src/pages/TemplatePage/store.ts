// @ts-ignore
import { action, observable, flow } from 'mobx';
import { callApi, apiPrefix } from '../../services/callApi';

export default class Store {
    @observable isRequesting: boolean = false;
    @observable templateId: number = 1;
    @observable templateList: any = [];

    /**
     *  创建大屏
     */
    @action
    changeTemplate = (tplId: number) => {
        this.templateId = tplId;
    }

    /**
     *  创建大屏
     */
    @action.bound
    createScreen = flow(function* createScreen(data: any, templateId: any) {
        this.isRequesting = true;
        try {
            // /v1/screens?templateId = xxx
            return yield callApi(apiPrefix(`/v1/screen`), 'POST', {
                ...data,
                ...templateId && {
                    template_id: templateId
                }
            });
            this.isRequesting = false;
        } catch (err) {
            this.isRequesting = false;
        }
    });

    /**
     *  获取模板列表
     */
    @action.bound
    getTemplateList = flow(function* getTemplateList() {
        this.isRequesting = true;
        try {
            const res: any =  yield callApi(apiPrefix('/v1/template'), 'GET');
            this.templateList = res ?? [];
            this.isRequesting = false;
        } catch (err) {
            this.isRequesting = false;
        }
    });

    private static _instance: Store;

    static get instance(): Store {
        if (!this._instance) {
            this._instance = new Store();
            return this._instance;
        }
        return this._instance;
    }
}
