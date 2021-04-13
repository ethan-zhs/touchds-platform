import * as React from 'react';

const classNames = require('classnames');
const styles = require('./index.less');

class MyDataSource extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            type: 'data-manage'
        };
    }

    render() {
        const { type } = this.state;

        const navList = [
            { name: '数据源管理', type: 'data-manage', icon: 'icon-my-data' },
            { name: '代码段管理', type: 'code-manage', icon: 'icon-data-config' }
        ];

        return (
            <div className={styles['my-data']}>
                <div className={styles['left-switch-list']}>
                    {navList.map((item: any, index: number) => (
                        <a
                            key={index}
                            onClick={() => this.changeNavType(item.type)}
                            className={classNames({
                                [styles['link-title']]: true,
                                [styles['selected']]: type === item.type
                            })}
                        >
                            <i className={`icon-font ${item.icon}`} />
                            {item.name}
                        </a>
                    ))}
                </div>

                {this.renderDataSource()}

            </div>
        );
    }

    renderDataSource = () => {
        const dataSourceList = [
            { id: '1', name: 'yuqing', time: '2019/10/10 上午10:38:14', sourceLogo: 'https://img.alicdn.com/tfs/TB1smF6zk9WBuNjSspeXXaz5VXa-367-70.png' },
            { id: '2', name: 'yuqing', time: '2019/10/10 上午10:38:14', sourceLogo: 'https://img.alicdn.com/tfs/TB1smF6zk9WBuNjSspeXXaz5VXa-367-70.png' }
        ];

        return (
            <div className={styles['ds-part']}>
                <div className={styles['data-title']}>
                    <div className={styles['title-right']}>
                        <div className={styles['search-drop']}>
                            <div className={styles['search-data']}>
                                <span>按类别筛选</span>
                                <i className='icon-font icon-bottom' />
                            </div>
                        </div>
                        <div className={styles['search-drop']}>
                            <div className={styles['search-data']}>
                                <span>按修改时间排序</span>
                                <i className='icon-font icon-bottom' />
                            </div>
                        </div>
                    </div>
                    <div className={styles['title-add']}>
                        <button className={styles['add-button']}>
                            <div className={styles['add-text']}>+ 添加数据</div>
                        </button>
                        <div className={styles['data-border']} />
                    </div>
                </div>
                <div className={styles['data-main']}>
                    {dataSourceList.map((item: any, index: number) => (
                        <div
                            key={index}
                            className={styles['main-storage']}
                        >
                            <div
                                className={styles['storage-type']}
                                style={{
                                    backgroundImage: `url(${item.sourceLogo})`
                                }}
                            />
                            <div className={styles['storage-operate']}>
                                <div className={styles['storage-edit']}>
                                    <i className='icon-font icon-edit' />
                                </div>
                                <div className={styles['storage-delete']}>
                                    <i className='icon-font icon-delete' />
                                </div>
                            </div>
                            <div className={styles['storage-info']}>
                                <div className={styles['info-name']}>{item.name}</div>
                                <div className={styles['info-time']}>{item.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    changeNavType = (type: string) => {
        this.setState({
            type
        });
    }
}

export default MyDataSource;
