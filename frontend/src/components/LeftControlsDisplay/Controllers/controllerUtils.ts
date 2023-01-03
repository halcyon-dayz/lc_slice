export type ANIMATION_PROPS = {
    animationOn: boolean,
    animationSpeed: number,
    play: () => void,
    pause: () => void
}

export interface ControllerProps {
  animationOn: boolean,
  animationSpeed: number,
  play: () => void,
  pause: () => void,
}