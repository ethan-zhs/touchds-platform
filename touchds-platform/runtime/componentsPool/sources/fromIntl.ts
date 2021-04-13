import * as R from 'ramda';
import ISourceFromType, {ListMetaComponents} from './ISourceFrom.type';
import imageBase from '../../intl/imageBase';
import textBase from '../../intl/textBase';
import debugBase from '../../intl/debugBase';

const listComponents = [
    imageBase as any,
    textBase as any,
    debugBase as any
];

async function fetchListComponentsMeta(): Promise<ListMetaComponents> {
    return listComponents;
}

async function loadComponentBy(key: string, version: string = 'latest'): Promise<void> {
    const item = R.find(R.propEq('name', key), listComponents);
    item && item.define();
    return void 0;
}

// tslint:disable-next-line:no-object-literal-type-assertion
export default ({
    namespace: 'fromIntl',
    fetchListComponentsMeta,
    loadComponentBy
}) as ISourceFromType;
