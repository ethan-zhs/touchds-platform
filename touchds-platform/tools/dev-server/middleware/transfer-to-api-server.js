/* Created by tommyZZM.OSX on 2020/1/3. */
"use strict";
import delay from 'delay'
import { fork } from 'child_process'
import chokidar from 'chokidar';
import proxy from 'koa-better-http-proxy';
import log from 'fancy-log';
import chalk from 'chalk';
import debounce from 'lodash.debounce'

// 转发接口到 server/ 服务, 并且侦听文件改动，自动重启刷新
export default (options) => {
    const {
        globWatch,
        pathToEntry,
        port,
        hostIp = '127.0.0.1',
        silent = false
    } = options;

    const host = `http://${hostIp}:${port}`;

    const watcher = chokidar.watch(globWatch, {
        persistent: false,
        interval: 1000,
        binaryInterval: 1500,
        usePolling: true
    });

    let lastChild = null;

    function _reStartChild() {
        if (!lastChild) {
            lastChild = fork(pathToEntry, [`-p=${port}`], { silent });
            log(chalk.green(`API Server ${host} started`))
            return void 0;
        }
        let currentChild = lastChild;
        if (currentChild.killed || !currentChild.connected) {
            lastChild = fork(pathToEntry, [`-p=${port}`], { silent })
            log(chalk.yellow(`API Server ${host} restarted`))
            currentChild.kill();
        } else {
            currentChild.once('exit', () => {
                lastChild = fork(pathToEntry, [`-p=${port}`], { silent })
                log(chalk.yellow(`API Server ${host} restarted`))
            })
            currentChild.kill();
        }
    }

    watcher.on('change', debounce(() => _reStartChild(), 1000));

    _reStartChild();

    const middlewareProxy = proxy(host, {
        preserveReqSession: true
    });

    return async function (ctx, next) {
        let timesAwaitLastChild = 0;
        while (!lastChild && timesAwaitLastChild <= 3) {
            await delay(100);
            timesAwaitLastChild = timesAwaitLastChild + 1;
        }
        if (!lastChild) {
            throw new Error(`${host} not ready`);
        }
        await middlewareProxy(ctx);
    }
}
