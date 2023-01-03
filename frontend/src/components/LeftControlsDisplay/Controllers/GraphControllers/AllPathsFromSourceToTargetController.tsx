import { addNode } from "../../../../features/graphs/graphsSlice";
import { useAppDispatch, useAppSelector } from "../../../../features/hooks"
import { clearLog, selectProblemNumber } from "../../../../features/problemInfo/problemSlice";
import { addGraph, deleteAllStructs } from "../../../../features/sharedActions";
import { BasicController } from "../BasicController";
import { ANIMATION_PROPS } from "../controllerUtils"
import { QUESTIONS_ENUM } from "../../../../utils/questionEnum";

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
        dispatch(deleteAllStructs());
        dispatch(clearLog());
        dispatch(addGraph({nodeRadius: 30}));
        dispatch(addNode({graphIndex: 0, data: 1, initX: 200, initY: 200, links: [1]}));
        dispatch(addNode({graphIndex: 0, data: 2, initX: 400, initY: 200, links: [2]}));
        dispatch(addNode({graphIndex: 0, data: 3, initX: 400, initY: 400, links: [3]}));
        dispatch(addNode({graphIndex: 0, data: 4, initX: 200, initY: 400, links: [0]}));
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