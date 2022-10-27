import { ControlsContainer } from "./styles"
import React, {useState} from "react"
import { useSelector} from "react-redux";
import { changeGridHeight, changeGridWidth, selectAllGrids } from "../../features/grids/gridsSlice";
import { floodFill } from "../../features/grids/gridsSlice";
import { useAppDispatch } from "../../features/hooks";



export const Controls = () => {
    const [inputGrid, setInputGrid] = useState<number>(0);

    const grids = useSelector(selectAllGrids);
    const dispatch = useAppDispatch();

    const onChangeSelectedGrid = (e: React.FormEvent<HTMLInputElement>) => {
        const numVal = parseInt(e.currentTarget.value);
        setInputGrid(numVal);
    }

    const clickIncreaseRows = () => {
        dispatch(changeGridWidth({gridIndex: inputGrid, newWidth: grids[inputGrid].width + 1}))
    }

    const clickDecreaseRows = () => {
        if (grids[inputGrid].width - 1 >= 2) {
            dispatch(changeGridWidth({
                gridIndex: inputGrid, 
                newWidth: grids[inputGrid].width - 1
            }))
        }
    }

    const clickIncreaseColumns = () => {
        dispatch(changeGridHeight({
            gridIndex: inputGrid, 
            newHeight: grids[inputGrid].height + 1
        }))
    }

    const clickDecreaseColumns = () => {
        if (grids[inputGrid].height - 1 >= 2) {
            dispatch(changeGridHeight({gridIndex: inputGrid, newHeight: grids[inputGrid].height - 1}))
        }  
    } 

    const clickFloodFill = () => {
        console.log("Flood Fill clicked");
        dispatch(floodFill(inputGrid));
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
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px"}}>
            Selected Grid: 
            <input 
                type="number" 
                value={inputGrid}
                min={0} 
                max={grids.length - 1}
                onChange={onChangeSelectedGrid}
                ></input>
        </div>

    </ControlsContainer>);
}