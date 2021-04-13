import * as React from 'react';

const classNames = require('classnames');
const styles = require('./index.less');

class Tutorial extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            selectedType: 'text'
        };
    }

    render() {
        const { selectedType } = this.state;

        const tutorial = [
            {
                type: 'text',
                name: '文字教程',
                icon: 'icon-com-text',
                list: [
                    {
                        title: '入门教程',
                        list: [
                            {
                                imageUrl: 'https://img.alicdn.com/tfs/TB1zSJcoIIrBKNjSZK9XXagoVXa-680-510.png',
                                linkUrl: ''
                            },
                            {
                                imageUrl: 'https://img.alicdn.com/tfs/TB1LQKfbf9TBuNjy0FcXXbeiFXa-680-510.jpg',
                                linkUrl: ''
                            },
                            {
                                imageUrl: 'https://img.alicdn.com/tfs/TB1e6QuoaQoBKNjSZJnXXaw9VXa-680-510.png',
                                linkUrl: ''
                            }
                        ]
                    },
                    {
                        title: '进阶教程',
                        list: [
                            {
                                imageUrl: 'https://img.alicdn.com/tfs/TB16nB.bbSYBuNjSspiXXXNzpXa-680-510.png',
                                linkUrl: ''
                            },
                            {
                                imageUrl: 'https://img.alicdn.com/tfs/TB1gn3PomYTBKNjSZKbXXXJ8pXa-680-510.png',
                                linkUrl: ''
                            }
                        ]
                    }
                ]
            },
            {
                type: 'video',
                name: '视频教程',
                icon: 'icon-com-media',
                list: [
                    {
                        title: '入门教程',
                        list: [
                            {
                                imageUrl: 'https://img.alicdn.com/tfs/TB1wtTAbGSs3KVjSZPiXXcsiVXa-680-510.jpg',
                                linkUrl: ''
                            },
                            {
                                imageUrl: 'https://img.alicdn.com/tfs/TB1Aq6tbUGF3KVjSZFvXXb_nXXa-680-510.jpg',
                                linkUrl: ''
                            }
                        ]
                    }
                ]
            }
        ];

        const currTutorial: any = tutorial.find((item: any) => item.type === selectedType) || {};

        return (
            <div className={styles['my-case']}>
                <div className={styles['case-tab']}>
                    {tutorial.map((item: any, index: number) => (
                        <div
                            key={index}
                            onClick={() => this.changeTutorialType(item.type)}
                            className={classNames({
                                [styles['tab-main']]: true,
                                [styles['selected']]: item.type === selectedType
                            })}
                        >
                            <i className={`icon-font ${item.icon}`} />
                            {item.name}
                        </div>
                    ))}
                </div>

                <div className={styles['case-main']}>
                    <div className={styles['right-other']}>
                        <div className={styles['other']}>
                            <a className={styles['other-link']}>
                                <i className='icon-font icon-error' />
                                帮助文档
                            </a>
                        </div>
                        <div className={styles['other']}>
                            <a className={styles['other-link']}>
                                <i className='icon-font icon-error' />
                                常见问题
                            </a>
                        </div>
                    </div>

                    <div className={styles['case-context']}>
                        {currTutorial.list && currTutorial.list.map((item: any, index: number) => (
                            <div key={index}>
                                <div className={styles['case-title']}>{item.title}</div>
                                <div className={styles['context-case']}>
                                    {item.list && item.list.map((l: any, i: number) => (
                                        <div key={i} className={styles['case']}>
                                            <div className={styles['content-main']}>
                                                <img src={l.imageUrl} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    changeTutorialType = (type: string) => {
        this.setState({
            selectedType: type
        });
    }
}

export default Tutorial;
