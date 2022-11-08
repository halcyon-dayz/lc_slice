import React from "react"
import { useDispatch, useSelector } from "react-redux";
import { copyGrids, selectAllGrids, changeGridLabels} from "../../features/grids/gridsSlice";
import { deleteGrid} from "../../features/sharedActions";
import { GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, GRID_417_BOOLEAN} from "../../features/grids/defaultGrids";
import { GRID_417_CONTEXT } from "../../features/grids/gridTypes";
import { useAppDispatch } from "../../features/hooks";


export type Problem417ControllerType = {
    setCurrentCell: React.SetStateAction<[any]>
    setStackContext: React.SetStateAction<any>
}

export const Problem417Controller = ({
    setCurrentCell,
    setStackContext
}: Problem417ControllerType) => {

    /*const dispatch = useAppDispatch();
    const grids = useSelector(selectAllGrids);

    const onClickSetUp417 = () => {
        dispatch(deleteGrid({num: grids.length}));
        dispatch(copyGrids([GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, GRID_417_BOOLEAN, GRID_417_BOOLEAN]))
        dispatch(changeGridLabels(0, ["Water Flow", "Pacific", "Atlantic"]));
        setCurrentCell([0, 0]);
        setStackContext([]);
    }

    <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
        <button onClick={onClickSetUp417}>SetUp417</button>
        <button onClick={() => onClickStep417()}>Step 417</button>
        <button>Complete 417</button>
    </div> */

}