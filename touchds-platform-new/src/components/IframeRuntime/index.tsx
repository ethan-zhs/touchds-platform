import React, { Component } from 'react'

import { loadScript } from '@utils/loadAsync'

import styles from './index.less'

class RuntimeIframe extends Component {
    componentDidMount() {
        loadScript('http://localhost:8080/demo.js').then(() => {
            const Demo = (window as any).Demo

            const d = new Demo(document.getElementById('iframe'))
            console.log(d)
            d.render('asdada', 2)
        })
    }

    render() {
        return (
            <div id="iframe" className={styles['runtime-iframe']}>
                iframe
            </div>
        )
    }
}
export default RuntimeIframe
