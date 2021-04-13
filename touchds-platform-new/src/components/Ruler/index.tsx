import * as React from 'react'
import classNames from 'classnames'

import styles from './index.less'

interface IRulerProps {
    options: any
    changeGuideLines: (opdata: any) => void
}

class Ruler extends React.Component<IRulerProps, any> {
    constructor(props: IRulerProps) {
        super(props)

        this.state = {
            indicatorNum: 0,
            rulerType: 'none',
            showGuideLine: true,
            showIndicator: false,
            isDragging: false,
            dragIndex: -1,
            dragStartPos: 0,
            startLinePos: 0
        }
    }

    componentDidMount() {
        const showGuideLine = localStorage.getItem('showGuideLine') === '1'

        this.setState(
            {
                showGuideLine
            },
            () => {
                this.initRuler()
            }
        )
    }

    componentDidUpdate(prevProps: IRulerProps) {
        // 当百分比更新时需要重绘标尺
        if (this.props.options !== prevProps.options) {
            this.initRuler()
        }
    }

    render() {
        const { showGuideLine, showIndicator, indicatorNum, rulerType } = this.state

        const { scrollW, scrollH, percent, lines, topRulerWidth, leftRulerWidth } = this.props.options

        const rulerArr = [
            {
                type: 'h',
                scrollLength: scrollW,
                canvasWidth: topRulerWidth,
                lines: lines.h || []
            },
            {
                type: 'v',
                scrollLength: scrollH,
                canvasWidth: leftRulerWidth,
                lines: lines.v || []
            }
        ]

        return (
            <div className={styles['ruler']}>
                {rulerArr.map((ruler, rulerIndex) => (
                    <div
                        key={rulerIndex}
                        className={classNames({
                            [styles['ruler-wrapper']]: true,
                            [styles[`${ruler.type}-container`]]: true
                        })}
                        style={{
                            transform: `${ruler.type === 'v' ? 'rotate(90deg) ' : ''}
                            // translate(-${ruler.scrollLength}px)`
                        }}
                        onMouseLeave={this.rulerBlur}
                    >
                        <canvas
                            className="canvas-ruler"
                            width={ruler.canvasWidth}
                            style={{ width: `${ruler.canvasWidth}px` }}
                            onMouseEnter={e => this.rulerFocus(ruler.type, e.clientX, e.clientY)}
                        />

                        {showGuideLine && (
                            <div className={styles['lines-wrap']}>
                                {ruler.lines.map((item: any, index: number) => {
                                    const leftPos = Math.round((item * percent) / 100 + 40)
                                    return (
                                        <div
                                            title="双击删除参考线"
                                            key={index}
                                            className={styles['ruler-line']}
                                            style={{ left: `${leftPos}px` }}
                                            onMouseEnter={this.hideIndicator}
                                            onDoubleClick={e => this.deleteGuideLine(e, index, ruler.type)}
                                            onMouseDown={e => this.dragLineStart(e, index, ruler.type)}
                                        >
                                            <span>{item}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {showIndicator && rulerType === ruler.type && (
                            <div className={styles.indicator} onClick={this.addGuidLine}>
                                <span className={styles['indicator-tip']}>{indicatorNum}</span>
                            </div>
                        )}
                    </div>
                ))}

                <div className={styles['ruler-corner']} title="toggle guide lines" onClick={this.toggleGuideLines}>
                    <i className={`icon-font ${showGuideLine ? 'icon-line-show' : 'icon-line-hide'}`} />
                </div>
            </div>
        )
    }

    /**
     *  显示 / 隐藏参考线
     *
     */
    toggleGuideLines = () => {
        const { showGuideLine } = this.state
        this.setState(
            {
                showGuideLine: !showGuideLine
            },
            () => {
                localStorage.setItem('showGuideLine', !showGuideLine ? '1' : '0')
            }
        )
    }

    /**
     *  初始化标尺
     *  @param {percent} number 当前放大百分比
     *
     */
    initRuler = () => {
        const canvasArr = document.querySelectorAll('.canvas-ruler')
        const { percent = 100 } = this.props.options

        canvasArr.forEach((item: any) => {
            this.drawSingleRuler(
                item,
                {
                    rulerHeight: 20,
                    fontFamily: 'Microsoft YaHei',
                    fontSize: 11,
                    strokeStyle: '#3a4659',
                    fontColor: '#818f9c',
                    enableMouseTracking: true,
                    enableToolTip: true
                },
                percent
            )
        })
    }

    /**
     *  画单个标尺     *
     *  @param {currRuler} object 当前标尺
     *  @param {options} object 标尺参数
     *  @param {percent} number 当前放大百分比
     *
     */
    drawSingleRuler = (currRuler: any, options: any, percent: number) => {
        // 初始化标尺长度
        currRuler.height = options.rulerHeight
        const context = currRuler.getContext('2d')

        // 设置标尺显示属性
        context.fillStyle = options.fontColor
        context.strokeStyle = options.strokeStyle
        context.font = `${options.fontSize}px ${options.fontFamily}`
        context.lineWidth = 1
        context.beginPath()

        const rulerLength = currRuler.offsetWidth
        const rulThickness = options.rulerHeight

        const lineLengthMax = 0
        const lineLengthMid = rulThickness / 1.5
        const lineLengthMin = rulThickness / 1.15

        let baseLabel = 0
        let pointLength = 0
        let label = -1

        switch (true) {
            case percent < 10:
                baseLabel = 1600
                break
            case percent >= 10 && percent < 12:
                baseLabel = 1400
                break
            case percent >= 12 && percent < 14:
                baseLabel = 1200
                break
            case percent >= 14 && percent < 17:
                baseLabel = 1000
                break
            case percent >= 17 && percent < 35:
                baseLabel = 800
                break
            case percent >= 35 && percent < 52:
                baseLabel = 400
                break
            case percent >= 52 && percent < 88:
                baseLabel = 200
                break
            case percent >= 88 && percent < 105:
                baseLabel = 160
                break
            case percent >= 105 && percent < 140:
                baseLabel = 120
                break
            case percent >= 140:
                baseLabel = 80
                break
        }

        const drawRulerLength = (baseLabel * percent) / 100
        const step = drawRulerLength / 20

        for (let pos = 0; pos <= rulerLength; pos += step) {
            pointLength = lineLengthMin
            label = -1

            const compCurr = Math.round(pos * 100)
            const compHalf = Math.round((drawRulerLength / 2) * 100)
            const compWhole = Math.round(drawRulerLength * 100)

            if (compCurr % compHalf === 0) {
                const modulus = compCurr / compHalf
                label = (modulus * baseLabel) / 2
                pointLength = lineLengthMid
            }

            if (compCurr % compWhole === 0) {
                const modulus = compCurr / compWhole
                label = modulus * baseLabel
                pointLength = lineLengthMax
            }

            context.moveTo(pos + 2 * rulThickness + 0.5, rulThickness)
            context.lineTo(pos + 2 * rulThickness + 0.5, pointLength)
            if (label >= 0) {
                context.fillText(label, pos + 2 * rulThickness + 2, options.fontSize + 1)
            }
        }
        context.stroke()
    }

    /**
     *  根据类型获得标尺对象
     *  @param {type} string 标尺类型
     *
     */
    getRulerByType = (type: string) => {
        const [hRuler, vRuler]: any = document.querySelectorAll('.canvas-ruler')
        const rulerObj: any = {
            h: hRuler,
            v: vRuler
        }

        return rulerObj[type]
    }

    /**
     *  获取参考提示线位置     *
     *  @param {type} string 标尺类型
     *  @param {posX} number 鼠标位置X
     *  @param {posY} number 鼠标位置Y
     *
     */
    getIndicatorNum = (type: string, posX: number, posY: number) => {
        const { percent } = this.props.options
        const currRuler = this.getRulerByType(type)
        const { left, top } = currRuler.getBoundingClientRect()

        const realPos: any = {
            h: Math.round((posX - left - 40) / (percent / 100)),
            v: Math.round((posY - top - 40) / (percent / 100))
        }

        const indicator = currRuler.parentNode.querySelector(`.${styles.indicator}`)
        if (indicator) {
            indicator.style.left = type === 'h' ? `${posX - left}px` : `${posY - top}px`
            return realPos[type]
        }
    }

    /**
     *  鼠标移入标尺     *
     *  @param {type} string 标尺类型
     *
     */
    rulerFocus = (type: string, posX: number, posY: number) => {
        if (!this.state.isDragging) {
            const currRuler = this.getRulerByType(type)
            const { left, top } = currRuler.getBoundingClientRect()

            // 如果在标尺以外，则标尺指示虚线不显示
            if (posX > left + 20 && posY > top + 20) {
                return false
            }

            this.setState(
                {
                    showIndicator: true
                },
                () => {
                    const indicatorNum = this.getIndicatorNum(type, posX, posY)
                    this.setState({ indicatorNum, rulerType: type })
                    currRuler.addEventListener('mousemove', this.rulerMove)
                }
            )
        }
    }

    /**
     *  鼠标在标尺范围移动
     *
     */
    rulerMove = (e: any) => {
        const type = this.state.rulerType

        const indicatorNum = this.getIndicatorNum(type, e.clientX, e.clientY)
        if (indicatorNum) {
            this.setState({ indicatorNum })
        }
    }

    /**
     *  鼠标移出标尺范围
     *
     */
    rulerBlur = () => {
        const type = this.state.rulerType
        const currRuler = this.getRulerByType(type)
        currRuler && currRuler.removeEventListener('mousemove', this.rulerMove)
        this.setState({ showIndicator: false })
    }

    /**
     *  隐藏参考引导线
     *
     */
    hideIndicator = (e: any) => {
        e.stopPropagation()
        this.setState({ showIndicator: false })
    }

    /**
     *  添加参考线
     *
     */
    addGuidLine = (e: any) => {
        const { percent } = this.props.options
        const { isDragging, rulerType: type } = this.state
        const posX = e.clientX
        const posY = e.clientY

        const currRuler = this.getRulerByType(type)
        const { left, top } = currRuler.getBoundingClientRect()

        const realPos: any = {
            h: Math.round(((posX - left - 40) * 100) / percent),
            v: Math.round(((posY - top - 40) * 100) / percent)
        }

        if (!isDragging && e.button !== 2) {
            this.props.changeGuideLines({
                opType: 'add',
                lineType: type,
                pos: realPos[type]
            })
        }
    }

    /**
     *  双击删除参考线
     *  @param {index} number 参考线下标
     *
     */
    deleteGuideLine = (e: any, index: number, type: string) => {
        this.rulerFocus(type, e.clientX, e.clientY)
        this.props.changeGuideLines({
            opType: 'delete',
            lineType: type,
            index
        })
    }

    /**
     *  拖拽参考线 - 按下拖拽
     *
     *  @param {index} number 参考线下标
     *  @param {type} string 当前标尺类型
     *
     */
    dragLineStart = (e: any, index: number, type: string) => {
        const { lines } = this.props.options

        e.stopPropagation()

        if (!this.state.isDragging) {
            this.setState(
                {
                    rulerType: type,
                    dragIndex: index,
                    isDragging: true,
                    dragStartPos: type === 'h' ? e.clientX : e.clientY,
                    startLinePos: lines[type][index]
                },
                () => {
                    document.addEventListener('mousemove', this.dragLineMove)
                    document.addEventListener('mouseup', this.dragLineEnd)
                }
            )
        }
    }

    /**
     *  拖拽参考线 - 拖拽移动
     *
     */
    dragLineMove = (e: any) => {
        const { percent } = this.props.options
        const { dragIndex, rulerType: type, dragStartPos, startLinePos } = this.state
        const posX = e.clientX
        const posY = e.clientY

        const realPos: any = {
            h: Math.round(((posX - dragStartPos) * 100) / percent),
            v: Math.round(((posY - dragStartPos) * 100) / percent)
        }

        this.props.changeGuideLines({
            opType: 'update',
            lineType: type,
            index: dragIndex,
            pos: startLinePos + realPos[type]
        })
    }

    /**
     *  拖拽参考线 - 放开拖拽
     *
     */
    dragLineEnd = (e: any) => {
        e.stopPropagation()
        const { lines, percent } = this.props.options
        const { dragIndex, rulerType } = this.state
        const linesList = lines[rulerType]

        this.setState(
            {
                dragIndex: -1,
                isDragging: false
            },
            () => {
                const linePos = (linesList[dragIndex] * percent) / 100 + 40
                if (linePos <= 0) {
                    this.deleteGuideLine(e, dragIndex, rulerType)
                }
            }
        )

        document.removeEventListener('mousemove', this.dragLineMove)
        document.removeEventListener('mouseup', this.dragLineEnd)
    }
}

export default Ruler
