import {ComponentType} from "react"

export type UserProvidesProps = {
    animationOn: boolean,
    switchAnimationOn: () => void,
    animationSpeed: number
}

export type ComponentInjectsProps = {
    animationOn: boolean,
    switchAnimationOn: () => void,
    animationSpeed: number,
    play: () => void;
    pause: () => void;
}


export const withAnimation = (
    WrappedComponent: ComponentType<ComponentInjectsProps>
) => {
    return function WithAnimationComponent({
        animationOn, 
        switchAnimationOn, 
        animationSpeed
    }: UserProvidesProps) {

        const play = () => {
            if (!animationOn) {
                switchAnimationOn();
            }
        }

        const pause = () => {
            if (animationOn) {
                switchAnimationOn();
            }
        }

        return (
            <WrappedComponent 
                animationOn={animationOn}
                switchAnimationOn={switchAnimationOn}
                animationSpeed={animationSpeed}
                play={play}
                pause={pause}
            />
        )
        

    }
}
