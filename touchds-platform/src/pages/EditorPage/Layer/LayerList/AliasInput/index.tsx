import * as React from 'react';

const styles = require('./index.less');

interface IProps {
    currLayer: any;
    selectedLayers: any;
    changeLayerConfig: (data: any) => void;
    changeLayerFocus: (id: string) => void;
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
            e.target.blur();
        }
    }

    /**
     *  Alias 文本框内容修改
     *  @param {*} e 文本框目标对象
     *
     */
    aliasInputChange = (e: any) => {
        this.setState({
            currAliasValue: e.target.value.trim()
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
        const { selectedLayers, currLayer } = this.props;
        const value = this.state.currAliasValue.trim();

        // 不为空且不等于原来的值，执行修改
        if (value !== '' && currLayer.alias !== value) {
            this.props.changeLayerConfig({
                key: 'layers',
                data: {
                    opType: 'alias',
                    opLayers: selectedLayers,
                    val: value
                }
            });
        }
        this.props.changeLayerFocus('');
    }
}

export default AliasInput;
