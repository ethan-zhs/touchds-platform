class Demo {
    constructor(container, config) {
        this.container = container
        this.config = config
    }

    render(data, config) {
        this.container.innerHTML = data
        console.log(data, config)
    }

    updateConfig(config) {
        console.log(config)
    }

    destory() {
        console.log(1111)
    }
}

window.Demo = Demo

// export default Demo
