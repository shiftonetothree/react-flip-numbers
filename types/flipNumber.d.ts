import React from "react";

type Props = {
    position: number,
    length: number,
    height: number,
    color: string,
    background: string,
    width: number,
    perspective: number,
    duration: number,
    activeNumber: number,
    loop?: number,
    delay: number,
    play: boolean,
    numberStyle: React.CSSProperties,
  };
export class FlipNumber extends React.Component<Props>{
    
}