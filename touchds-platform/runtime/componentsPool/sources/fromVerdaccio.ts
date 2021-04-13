/**
 * Created by tommyZZM.OSX on 2019/12/23.
 */
import path from 'path';
import * as R from 'ramda';
import axios from 'axios';
import {fs as fsMem} from 'memfs';
import { Buffer } from 'buffer/';
import ISourceFromType, {ListMetaComponents} from './ISourceFrom.type';
import gunzip from '../../../lib/gunzip-maybe.js';
import tar from 'tar-stream';
import merge2 from 'merge2';
import through2 from 'through2';
import mkidrp from 'mkdirp-promise';

const VERDACCIO_HOST = 'http://192.168.31.69:8888';

async function fetchListComponentsMeta(): Promise<ListMetaComponents> {
    const response = await axios.get(`${VERDACCIO_HOST}/-/verdaccio/packages`);
    const listResult = response.data;

    const listComponents = R.pipe(
        // @ts-ignore
        R.filter(R.prop('isDataPageComponent')),
        R.map((item) => ({
            type: 'other',
            ...R.pick(['name', 'nameComponent', 'version', 'typeComponent', 'categoryComponent'], item)
        }))
    )(listResult);

    // ...
    return listComponents;
}

/**
 * 下载verdaccio上的压缩包，并且保存到虚拟文件目录下并解压，读取分析文件
 * @param key
 * @param version
 */
async function loadComponentBy(key: string, version: string = 'latest'): Promise<void> {
    const response = await axios.get(`${VERDACCIO_HOST}/${key}/${version}`);
    const { data } = response as any;
    const { tarball } = data.dist as any;

    const responseTarball = await axios.get(tarball, {
        responseType: 'arraybuffer'
    });

    const fileNameTarball = path.basename(tarball);

    fsMem.writeFileSync(fileNameTarball, Buffer.from(responseTarball.data));

    const read = fsMem.createReadStream(fileNameTarball);

    read.pause();

    const processExtract = read.pipe(gunzip()).pipe(tar.extract());

    const PATH_DIR_TO_EXTRACT = './_';

    const PATH_PACKAGE = path.join(PATH_DIR_TO_EXTRACT, './package');

    const PATH_PACKAGE_JSON = path.join(PATH_PACKAGE, './package.json');

    const merged = merge2([], { end: false });

    processExtract.on('entry', async function(header: any, stream: any, next: any) {
        const fileNameHeader = path.join(PATH_DIR_TO_EXTRACT, header.name);
        await mkidrp(path.dirname(fileNameHeader), { fs: fsMem as any });
        // tslint:disable-next-line:no-shadowed-variable
        const writeMiddle = through2();
        const write = writeMiddle.pipe(fsMem.createWriteStream(fileNameHeader));
        stream.pipe(writeMiddle);
        merged.add(writeMiddle);
        stream.on('end', async function() {
            write.on('finish', () => {
                next();
            });
        });
        stream.resume();
    });

    const objJson: any = await new Promise((resolve, reject) => {
        processExtract.on('finish', function() {
            try {
                const bufJson = fsMem.readFileSync(PATH_PACKAGE_JSON);
                resolve(JSON.parse(bufJson.toString()));
            } catch (error) {
                reject(error);
            }
        });

        read.resume();
    });

    const entryScript = fsMem.readFileSync(path.join(PATH_PACKAGE, objJson.browser || objJson.module));

    // tslint:disable-next-line:ban no-eval
    eval(entryScript.toString() as string);

    return void 0;
}

// tslint:disable-next-line:no-object-literal-type-assertion
export default ({
    namespace: 'fromVerdaccio',
    fetchListComponentsMeta,
    loadComponentBy
}) as ISourceFromType;
