// @ts-ignore
import { action, observable, flow } from 'mobx';
import { callApi, apiPrefix } from '../../services/callApi';

export default class Store {
    @observable currGroupId: number = -1;
    @observable baseScreens: any = [];
    @observable userGroups: any = [];
    @observable screensList: any = [];
    @observable project: any = {};
    @observable isRequesting: boolean = false;

    /**
     *  [创建项目]
     *  @param {object} data - 项目数据对象
     */
    @action.bound
    createProject = flow(function* createProject(data: any) {
        this.isRequesting = true;
        try {
            const res: any = yield callApi(apiPrefix(`/v1/projects/create`), 'POST', data);
            this.projectDetail = res || {};
            this.isRequesting = false;
        } catch (err) {
            this.isRequesting = false;
        }
    });

    @action
    changeGroup = function(groupId: number) {
        this.currGroupId = groupId;

        // 筛选大屏列表
        if (this.currGroupId === -1) {
            this.screensList = this.baseScreens;
        } else if (this.currGroupId === 0) {
            this.screensList = this.baseScreens.filter((item: any) => !item.groupId);
        } else {
            this.screensList = this.baseScreens.filter((item: any) => item.groupId === this.currGroupId);
        }
    };

    /**
     *  [创建分组]
     *  @param {object} data - 分组数据对象
     */
    @action.bound
    createUserGroup = flow(function* createUserGroup(data: any) {
        this.isRequesting = true;
        try {
            const res: any = yield callApi(apiPrefix(`/v1/scope-group/create`), 'POST', data);
            this.projectDetail = res || {};
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
