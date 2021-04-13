import * as React from 'react';

const styles = require('./index.less');

interface IProps {
    currLayer: any;
    selectedLayers: any;
    changeLayerConfig: any;
}

interface IState {
    currAliasValue: string;
}

class AliasInput extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            currAliasValue: ''
        };
    }

    componentDidMount() {
        this.focusInput();
    }

    render() {
        const { currAliasValue } = this.state;

        return (
            <input
                value={currAliasValue}
                className={styles['layer-alias-input']}
                onChange={this.aliasInputChange}
                onBlur={this.aliasInputBlur}
                onKeyUp={this.aliasInputKeyup}
                autoFocus={true}
            />
        );
    }

    /**
     *  按下Enter键修改alias
     *  @param {*} e 键盘对象
     *
     */
    aliasInputKeyup = (e: any) => {
        if (e.keyCode === 13) {
            this.aliasInputBlur();
        }
    }

    /**
     *  Alias 文本框内容修改
     *  @param {*} e 文本框目标对象
     *
     */
    aliasInputChange = (e: any) => {
        this.setState({
            currAliasValue: e.target.value.trimLeft().trimRight()
        });
    }

    /**
     *  Alias 文本框获得焦点
     *
     */
    focusInput = () => {
        this.setState({
            currAliasValue: this.props.currLayer.alias
        });
    }

    /**
     *  Alias 文本框失去焦点
     *
     */
    aliasInputBlur = () => {
        const { selectedLayers } = this.props;
        const value = this.state.currAliasValue;

        if (value.trim() !== '') {
            const currLayer = { ...this.props.currLayer };
            currLayer.alias = value;
            this.props.changeLayerConfig({
                key: 'layers',
                data: {
                    opType: 'alias',
                    opLayers: selectedLayers,
                    val: value
                }
            });
        }
    }
}

export default AliasInput;
