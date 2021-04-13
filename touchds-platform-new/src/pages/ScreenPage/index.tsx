import React, { Component } from 'react'
import Ruler from '@components/Ruler'
import RuntimeIframe from '@src/components/IframeRuntime'

import styles from './index.less'

class ScreenPage extends Component {
    render() {
        return (
            <div className={styles['screen-wrapper']}>
                <div className={styles['screen-header']}>header</div>
                <div className={styles['screen-container']}>
                    <div className={styles['screen-layer']}>layer</div>
                    <div className={styles['screen-canvas-panel']}>
                        <div>
                            <div className={styles['runtime-iframe-wrapper']} style={{ width: 500, height: 300 }}>
                                <RuntimeIframe />
                            </div>

                            <Ruler
                                options={{
                                    scrollW: 1000,
                                    scrollH: 1000,
                                    percent: 100,
                                    lines: {},
                                    topRulerWidth: 1000,
                                    leftRulerWidth: 1000
                                }}
                                changeGuideLines={() => {
                                    console.log(1)
                                }}
                            />
                            <div className={styles['canvas-panel']} style={{ width: 500, height: 300 }}>
                                {/* panel */}
                            </div>
                        </div>
                    </div>
                    <div className={styles['screen-config']}>config</div>
                </div>
            </div>
        )
    }
}

export default ScreenPage
