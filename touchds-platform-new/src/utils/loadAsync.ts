/**
 * 异步加载script
 *
 * @param {String} url script url
 */
export function loadScript(url: string) {
    return new Promise(resolve => {
        const script = document.createElement('script')

        script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', url)
        script.onload = async res => {
            resolve(res)
        }

        document.head.appendChild(script)
    })
}
