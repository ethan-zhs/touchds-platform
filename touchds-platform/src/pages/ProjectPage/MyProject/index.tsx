import * as R from 'ramda';
import * as React from 'react';
import { observer } from 'mobx-react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';

import CommonModal from '../../../components/Gui/CommonModal';
import Message from '../../../components/Gui/Message';
import IconButton from '../../../components/Gui/IconButton';

import Store from './store';
import accountStore from '@global/accountStore';

const classNames = require('classnames');
const styles = require('./index.less');

// interface IProps extends FormComponentProps {
//     store: Store;
// }

@observer
class MyProject extends React.Component<any, any> {
    static defaultProps = {
        store: new Store(),
        accountStore: accountStore.instance
    };

    constructor(props: any) {
        super(props);
        this.state = {
            dragTarget: undefined,
            dragScreenId: -1,
            dropTargetId: -1,
            searchKey: ''
        };
    }

    async componentDidMount() {
        const withWorkspaceId = await this.props.store.ensureWorkSpace({
            // id: 1,
            name: 'newWorkSpace'
            // user_id: this.props.accountStore.myUserId
        });
        await this.props.store.getProject({
            workspace_id: withWorkspaceId.id
        });

        if (R.isNil(this.props.store.project)) {
            await this.props.store.createProject({
                // project_id: 1,
                name: 'newProject',
                // user_id: this.props.accountStore.myUserId,
                workspace_id: withWorkspaceId.id
            });
            await this.props.store.getProject({
                workspace_id: withWorkspaceId.id
            });
        }
    }

    _getProjectCurrent = async () => {
        await this.props.store.getProject({
            workspace_id: this.props.store.currentWorkspaceId
        });
    }

