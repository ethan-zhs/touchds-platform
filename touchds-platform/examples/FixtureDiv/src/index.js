/* Created by tommyZZM.OSX on 2019/12/23. */
"use strict";
import { name, version } from "../package.json"

function onDefineComponent() {
    window.itouchtvDataPageDefineComponent(
        name,
        { version },
        function ({ React, width, height, listenResize }) {
            return class extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        sizeWidth: width,
                        sizeHeight: height
                    };
                }
                componentDidMount() {
                    listenResize((rect) => {
                        this.setState({
                            sizeWidth: rect.width,
                            sizeHeight: rect.height
                        })
                    });
                }
                render() {
                    const {
                        sizeWidth,
                        sizeHeight
                    } = this.state;
                    return <div style={{ color: '#fff', fontSize: 20 }}>
                        {`<div/> from Verdaccio `+
                        `${sizeWidth.toFixed(0)} x ${sizeHeight.toFixed(0)}`}
                    </div>;
                }
            }
        }
    )
}

if (typeof window.itouchtvDataPageDefineComponent === 'function') {
    onDefineComponent();
} else {
    window.addEventListener('itouchtv-data-page-ready', _ => (onDefineComponent()));
}
