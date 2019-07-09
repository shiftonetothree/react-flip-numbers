import React from "react";

type Props = {
    numbers: string | Array<string>,
    nonNumberStyle?: React.CSSProperties,
    height: number,
    width: number,
    color: string,
    background: string,
    perspective?: number,
    duration?: number,
    delay?: number,
    /**
     * 数字之间的启动的延迟
     *
     * @type {number}
     */
    delayBetween?: number,
    /**
     * 动画先启动的方向
     *
     * @type {('left' | 'right')}
     */
    delayBetweenFrom?: 'left' | 'right',
    /**
     * 额外转动的圈数，整数
     *
     * @type {number}
     */
    loop?: number,
    animate?: boolean,
    play?: boolean,
    numberStyle?: React.CSSProperties,
};

export class FlipNumbers extends React.Component<Props>{

}