    render() {
        const {
            selectGroupId,
            baseScreens = [],
            screensList = [],
            userGroups = [],
            isRequesting
        } = this.props.store;

        const { dropTargetId = -1, searchKey } = this.state;

        // ???????????????????????????
        const noGroupLength = baseScreens.filter((item: any) => !item.groupId).length;

        // ??????????????????
        const screens = screensList.filter((item: any) => item.name.includes(searchKey));

        return (
            <div className={styles['my-project']}>
                <div className={styles['project-main']}>
                    <div className={styles['project-manage']}>
                        <div className={styles['manage-title']}>
                            <div className={styles['project-group']}>
                                <span>????????????</span>
                                <CommonModal
                                    form={this.props.form}
                                    onOk={this.createUserGroup}
                                    footer={{ ok: { text: '??????' } }}
                                    isWaiting={isRequesting}
                                    modalProps={{
                                        width: 417,
                                        title: '????????????'
                                    }}
                                    modalContent={this.renderModalContent}
                                >
                                    <i className='icon-font icon-zoom-in' />
                                </CommonModal>
                            </div>
                            <div
                                onClick={() => this.changeUserGroup(-1)}
                                className={classNames({
                                    [styles['my-project']]: true,
                                    [styles['group-selected']]: selectGroupId === -1
                                })}
                            >
                                <span className={styles['project-name']}>????????????</span>
                                <span className={styles['project-num']}>{baseScreens.length}</span>
                            </div>
                        </div>
                        <div className={styles['manage-main']}>
                            <div
                                onDragEnter={() => this.dragScreenEnter(0)}
                                className={classNames({
                                    [styles['main-project']]: true,
                                    [styles['group-selected']]: selectGroupId === 0 || dropTargetId === 0,
                                    [styles['draging-over']]: dropTargetId === 0
                                })}
                                onClick={() => this.changeUserGroup(0)}
                            >
                                <span className={styles['project-name']}>?????????</span>
                                <span className={styles['project-num']}>{noGroupLength}</span>
                            </div>
                            {userGroups.map((item: any, index: number) => this.renderUserGroup(item))}
                        </div>
                    </div>

                    <div className={styles['project-screen-list']}>
                        <div className={styles['project-header']}>
                            <div className={styles['project-title']}>
                                <h2>{this.getUserGroupNameById(selectGroupId)}</h2>
                                <span className={styles['color-bcc9d4']}>
                                    <span className={styles['color-2483ff']}>5</span>
                                    ???/???????????????
                                    <span className={styles['color-2483ff']}>35</span>
                                    ???
                                </span>
                                <i className='icon-font icon-help' />
                                <a href='' className={styles['goto-workspace']}>??????????????????</a>
                            </div>
                            <div className={styles['header-manager']}>
                                <div className={styles['search']}>
                                    <input
                                        className={styles['search-input']}
                                        placeholder='??????'
                                        value={searchKey}
                                        onChange={this.changeSearchInput}
                                    />
                                </div>
                                <i className='icon-font icon-sousuo' />
                                <div className={styles['sort-type']}>
                                    <span className={styles['sort-text']}>?????????????????????</span>
                                    <i className='icon-font icon-bottom' />
                                </div>
                            </div>
                        </div>

                        <div className={styles['main-screen']}>
                            <div className={styles['my-screen']}>
                                <div className={styles['new-project']} onClick={this.createScreen}>
                                    <div className={styles['add-new-screen']}>
                                        <i className='icon-font icon-add' />
                                        <span className={styles['span-spacing']}>???????????????</span>
                                    </div>
                                </div>
                            </div>
                            {screens.map((item: any) => this.renderScreenPanel(item))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderUserGroup = (item: any) => {
        const { selectGroupId, editGroupId } = this.props.store;
        const { dropTargetId = -1 } = this.state;

        if (editGroupId === item.id) {
            return (
                <div key={item.id + Math.random()} className={styles['group-edit']}>
                    <input
                        className={styles['edit-input']}
                        defaultValue={item.name}
                        onBlur={(e) => this.updateUserGroup(e, item)}
                        onKeyUp={this.inputKeyUp}
                        autoFocus={true}
                    />
                </div>
            );
        } else {
            return (
                <div
                    onClick={() => this.changeUserGroup(item.id)}
                    onDragEnter={() => this.dragScreenEnter(item.id)}
                    key={item.id}
                    className={classNames({
                        [styles['group-project']]: true,
                        [styles['group-selected']]: selectGroupId === item.id || dropTargetId === item.id,
                        [styles['draging-over']]: dropTargetId === item.id
                    })}
                >
                    <span className={styles['project-name']} title={item.name}>{item.name}</span>
                    <span className={styles['project-num']}>{item.screens.length}</span>
                    <div className={styles['group-op']}>
                        <i
                            className='icon-font icon-edit'
                            onClick={(e) => this.changeEditGroup(e, item.id)}
                        />
                        <i
                            className='icon-font icon-delete'
                            onClick={(e) => this.deleteUserGroup(e, item)}
                        />
                    </div>
                </div>
            );
        }
    }

    renderScreenPanel = (item: any) => {
        const {
            focusScreen,
            changeFocusScreen,
            changeFocusScreenName
        } = this.props.store;

        const STATUS: any = {
            0: { color: '#576369', name: '?????????'},
            1: { color: '#1fadf1', name: '?????????'}
        };

        const inputValue = focusScreen.id === item.id ? focusScreen.name : item.name;

        return (
            <div
                key={item.id}
                draggable={true}
                className={styles['my-screen']}
                onDragStart={this.dragScreenStart}
                onDragEnd={this.dragScreenEnd}
                onMouseDown={(e) => this.screenMouseDown(e, item.id)}
            >
                <div className={styles['screen']}>
                    <div className={styles['screen-info']}>
                        <div
                            className={classNames({
                                [styles['screen-img']]: true,
                                [styles['cover-default']]: !item.thumbnail
                            })}
                            style={{ backgroundImage: `url(${item.thumbnail})` }}
                        />
                        <div className={styles['screen-edit']}>
                            <div className={styles['screen-button']}>
                                <a href={`/screen/${item.id}`} className={styles['edit-button']} target='_blank'>
                                    <button>??????</button>
                                </a>
                                <div className={styles['main-button']}>
                                    <span className={styles['button-span']}>
                                        <IconButton title='??????' theme='theme1'>
                                            <i className='icon-font icon-move'/>
                                        </IconButton>
                                    </span>
                                    <span className={styles['button-span']} onClick={() => this.copyScreen(item.id)}>
                                        <IconButton title='??????' theme='theme1'>
                                            <i className='icon-font icon-copy-screen' />
                                        </IconButton>
                                    </span>
                                    <span className={styles['button-span']}>
                                        <IconButton title='??????' theme='theme1'>
                                            <i className='icon-font icon-transfer-screen' />
                                        </IconButton>
                                    </span>
                                    <span className={styles['button-span']} onClick={() => this.deleteScreen(item)}>
                                        <IconButton title='??????' theme='theme1'>
                                            <i className='icon-font icon-delete' />
                                        </IconButton>
                                    </span>
                                    <span className={styles['button-span']}>
                                        <IconButton title='?????????????????????' theme='theme1'>
                                            <i className='icon-font icon-to-workspace' />
                                        </IconButton>
                                    </span>
                                </div>
                            </div>
                            <a className={styles['node-setting']}>
                                <IconButton title='?????????????????????' theme='theme1'>
                                    <i className='icon-font icon-nodal' />
                                </IconButton>
                            </a>
                            <a className={styles['preview']}>
                                <IconButton title='??????' theme='theme1'>
                                    <i className='icon-font icon-preview' />
                                </IconButton>
                            </a>
                            <a className={styles['publish']}>
                                <IconButton title='??????' theme='theme1'>
                                    <i className='icon-font icon-publish' />
                                </IconButton>
                            </a>
                        </div>
                    </div>
                    <div className={styles['screen-main']}>
                        <div className={styles['main-name']}>
                            <div className={styles['screen-name-input']}>
                                <i className='icon-font icon-edit' />
                                <IconButton title={inputValue} placement='topLeft' theme='theme1'>
                                    <input
                                        type='text'
                                        value={inputValue}
                                        className={styles['input']}
                                        onFocus={() => changeFocusScreen(item.id)}
                                        onChange={(e) => changeFocusScreenName(e.target.value)}
                                        onBlur={(e) => this.updateScreen(e, item)}
                                        onKeyUp={this.inputKeyUp}
                                    />
                                </IconButton>
                            </div>
                            <div className={styles['publish-info']}>
                                <span
                                    className={styles['name-icon']}
                                    style={{
                                        backgroundColor: STATUS[item.share ? '1' : '0'].color
                                    }}
                                />
                                <span>{STATUS[item.share ? '1' : '0'].name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    changeSearchInput = (e: any) => {
        this.setState({
            searchKey: e.target.value
        });
    }

    renderModalContent = () => {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={styles['form-item']}>
                <label>??????????????????</label>
                <Form.Item>
                    {getFieldDecorator('groupName', {
                        rules: [
                            { required: true, message: '?????????????????????' }
                        ]
                    })(
                        <input type='text' placeholder='?????????????????????' />
                    )}
                </Form.Item>
            </div>
        );
    }

    getUserGroupNameById = (id: number) => {
        const { userGroups } = this.props.store;

        let _groupNames: any = {};
        userGroups.forEach((item: any) => {
            _groupNames[item.id.toString()] = item.name;
        });
        _groupNames = {
            '-1': '????????????',
            '0': '?????????',
            ..._groupNames
        };

        return _groupNames[id.toString()];
    }

    changeEditGroup = (e: any, groupId: number) => {
        e.stopPropagation();
        this.props.store.changeEditGroup(groupId);
    }

    changeUserGroup = async (id: number) => {
        // this.props.store.getProjects({
        //     workspaceId: 1
        // });
        await this._getProjectCurrent();
        await this.props.store.changeGroup(id);
    }

    inputKeyUp = (e: any) => {
        if (e.keyCode === 13) {
            e.target.blur();
        }
    }

    updateUserGroup = async (e: any, item: any) => {
        const { editGroupId } = this.props.store;
        let value = e.target.value ?? '';
        value = value.trim();

        if (value !== '' && value !== item.name) {
            try {
                await this.props.store.updateUserGroup({
                    name: value
                }, editGroupId);

                Message.success('????????????');
            } catch (err) {
                Message.error('????????????');
            }
        }

        await this.props.store.changeEditGroup(-1);
        // await this.props.store.getProjects({
        //     workspaceId: 1
        // });
        await this._getProjectCurrent();
    }

    createUserGroup = async (fieldValues: any) => {
        const { project } = this.props.store;
        await this.props.store.createUserGroup({
            name: fieldValues.groupName.trim(),
            project_id: project.id
        });

        // this.props.store.getProjects({
        //     workspaceId: 1
        // });
        await this._getProjectCurrent();
    }

    deleteUserGroup = (e: any, item: any) => {
        e.stopPropagation();
        CommonModal.confirm({
            title: `?????????????????? ${item.name}?`,
            onOk: async () => {
                try {
                    await this.props.store.deleteUserGroup(item.id);
                    // this.props.store.getProjects({
                    //     workspaceId: 1
                    // });
                    await this._getProjectCurrent();
                    Message.success('????????????');
                } catch (err) {
                    Message.error('????????????');
                }
            }
        });
    }

    createScreen = () => {
        const { project, selectGroupId } = this.props.store;
        let url = `/create-screen?project_id=${project.id}`;

        // ???????????????????????? / ?????????????????????????????????groupId
        if (selectGroupId !== -1 && selectGroupId !== 0) {
            url += `&group_id=${selectGroupId}`;
        }
        // window.open(url, '_blank');
        window.open(url, '_self');
    }

    deleteScreen = (item: any) => {
        CommonModal.confirm({
            title: `?????????????????? ${item.name}?`,
            onOk: async () => {
                try {
                    await this.props.store.deleteScreen(item.id);
                    // this.props.store.getProjects({
                    //     workspaceId: 1
                    // });
                    await this._getProjectCurrent();
                    Message.success('????????????');
                } catch (err) {
                    Message.error('????????????');
                }
            }
        });
    }

    updateScreen = async (e: any, item: any) => {
        let value = e.target.value ?? '';
        value = value.trim();

        // ??????????????????
        this.props.store.changeFocusScreen(-1);

        if (value !== '' && item.name !== value) {
            try {
                await this.props.store.updateScreen({
                    name: value
                }, item.id);
                Message.success('????????????');
            } catch (err) {
                Message.error('????????????');
            }
        }
    }

    copyScreen = async (screenId: number) => {
        await this.props.store.copyScreen(screenId);
        // this.props.store.getProjects({
        //     workspaceId: 1
        // });
        await this._getProjectCurrent();
    }

    screenMouseDown = (e: any, dragScreenId: any) => {
        this.setState({
            dragTarget: e.target,
            dragScreenId
        });
    }

    dragScreenStart = (e: any) => {
        const { dragTarget = {} } = this.state;

        // ??????????????????????????????????????????
        if (dragTarget.className && dragTarget.className.includes('icon-move')) {
            e.dataTransfer.setData('text/plain', 'handle');
        } else {
            e.preventDefault();
        }
    }

    dragScreenEnter = (groupId: any) => {
        this.setState({
            dropTargetId: groupId
        });
    }

    dragScreenEnd = async () => {
        const { dropTargetId, dragScreenId } = this.state;
        if (dropTargetId !== -1) {
            try {
                this.props.store.updateScreen({
                    groupId: dropTargetId !== 0 ? dropTargetId : null
                }, dragScreenId);
                Message.success('??????????????????');
            } catch (err) {
                Message.error('??????????????????');
            }
        }

        this.setState({
            dropTargetId: -1
        });
    }
}

export default Form.create<any>()(MyProject);
