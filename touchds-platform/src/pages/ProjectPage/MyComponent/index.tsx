import * as React from 'react';

const classNames = require('classnames');
const styles = require('./index.less');

class MyComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            type: 'favorite-fold'
        };
    }

    render() {
        const { type } = this.state;
        const navList = [
            { name: '组件收藏夹', type: 'favorite-fold', icon: 'icon-favorite-fold' },
            { name: '我的组件包', type: 'com-package', icon: 'icon-com-package' }
        ];

        return (
            <div className={styles['my-coms']}>
                <div className={styles['coms-main']}>
                    <div className={styles['main-right-nav']}>
                        {navList.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => this.changeNavType(item.type)}
                                className={classNames({
                                    [styles['nav-title']]: true,
                                    [styles['selected']]: item.type === type
                                })}
                            >
                                <a className={styles['link-title']}>
                                    <i className={`icon-font ${item.icon}`} />
                                    {item.name}
                                </a>
                            </div>
                        ))}
                    </div>
                    {type === 'favorite-fold' && this.renderFavoriteCom()}
                    {type === 'com-package' && this.renderComPackage()}
                </div>
            </div>
        );
    }

    renderFavoriteCom = () => {
        return (
            <div className={styles['favorite-com-list']}>
                <div className={styles['package-header']}>
                    <div className={styles['package-title']}>
                        <h2>组件管理</h2>
                        <span className={styles['color-bcc9d4']}>
                            <span className={styles['color-2483ff']}>0</span>
                            个/还可以创建
                            <span className={styles['color-2483ff']}>0</span>
                            个
                        </span>
                        <i className='icon-font icon-help' />
                        <a href='' className={styles['goto-workspace']}>管理组件收藏配额</a>
                    </div>
                </div>

                <div className={styles['list-main-package']}>
                    <div className={styles['favorite-empty']}>
                        <img className={styles['empty-img']} src='https://img.alicdn.com/tfs/TB18GkNkhnaK1RjSZFtXXbC2VXa-126-128.png' />
                        <span className={styles['tip']}>没有收藏组件</span>
                    </div>
                </div>
            </div>
        );

    }

    renderComPackage = () => {

        return (
            <div className={styles['main-package']}>
                <div className={styles['com-package-list']}>
                    <div className={styles['package-header']}>
                        <div className={styles['package-title']}>
                            <h2>我的组件包</h2>
                            <span className={styles['color-bcc9d4']}>
                                <span className={styles['color-2483ff']}>0</span>
                                个/还可以创建
                                <span className={styles['color-2483ff']}>0</span>
                                个
                            </span>
                        </div>
                        <div className={styles['header-manager']}>
                            <div className={styles['sort-type']}>
                                <span className={styles['sort-text']}>按修改时间排序</span>
                                <i className='icon-font icon-bottom' />
                            </div>
                        </div>
                    </div>

                    <div className={styles['list-main-package']}>
                        <div className={styles['my-package']}>
                            <div className={styles['new-package']}>
                                <div className={styles['add-new-package']}>
                                    <i className='icon-font icon-add' />
                                    <span className={styles['package-new']}>新建可视化</span>
                                </div>
                            </div>
                        </div>
                    </div>
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

export default MyComponent;
