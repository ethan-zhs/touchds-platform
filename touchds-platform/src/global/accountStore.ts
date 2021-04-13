import { action, observable, flow } from 'mobx';
import {apiPrefix, callApi} from '@service/callApi';

export default class AccountStore {
    private static _instance: AccountStore;
    @observable myUserName: number | null = null;
    @observable myUserId: number | null = null;

    static get instance(): AccountStore {
        if (!this._instance) {
            this._instance = new AccountStore();
            return this._instance;
        }
        return this._instance;
    }

    @action.bound
    fetchMySelf = flow(function*() {
        const res: any = yield callApi(apiPrefix('/v1/account/myself'), 'GET');
        this.myUserName = res.data.name;
        this.myUserId = res.data.id;
    });

    @action.bound
    logout = flow(function*() {
        const res: any = yield callApi(apiPrefix('/v1/account/logout'), 'POST');
        this.myUserName = null;
        this.myUserId = null;
    });
}
