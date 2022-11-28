import "./controller.css"

type ExtraFunc = () => void

type BasicControllerDivProps = {
    label: string,
    setup: () => void,
    step: () => void,
    pause: () => void,
    play: () => void,
    extraFunctions?: ExtraFunc[]
}

type func = () => void;
type BasicControllerButtonOverrideProps = {
    label: string,
    buttonLabels: string[],
    actions: (() => void)[]
}

export const BasicController = ({
    label,
    setup,
    step,
    pause,
    play
}: BasicControllerDivProps) => {
    return (
        <div className={"controller"}>
            <div className={"controller_contents_container"}>
                <b>{label}</b>
                <div className={"controller_buttons_container"}>
                    <button className={"controller_button"} onClick={() => setup()}>Set Up</button>
                    <button className={"controller_button"} onClick={() => step()}>Step</button>
                    <button className={"controller_button"} onClick={() => pause()}>Pause</button>
                    <button className={"controller_button"} onClick={() => play()}>Play</button>
                </div>
            </div>
        </div>     
    ) 
}

export const ControllerButtons = ({label, buttonLabels, actions} : BasicControllerButtonOverrideProps) => {
    return (
        <div className={"controller_contents_container"}>
                <b>{label}</b>
                <div className={"controller_buttons_container"}>
                    {actions.map((action, idx) => (
                        <button key={idx} className={"controller_button"} onClick={() => action()}>{buttonLabels[idx]}</button>
                    ))}
                </div>
        </div>
    )
}



