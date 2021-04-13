import * as R from 'ramda';
import delay from 'delay';
import EventEmitter from 'events';
import axios from 'axios';

import CTX from './ctx';

function* pollingTask(fn: any, pollingDelay: number) {
    while (true) {
        yield fn();
        if (Number.isFinite(pollingDelay)) {
            yield delay(pollingDelay);
        } else {
            break;
        }
    }
}

function createTaskChild(name: string, options: any, emit: any) {
    const {
        method = 'get',
        url = null,
        pollingDelay = false,
        getPayload = () => ({}),
        getHeaders = () => ({}),
        initialDelay = 1,
    } = options;

    // const emitter = new EventEmitter();

    let isRunning = false;

    return {
        async run() {
            if (isRunning) {
                return false;
            }
            await delay(initialDelay > 0 ? initialDelay : 1);
            const gen = pollingTask(async function () {
                try {
                    const response = await axios({
                        method,
                        url,
                        data: getPayload(),
                        headers: { ...getHeaders() }
                    });
                    emit(null, response.data);
                } catch (error) {
                    emit(error, null);
                }
            }, pollingDelay > 0 ? pollingDelay : Infinity);

            isRunning = true;

            if (url) {
                while (!await gen.next().done && isRunning) {
                    // noop...
                }
            }

            isRunning = false;

            return true;
        },
        async cancel() {
            if (!isRunning) {
                return false;
            }
            isRunning = false;
            return true;
        }
    }
}

export default function createTaskDataSource(tasksDefinition = {}, requirement: any) {
    const tasksDefinitionIntl = R.toPairs(tasksDefinition) as any;
    const {
        emit,
        env,
        envDataSource
    } = requirement;

    let isRunning = false;
    let allRunningTasks: readonly (any)[] = [];

    return {
        async runAll() {
            if (isRunning) {
                return false;
            }
            isRunning = true;
            allRunningTasks = tasksDefinitionIntl.map(([name, options = {}]: any) => {
                const {
                    getPayload = () => ({}),
                    getHeaders = () => ({}),
                } = options as any;
                return createTaskChild(name, {
                    ...options,
                    getPayload: () => {
                        return getPayload(CTX, env, envDataSource)
                    },
                    getHeaders: () => {
                        return getHeaders(CTX, env, envDataSource)
                    }
                }, (error: any, data: any) => {
                    if (error) {
                        return emit('setEnvDataSourceError', [name, error]);
                    }
                    return emit('setEnvDataSource', { [name]: data });
                });
            });

            for (const task of allRunningTasks) {
                await task.run();
            }

            return Promise.all(allRunningTasks);
        },
        async cancelAll() {
            for (const task of allRunningTasks) {
                await task.cancel();
            }
        }
    };
}
