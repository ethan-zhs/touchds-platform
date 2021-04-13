import * as React from 'react'
import { createBrowserHistory, History } from 'history'
import { Redirect, Route, Router, Switch } from 'react-router-dom'

import routes from './mapRoutes'

export default class Routes extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        const appHistory: History = createBrowserHistory({})

        return (
            <Router history={appHistory}>
                <Switch>
                    <Route path="/" exact={true} render={() => <Redirect to={'/screen/1'} />} />

                    {routes.map((item: any) => {
                        return (
                            <Route
                                key={item.key}
                                path={item.path}
                                render={_props => {
                                    return <item.component {..._props} />
                                }}
                                exact={item.exact}
                            />
                        )
                    })}
                    <Redirect to={'/error'} />
                </Switch>
            </Router>
        )
    }
}
