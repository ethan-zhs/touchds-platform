import * as R from 'ramda';
import * as React from 'react';
import { Spin, Tooltip, Icon } from 'antd';
import { observer } from 'mobx-react';
import 'antd/lib/style/index.less';
import '../../statics/style/global.less';
import '../../statics/style/font.less';
import accountStore from '@global/accountStore';
import { Redirect } from 'react-router-dom';

const styles = require('./index.less');

function IconSignOutRegular() {
    return <svg width='1em' height='1em' aria-hidden='true' focusable='false' data-prefix='far' data-icon='sign-out' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='currentColor' d='M96 64h84c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H96c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h84c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H96c-53 0-96-43-96-96V160c0-53 43-96 96-96zm231.1 19.5l-19.6 19.6c-4.8 4.8-4.7 12.5.2 17.1L420.8 230H172c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h248.8L307.7 391.7c-4.8 4.7-4.9 12.4-.2 17.1l19.6 19.6c4.7 4.7 12.3 4.7 17 0l164.4-164c4.7-4.7 4.7-12.3 0-17l-164.4-164c-4.7-4.6-12.3-4.6-17 .1z'/></svg>;
}

@observer
class Layout extends React.Component<any, any> {
    static defaultProps = {
        store: accountStore.instance
        // globalStore: new GlobalStore()
    };
    constructor(props: any) {
        super(props);
        this.state = {
            isFetchingMySelfInitial: true,
            hasBeenLoggedIn: false
        };
    }
    componentDidMount(): void {
        (async () => {
            try {
                this.setState({ isFetchingMySelfInitial: true });
                await this.props.store.fetchMySelf();
                this.setState({ isFetchingMySelfInitial: false });
            } catch (error) {
                console.log(error);
                this.props.history.replace('/login');
            }
        })();
    }
    logout = () => {
        this.props.store.logout();
    }
    render() {
        const {
            myUserName,
            myUserId
        } = this.props.store;

        const {
            isFetchingMySelfInitial
        } = this.state;

        if (R.isNil(myUserId) && !isFetchingMySelfInitial) {
            return <Redirect to='/login'/>;
        }

        return (
            <div className={styles['datat-layout']}>
                {/* <div className={styles['header']}>
                    <div className={styles['fill']}/>
                    <div style={{ display: 'inline-block' }}>你好{myUserName && `，${myUserName}` || ''}</div>
                    <Tooltip title={'安全登出'} placement={'bottom'}>
                        <span
                            style={{ paddingTop: 2 }}
                            className={styles['btn-logout']}
                            onClick={this.logout}
                        >
                            <Icon component={IconSignOutRegular}/>
                        </span>
                    </Tooltip>
                </div> */}
                <div className={styles['rest']}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Layout;
