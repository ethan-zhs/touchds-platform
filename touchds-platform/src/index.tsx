'use strict';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '@babel/polyfill';

import Routes from './routes/index';

class App extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
        // console.log(this);
    }
    render() {
        return (
            <Routes />
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
