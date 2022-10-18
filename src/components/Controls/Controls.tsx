import { ControlsContainer } from "./styles"
import React from "react"
import { useSelector, useDispatch} from "react-redux";
import { changeHeight, changeWidth, gridSelector } from "../../features/grid/gridSlice";




export const Controls = () => {

    const grid = useSelector(gridSelector);
    const dispatch = useDispatch();

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
            <button onClick={() => clickDecreaseColumns()}>Decrease Columns</button>
            <button onClick={() => clickIncreaseColumns()}>Increase Columns</button>
        </div>
    </ControlsContainer>);
}