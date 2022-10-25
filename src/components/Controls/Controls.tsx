import { ControlsContainer } from "./styles"
import React from "react"
import { useSelector} from "react-redux";
import { changeHeight, changeWidth, gridSelector } from "../../features/grid/gridSlice";
import { floodFill } from "../../features/grid/gridSlice";
import { useAppDispatch } from "../../features/hooks";

const delay = (time: number) => {
    return new Promise(resolve => setTimeout(resolve, time));
}



export const Controls = () => {

    const grid = useSelector(gridSelector);
    const dispatch = useAppDispatch();

    const clickIncreaseRows = () => {
        dispatch(changeWidth({newWidth: grid.width + 1}))
    }

    const clickDecreaseRows = () => {
        if (grid.width - 1 >= 2) {
            dispatch(changeWidth({newWidth: grid.width - 1}))
        }
    }

    const clickIncreaseColumns = () => {
        dispatch(changeHeight({newHeight: grid.height + 1}))
    }

    const clickDecreaseColumns = () => {
        if (grid.height - 1 >= 2) {
            dispatch(changeHeight({newHeight: grid.height - 1}))
        }  
    } 

    const clickFloodFill = () => {
        console.log("Flood Fill clicked");
        dispatch(floodFill());
    }

    return (
    <ControlsContainer>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px"}}>
            <button onClick={() => clickDecreaseRows()}>Decrease Rows</button>
            <button onClick={() => clickIncreaseRows()}>Increase Rows</button>
        </div>
        <br></br>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px"}}>
            <button onClick={() => clickDecreaseColumns()}>Decrease Columns</button>
            <button onClick={() => clickIncreaseColumns()}>Increase Columns</button>
        </div>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px"}}>
            <button onClick={clickFloodFill}>Flood Fill From Start</button>
        </div>
    </ControlsContainer>);
}