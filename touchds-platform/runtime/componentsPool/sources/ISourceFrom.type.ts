
export interface MetaComponent {
    name: string;
    versions: Array<string>;
    version: string;
    thumbnail: string;
    nameComponent: string;
    typeComponent?: string;
    categoryComponent?: string;
    initialProps?: any; // 组件初始的属性值
}

export type ListMetaComponents = Array<MetaComponent>;

export type AsyncStep1FetchListComponentsMeta = () => Promise<ListMetaComponents>;

export type AsyncStep2LoadComponentBy = (key: string, version?: string | null | void) => Promise<void> | Promise<any>;

export default interface ISourceFromType {
    namespace?: string;
    fetchListComponentsMeta: AsyncStep1FetchListComponentsMeta;
    loadComponentBy: AsyncStep2LoadComponentBy;
}
