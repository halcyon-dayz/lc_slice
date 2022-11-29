import { addNode } from "../../../features/graphs/graphsSlice";
import { useAppDispatch, useAppSelector } from "../../../features/hooks"
import { selectProblemNumber } from "../../../features/problemInfo/problemSlice";
import { addGraph } from "../../../features/sharedActions";
import { BasicController } from "../BasicController";
import { ANIMATION_PROPS } from "../controllerUtils"
import { QUESTIONS_ENUM } from "../../../utils/questionEnum";

export const AllPathsFromSourceToTargetController = ({
    animationOn,
    animationSpeed,
    play,
    pause
}: ANIMATION_PROPS) => {
    const dispatch = useAppDispatch();
    const graph = useAppSelector(state => state.graphs[0]);
    const problemNumber = useAppSelector(selectProblemNumber);

    const setup = () => {
        dispatch(addGraph({}));
        dispatch(addNode({graphIndex: 0, data: 1, initX: 200, initY: 200}));
        dispatch(addNode({graphIndex: 0, data: 2, initX: 400, initY: 200}));
        dispatch(addNode({graphIndex: 0, data: 3, initX: 400, initY: 400}));
        dispatch(addNode({graphIndex: 0, data: 4, initX: 200, initY: 400}));
    }

    const step = () => {
        console.log("step");
    }

    return (
        <BasicController 
            setup={setup}
            play={play}
            pause={pause}
            step={step}
            label={"All Paths From Source to Target"}
        />
    )
}