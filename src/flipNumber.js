// @flow
import { Animate } from 'react-simple-animate';
import React from 'react';

const commonAnimateStyle = {
  position: 'absolute',
  height: '100%',
  transformStyle: 'preserve-3d',
};
const easeType = 'cubic-bezier(0.19, 1, 0.22, 1)';
const revolutionDegrees = 360;
const resetRouteCounter = 1000;
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const rotateDegreePerNumber = 36;

type Props = {
  position: number,
  length: number,
  height: number,
  color: string,
  background?: string,
  width: number,
  perspective: number,
  duration: number,
  activeNumber: number,
  loop?: number,
  delay: number,
  play: boolean,
  numberStyle: { [string]: string | number },
};

type State = {
  degree: number,
  rotateCounter: number,
};

/** caculate nerest degree */ 
const calculateDegrees = (rotateCounter, degree, activeNumber, loop = 0) => {
  const targetIndex = numbers.findIndex(v => v === activeNumber);
  
  
  const currentIndex = ((degree * - 1) / rotateDegreePerNumber) % numbers.length;
  if(currentIndex<0){
    currentIndex = numbers.length + currentIndex;
  }

  
  const diff = targetIndex - currentIndex;
  let direction = 0;

  
  if (diff === 0) {
    // n -> n
    direction = 0;
  } else if (-9 <= diff && diff < -5) {
    // 9 -> 0
    // 9 -> 1
    // 9 -> 2
    // 9 -> 3
    direction = 1;
  } else if (-5 <= diff && diff < 0) {
    // 9 -> 4
    // 9 -> 5
    // 9 -> 6
    // 9 -> 7
    // 9 -> 8
    direction = 0;
  } else if (0 < diff && diff <= 5) {
    // 0 -> 1
    // 0 -> 2
    // 0 -> 3
    // 0 -> 4
    // 0 -> 5
    direction = 0;
  } else if (5 < diff && diff <= 9) {
    // 0 -> 6
    // 0 -> 7
    // 0 -> 8
    // 0 -> 9
    direction = -1;
  }

  const animateDegree = targetIndex * rotateDegreePerNumber + loop * revolutionDegrees;

  let newRotateCounter = rotateCounter + direction;
  newRotateCounter = rotateCounter > Math.abs(resetRouteCounter) ? 0 : newRotateCounter;
  const amountDegree = newRotateCounter * revolutionDegrees;

  return {
    rotateCounter: newRotateCounter,
    degree: - amountDegree - animateDegree,
  };
};

export default class FlipNumber extends React.Component<Props, State> {
  static defaultProps = {
    loop: 0,
  }

  static getDerivedStateFromProps({ activeNumber, loop }: Props, { rotateCounter, degree }: State) {
    return calculateDegrees(rotateCounter, degree, activeNumber, loop);
  }

  state = {
    degree: 0,
    rotateCounter: 0, // eslint-disable-line react/no-unused-state
  }

  updateNumberTimeout: TimeoutID;

  componentDidMount() {
    this.updateNumberTimeout = setTimeout(() => this.updateNumber(), 50 * this.props.position);
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.activeNumber !== this.props.activeNumber ||
      nextProps.height !== this.props.height ||
      nextProps.width !== this.props.width ||
      this.state.degree === 0 ||
      nextProps.play !== this.props.play
    );
  }

  componentWillUnmount() {
    clearTimeout(this.updateNumberTimeout);
  }

  updateNumber = () => {
    this.setState(({ rotateCounter }) => calculateDegrees(rotateCounter, this.state.degree, this.props.activeNumber, this.props.loop));
  }

  render() {
    const {
      activeNumber,
      height,
      color,
      background,
      width,
      perspective,
      duration,
      play,
      delay,
      length,
      position,
      numberStyle = {},
    } = this.props;
    const { degree } = this.state;
    const viewPortSize = {
      width: `${width}px`,
      height: `${height + 3}px`,
    };
    const halfElementHeight = height / 2;
    const translateZ = halfElementHeight + height;

    return (
      <span
        style={{
          ...viewPortSize,
          perspective,
          overflow: 'hidden',
          display: 'inline-block',
          textAlign: 'left',
          height,
        }}
        aria-hidden
      >
        <Animate
          tag="span"
          play={play}
          start={{
            ...commonAnimateStyle,
          }}
          end={{
            ...commonAnimateStyle,
            transform: `rotateX(${degree}deg)`,
          }}
          {...{ easeType, duration, delay }}
          render={({ style }) => (
            <span style={style}>
              {numbers.map((n, i) => (
                <span
                  style={{
                    ...viewPortSize,
                    height,
                    lineHeight: `${height}px`,
                    fontSize: `${height - 1}px`,
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    WebkitFontSmoothing: 'antialiased',
                    color,
                    background,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    MozBackfaceVisibility: 'hidden',
                    transform: `rotateX(${rotateDegreePerNumber * i}deg) translateZ(${translateZ}px)`,
                    ...numberStyle,
                  }}
                  key={`${rotateDegreePerNumber * i}`}
                >
                  {n}
                </span>
              ))}
            </span>
          )}
        />
        <span
          data={length - position}
          style={{
            ...viewPortSize,
            height,
            lineHeight: `${height}px`,
            fontSize: `${height - 1}px`,
            left: `${length - position > 4 ? 0.25 : 0}px`, // hacky fix for weird misalignment in Chrome.
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            WebkitFontSmoothing: 'antialiased',
            color,
            background,
            transform: `rotateX(0deg) translateZ(${translateZ}px)`,
            visibility: 'hidden',
            ...numberStyle,
          }}
        >
          {activeNumber}
        </span>
      </span>
    );
  }
}
