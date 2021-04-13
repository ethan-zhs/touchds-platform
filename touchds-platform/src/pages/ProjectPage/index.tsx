import * as React from 'react';

import MyProject from './MyProject';
import MyDataSource from './MyDataSource';
import MyComponent from './MyComponent';
import Tutorial from './Tutorial';

const classNames = require('classnames');
const styles = require('./index.less');

class ProjectPage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            navKey: 'my-screen'
        };
    }

    componentDidMount() {
        this.changeHeaderBgByScroll();
    }

    render() {
        const { navKey } = this.state;
        const navList = [
            { name: '我的可视化', key: 'my-screen', icon: 'icon-screens' },
            { name: '我的数据', key: 'my-data', icon: 'icon-my-data' },
            { name: '我的组件', key: 'my-com', icon: 'icon-my-com' },
            { name: '教程', key: 'tutorial', icon: 'icon-tutorial' }
        ];

        return (
            <div className={styles['project-page']}>
                <div>
                    <div className={styles['datat-header']}/>
                    <div className={styles['datat-nav']}>
                        <div className={styles['header-img']}>
                            <div className={styles['nav-img']} style={{ backgroundImage: 'url(https://img.alicdn.com/tfs/TB1ykWbO3HqK1RjSZJnXXbNLpXa-2880-600.png)' }} />
                        </div>
                    </div>
                </div>

                <div className={styles['nav-main']}>
                    {navList.map((item: any, index: number) => (
                        <span key={index} className={styles['nav-span']}>
                            <a
                                onClick={() => this.changeNav(item.key)}
                                className={classNames({
                                    [styles['nav-link']]: true,
                                    [styles['nav-active']]: navKey === item.key
                                })}
                            >
                                <i className={`icon-font ${item.icon}`} />
                                {item.name}
                            </a>
                        </span>
                    ))}
                </div>
                <div className={styles['nav-shadow']} />
                <div className={styles['datat-main']}>
                    <div className={styles['datat-content']}>
                        {navKey === 'my-screen' && <MyProject />}
                        {navKey === 'my-data' && <MyDataSource />}
                        {navKey === 'my-com' && <MyComponent />}
                        {navKey === 'tutorial' && <Tutorial />}
                    </div>
                </div>
            </div>
        );
    }

    changeNav = (key: string) => {
        this.setState({
            navKey: key
        });
    }

    changeHeaderBgByScroll = () => {
        document.addEventListener('scroll', () => {
            const _nav: any = document.querySelector(`.${styles['nav-main']}`);
            const _h: any = document.querySelector(`.${styles['datat-header']}`);
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 250) {
                _nav.style.background = 'rgb(23, 27, 34)';
                _h.style.background = 'rgb(23, 27, 34)';
            } else {
                _nav.style = {};
                _h.style = {};
            }
        });
    }
}

export default ProjectPage;
