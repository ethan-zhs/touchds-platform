// import { PermissionStore } from '@src/global/Permission';
import LayoutPageComponent from '../pages/Layout';
import LoginPageComponent from '../pages/LoginPage';
import ErrorPage from '../pages/ErrorPage';
import { createBrowserHistory, History } from 'history';

import * as React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import { getViewConfig } from './routeConfig';

interface IRoutesProps {
    permissionStore?: {};
}

interface IRoutesStates {
    loginedBefore: boolean;
    requesting: boolean;
}

export default class Routes extends React.Component<IRoutesProps, IRoutesStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            loginedBefore: !!localStorage._u,
            requesting: false
        };
    }

    componentDidMount() {
        console.log('mounted');
    }

    render() {
        const appHistory: History = createBrowserHistory({});

        // const permission = true;
        // const hasBeenLoggedIn = true;
        const { commonRoutes, publicRoutes } = getViewConfig();

        return (
            <Router history={appHistory}>
                <Switch>
                    <Route
                        path='/'
                        exact={true}
                        render={() => <Redirect to={'/project'}/>}
                    />
                    <Route
                        path='/login'
                        exact={true}
                        render={(props) => {
                            return <LoginPageComponent {...props}/>;
                            // return hasBeenLoggedIn ?
                            //     <Redirect to='/home' /> : <LoginPageComponent {...props}/>
                        }}
                    />
                    {
                        publicRoutes.map((item: any, index: any) => {
                            return (
                                <Route
                                    key={item.key}
                                    path={item.path}
                                    render={(props) => {
                                        return <item.component {...props} />;
                                    }}
                                    exact={item.exact}
                                />
                            );
                        })
                    }
                    <Route
                        path={'*'}
                        render={(props) => {
                            return (
                                <LayoutPageComponent {...props}>
                                    <Switch>
                                        {
                                            commonRoutes.map((item: any, index: any) => {
                                                return (
                                                    <Route
                                                        key={item.key}
                                                        path={item.path}
                                                        render={(_props) => {
                                                            return <item.component {..._props} />;
                                                        }}
                                                        exact={item.exact}
                                                    />
                                                );
                                            })
                                        }
                                        <Route component={ErrorPage} />
                                    </Switch>
                                </LayoutPageComponent>
                            );
                        }}
                    />
                </Switch>
            </Router>
        );
    }
}
