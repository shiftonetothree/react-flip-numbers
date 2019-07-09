// @flow
import React from 'react';
import FlipNumber from './flipNumber';

type Props = {
  numbers: string | Array<string>,
  nonNumberStyle?: { [string]: string | number },
  height: number,
  width: number,
  color: string,
  background: string,
  perspective?: number,
  duration?: number,
  delay?: number,
  delayBetween?: number,
  delayBetweenFrom?: 'left' | 'right',
  loop?: number,
  animate?: boolean,
  play?: boolean,
  numberStyle?: { [string]: string | number },
};

export default class FlipNumbers extends React.Component<Props> {
  static defaultProps = {
    perspective: 500,
    duration: 0.3,
    animate: true,
    play: false,
    delay: 0,
    delayBetween: 0,
    delayBetweenFrom: 'right',
    nonNumberStyle: {},
    numberStyle: {},
  };

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.numbers !== this.props.numbers ||
      nextProps.height !== this.props.height ||
      nextProps.width !== this.props.width ||
      nextProps.duration !== this.props.duration ||
      nextProps.delay !== this.props.delay ||
      nextProps.delayBetween !== this.props.delayBetween ||
      nextProps.delayBetweenFrom !== this.props.delayBetweenFrom ||
      nextProps.loop !== this.props.loop ||
      nextProps.play !== this.props.play
    );
  }

  render() {
    const {
      numbers,
      nonNumberStyle,
      numberStyle,
      height,
      width,
      color,
      background,
      perspective,
      duration,
      animate,
      play,
      delay,
      delayBetween,
      delayBetweenFrom,
      loop,
    } = this.props;
    let numberCounter = 0;

    return (
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={numbers}
      >
        {Array.from(numbers).map((n, key) => {
          const nonNumber = (
            <span aria-hidden style={nonNumberStyle} key={numberCounter}>
              {n}
            </span>
          );

          if (animate) {
            numberCounter += 1;
            let realDelay = delay;
            if (delayBetween !== undefined) {
              realDelay = delayBetweenFrom === 'left' ? delay + delayBetween * key : delay + delayBetween * (numbers.length - 1 - key);
            }
            return !Number.isNaN(parseInt(n, 10)) ? (
              <FlipNumber
                {...{
                  key,
                  height,
                  width,
                  color,
                  background,
                  perspective,
                  duration,
                  play,
                  delay: realDelay,
                  loop,
                  numberStyle,
                }}
                position={numberCounter}
                length={numbers.length}
                activeNumber={parseInt(n, 10)}
              />
            ) : (
              nonNumber
            );
          }

          return !Number.isNaN(parseInt(n, 10)) ? (
            <span
              aria-hidden
              style={{
                padding: 0,
              }}
              className={nonNumberStyle}
              key={numberCounter}
            >
              {n}
            </span>
          ) : (
            nonNumber
          );
        })}
      </section>
    );
  }
}
