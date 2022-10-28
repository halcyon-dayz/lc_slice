import { ControlsContainer } from "./styles"
import React, {useState, useEffect} from "react"
import { useSelector} from "react-redux";
import { 
    changeGridCell, 
    changeGridHeight, 
    changeGridWidth, 
    selectAllGrids,
    changeGridCellStatus} from "../../features/grids/gridsSlice";
import { floodFill } from "../../features/grids/gridsSlice";
import { useAppDispatch } from "../../features/hooks";



export const Controls = () => {
    const [inputGrid, setInputGrid] = useState<number>(0);
    const [prevCells, setPrevCells] = useState<[number, number][]>([]);
    const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0])
    const [animationOn, setAnimationOn] = useState<boolean>(false);

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

    const clickStepDFS = () => {
        const row = currentCell[0];
        const col = currentCell[1];
        console.log(row)
        console.log(col);
        dispatch(changeGridCell({
            gridIndex: inputGrid, 
            data: 2, 
            row: currentCell[0], 
            col: currentCell[1], 
            status: "EXPLORED"
        }))
        if (row + 1 < grids[inputGrid].cells.length && grids[inputGrid].cells[row + 1][col].status === "UNEXPLORED") {
            console.log("Going down")
            console.log(grids[inputGrid].cells.length)
            setPrevCells([...prevCells, currentCell]);
            setCurrentCell([row + 1, col]);
            return;
        } 
        if (row - 1 >= 0 && grids[inputGrid].cells[row - 1][col].status === "UNEXPLORED") {
            setPrevCells([...prevCells, currentCell]);
            setCurrentCell([row - 1, col]);
            return;
        } 
        if (col + 1 < grids[inputGrid].cells[0].length && grids[inputGrid].cells[row][col + 1].status === "UNEXPLORED") {
            setPrevCells([...prevCells, currentCell]);
            setCurrentCell([row, col + 1]);
            return;
        } 
        if (col - 1 >= 0 && grids[inputGrid].cells[row][col - 1].status === "UNEXPLORED") {
            setPrevCells([...prevCells, currentCell]);
            setCurrentCell([row, col - 1]);
            return;
        } 
        const backCell = prevCells[prevCells.length - 1];
        setPrevCells([...prevCells.slice(0, prevCells.length - 1)]);
        setCurrentCell(backCell);
    }


    const setUp200 = () => {
        for (let i = 0; i < grids[inputGrid].cells.length; i++) {
            for (let j = 0; j < grids[inputGrid].cells[0].length; j++) {
                if (grids[inputGrid].cells[i][j].data === 1) {
                    dispatch(changeGridCellStatus({
                        gridIndex: inputGrid,
                        row: i,
                        col: j,
                        status: "ISLAND"
                    }))
                    continue;
                }
                if (grids[inputGrid].cells[i][j].data === 0) {
                    dispatch(changeGridCellStatus({
                        gridIndex: inputGrid,
                        row: i,
                        col: j,
                        status: "WATER"
                    }))
                    continue;
                }
            }
        }
    }

    const step200 = () => {

    }


    useEffect(() => {
        if (animationOn) {
            setTimeout(() => clickStepDFS(), 500)
        }
    }, [currentCell])

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
            <button onClick={clickStepDFS}>StepDFS Right</button>
            <button onClick={() => {
                setAnimationOn(true);
                clickStepDFS();
            }}>DFS Complete</button>
        </div>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px"}}>
            <button onClick={setUp200}>Set up Num Islands</button>
            <button>Step Num Islands</button>
            <button>Complete Num Islands</button>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempus quam pellentesque nec nam aliquam sem et. Odio eu feugiat pretium nibh ipsum consequat nisl vel. Integer malesuada nunc vel risus commodo viverra maecenas accumsan. Sit amet est placerat in egestas erat. Aliquet nec ullamcorper sit amet risus nullam eget. Cum sociis natoque penatibus et magnis dis parturient. In mollis nunc sed id. Risus pretium quam vulputate dignissim suspendisse in est ante in. Commodo quis imperdiet massa tincidunt nunc pulvinar. Lacus luctus accumsan tortor posuere ac ut consequat. Ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis. Nec dui nunc mattis enim ut tellus. Dolor morbi non arcu risus quis. Quam pellentesque nec nam aliquam sem et tortor consequat. Arcu odio ut sem nulla pharetra diam sit. Aliquam sem et tortor consequat id porta nibh venenatis. Elit ullamcorper dignissim cras tincidunt lobortis feugiat.

Adipiscing elit pellentesque habitant morbi. Viverra aliquet eget sit amet. Feugiat vivamus at augue eget arcu dictum varius duis at. Non quam lacus suspendisse faucibus interdum posuere. Pharetra vel turpis nunc eget lorem dolor sed. Libero enim sed faucibus turpis in. Sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula. Fusce id velit ut tortor pretium viverra suspendisse potenti nullam. Duis convallis convallis tellus id interdum. Etiam erat velit scelerisque in dictum non. Urna condimentum mattis pellentesque id.

Tincidunt tortor aliquam nulla facilisi cras fermentum odio eu. Eget velit aliquet sagittis id consectetur purus ut. Consectetur adipiscing elit ut aliquam purus sit amet luctus. Praesent tristique magna sit amet purus gravida quis. Aliquet nec ullamcorper sit amet risus nullam eget. Neque convallis a cras semper auctor. Ut morbi tincidunt augue interdum velit euismod in. At tempor commodo ullamcorper a lacus vestibulum sed arcu. Feugiat scelerisque varius morbi enim nunc faucibus. Malesuada bibendum arcu vitae elementum curabitur vitae. Diam sit amet nisl suscipit adipiscing bibendum est.</p>
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