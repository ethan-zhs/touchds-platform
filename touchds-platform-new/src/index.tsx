'use strict'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Routes from './routes'
import './statics/styles/font.less'
import './statics/styles/global.less'

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return <Routes />
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
