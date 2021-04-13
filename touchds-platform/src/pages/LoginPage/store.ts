import { action, observable, flow } from 'mobx';
import {apiPrefix, callApi} from '@service/callApi';

export default class Store {
    private static _instance: Store;

    static get instance(): Store {
        if (!this._instance) {
            this._instance = new Store();
            return this._instance;
        }
        return this._instance;
    }

    @action.bound
    accountLogin = flow(function*({ account, password }) {
        yield callApi(apiPrefix('/v1/account/login'), 'POST', { account, password });
    });

    @action.bound
    accountRegister = flow(function*({ account, passwordDoubleConfirm }) {
        yield callApi(apiPrefix('/v1/account/register'), 'POST', { account, name: account, password: passwordDoubleConfirm });
    });
}
