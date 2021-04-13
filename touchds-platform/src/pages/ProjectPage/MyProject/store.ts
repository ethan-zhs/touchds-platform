// @ts-ignore
import * as R from 'ramda';
import { action, observable, flow } from 'mobx';
import { callApi, apiPrefix } from '../../../services/callApi';

export default class Store {
    @observable currentWorkspaceId: number = -1;
    @observable editGroupId: number = -1;
    @observable selectGroupId: number = -1;
    @observable baseScreens: any = [];
    @observable userGroups: any = [];
    @observable screensList: any = [];
    @observable project: any = {};
    @observable focusScreen: any = {};
    @observable isRequesting: boolean = false;

    @action.bound
    ensureWorkSpace = flow(function*(withWorkspaceName) {
        const res = yield callApi(apiPrefix('/v1/workspace/ensure'), 'POST', withWorkspaceName);
        const withWorkspaceId = res.data;
        this.currentWorkspaceId = withWorkspaceId.id;
        return withWorkspaceId;
    });

    @action
    changeGroup = function(groupId: number) {
        this.selectGroupId = groupId;

        // 筛选大屏列表
        if (this.selectGroupId === -1) {
            this.screensList = this.baseScreens;
        } else if (this.selectGroupId === 0) {
            this.screensList = this.baseScreens.filter((item: any) => !item.groupId);
        } else {
            this.screensList = this.baseScreens.filter((item: any) => item.groupId === this.selectGroupId);
        }
    };

    @action
    changeFocusScreen = (screenId: number) => {
        this.focusScreen = this.screensList.find((item: any) => item.id === screenId) || {};
    }

    @action
    changeFocusScreenName = (value: string) => {
        this.focusScreen = { ...this.focusScreen, name: value };
    }

    @action
    changeEditGroup = function(groupId: number) {
        this.editGroupId = groupId;
    };

    /**
     *  删除大屏
     *  @param {number} screenId - 大屏id
     */
    @action.bound
    deleteScreen = flow(function* deleteScreen(screenId: number) {
        this.isRequesting = true;
        try {
            yield callApi(apiPrefix(`/v1/screen/${screenId}`), 'DELETE');
            this.isRequesting = false;
        } catch (err) {
            this.isRequesting = false;
            console.log(err);
            throw(err);
        }
    });

    /**
     *  拷贝大屏
     *  @param {number} screenId - 大屏id
     */
    @action.bound
    copyScreen = flow(function* copyScreen(screenId: number) {
        this.isRequesting = true;
        try {
            yield callApi(apiPrefix(`/v1/screen/copy/${screenId}`), 'POST');
            this.isRequesting = false;
        } catch (err) {
            this.isRequesting = false;
        }
    });

    /**
     *  更新大屏
     *  @param {number} data - 修改数据对象
     *  @param {number} screenId - 大屏id
     */
    @action.bound
    updateScreen = flow(function* updateScreen(data: any, screenId: number) {
        this.isRequesting = true;
        try {
            yield callApi(apiPrefix(`/v1/screen/${screenId}`), 'PUT', data);
            this.getProjects({
                workspaceId: 1
            });
            this.isRequesting = false;
        } catch (err) {
            this.isRequesting = false;
            console.log(err);
            throw(err);
        }
    });

    /**
     *  获取项目
     *  @param {object} data - 获得项目参数对象
     */
    @action.bound
    getProject = flow(function* getProject(withProjectId: any) {
        this.isRequesting = true;
        const res: any = yield callApi(apiPrefix('/v1/projects'), 'GET', withProjectId);
        const resDataHead = R.head(res.data);
        const project: any = resDataHead ?? null;
        const screens = project?.screens ?? [];
        const groups = project?.groups ?? [];

        // 用户分组添加screens
        groups.forEach((item: any) => {
            item.screens = screens.filter((s: any) => s.groupId === item.id);
        });
        this.userGroups = groups;
        this.baseScreens = screens;
        this.project = project;
        this.isRequesting = false;
        this.changeGroup(this.selectGroupId);
    });

    @action.bound
    createProject = flow(function* createProject(withWorkspaceId) {
        yield callApi(apiPrefix('/v1/projects/create'), 'POST', withWorkspaceId);
    });

    /**
     *  创建分组
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

    /**
     *  删除分组
     *  @param {number} groupId - 分组id
     */
    @action.bound
    deleteUserGroup = flow(function* deleteUserGroup(groupId: number) {
        this.isRequesting = true;
        try {
            yield callApi(apiPrefix(`/v1/scope-group/${groupId}`), 'DELETE');
            this.isRequesting = false;
        } catch (err) {
            this.isRequesting = false;
            console.log(err);
            throw(err);
        }
    });

    /**
     *  修改分组
     *  @param {object} data - 修改数据对象
     *  @param {number} groupId - 分组id
     */
    @action.bound
    updateUserGroup = flow(function* updateUserGroup(data: any, groupId: number) {
        this.isRequesting = true;
        // 预修改分组名
        this.userGroups = this.userGroups.map((item: any) => {
            if (item.id === groupId) {
                item.name = data.name;
            }
            return item;
        });

        try {
            yield callApi(apiPrefix(`/v1/scope-group/${groupId}`), 'PUT', data);
            this.isRequesting = false;
        } catch (err) {
            this.isRequesting = false;
            console.log(err);
            throw(err);
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
