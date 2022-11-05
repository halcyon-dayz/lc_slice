import { ControlsContainer } from "./styles"
import React, {useState, useEffect} from "react"
import { useSelector} from "react-redux";
import { 
    changeGridCell, 
    changeGridHeight, 
    changeGridWidth, 
    selectAllGrids,
    changeGridCellStatus,
    clearGridRow,
    clearGridCells,
    changeGridCellData,
} from "../../features/grids/gridsSlice";
import { floodFill} from "../../features/grids/gridsSlice";
import { useAppDispatch } from "../../features/hooks";
import { arrayBuffer } from "stream/consumers";
import { addGrid, copyGrid, deleteGrid } from "../../features/sharedActions";
import { GRID_417_PACIFIC_ATLANTIC_WATER_FLOW_GRID } from "../../features/grids/defaultGrids";


const ARRAY_2D_INDEX_IS_VALID = <T,>(arr: T[][], row: number, col: number): boolean => {
    if (row < 0 || col < 0 || row >= arr.length || col >= arr[0].length) {
        return false
    }
    return true;
}

const ARRAY_2D_GET_NEXT_INDEX = <T,>(arr: T[][], row: number, col: number): [number, number] => {
    if (!ARRAY_2D_INDEX_IS_VALID(arr, row, col)) {
        return [-1, -1];
    }
    if (col === arr[0].length - 1 && ARRAY_2D_INDEX_IS_VALID(arr, row + 1, 0)) {
        return [row + 1, 0];
    }
    return [row, col + 1];
}


export const Controls = () => {
    const [inputGrid, setInputGrid] = useState<number>(0);
    const [prevCells, setPrevCells] = useState<[number, number][]>([]);
    const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0])
    const [animationOn, setAnimationOn] = useState<boolean>(false);
    const [clearValue, setClearValue] = useState<number>(0);
    const [selectedRow, setSelectedRow] = useState<number>(0);

    const grids = useSelector(selectAllGrids);
    const dispatch = useAppDispatch();

    const onChangeSelectedGrid = (e: React.FormEvent<HTMLInputElement>) => {
        const numVal = parseInt(e.currentTarget.value);
        setInputGrid(numVal);
    }

    const onChangeClearValue = (e: React.FormEvent<HTMLInputElement>) => {
        const numVal = parseInt(e.currentTarget.value);
        setClearValue(numVal);
    }

    const onChangeSelectedRow = (e: React.FormEvent<HTMLInputElement>) => {
        const numVal = parseInt(e.currentTarget.value);
        setSelectedRow(numVal);
    }

    const clickIncreaseRows = () => {
        console.log("yo")
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
        if (grids.length === 0) {
            return;
        }
        dispatch(changeGridHeight({
            gridIndex: inputGrid, 
            newHeight: grids[inputGrid].height + 1
        }))
    }

    const clickDecreaseColumns = () => {
        if (grids.length === 0) {
            return;
        }
        if (grids[inputGrid].height - 1 >= 2) {
            dispatch(changeGridHeight({gridIndex: inputGrid, newHeight: grids[inputGrid].height - 1}))
        }  
    } 

    const clickFloodFill = () => {
        if (grids.length === 0) {
            return;
        }
        console.log("Flood Fill clicked");
        dispatch(floodFill(inputGrid));
    }

    const clickStepDFS = () => {
        if (grids.length === 0) {
            return;
        }
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


    const setUpMonkeyIsland = () => {
        if (grids.length === 0) {
            return;
        }
        setCurrentCell([0, 0]);
        for (let i = 0; i < grids[inputGrid].cells.length; i++) {
            for (let j = 0; j < grids[inputGrid].cells[0].length; j++) {
                dispatch(changeGridCell({
                    gridIndex: inputGrid,
                    row: i,
                    col: j,
                    data: 2,
                    status: "MONKEY_ISLAND"
                }))
            }
        }
    }

    const setUp200 = () => {
        if (grids.length === 0) {
            return;
        }
        setCurrentCell([0, 0]);
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
                if (grids[inputGrid].cells[i][j].data === -1) {
                    dispatch(changeGridCellStatus({
                        gridIndex: inputGrid,
                        row: i,
                        col: j,
                        status: "DEEP_OCEAN"
                    }))
                    continue;
                } 
                if (grids[inputGrid].cells[i][j].data === 2) {
                    dispatch(changeGridCellStatus({
                        gridIndex: inputGrid,
                        row: i,
                        col: j,
                        status: "MONKEY_ISLAND"
                    }))
                    continue;
                }
            }
        }
    }

    const step200 = () => {
        if (grids.length === 0) {
            return;
        }
        const row = currentCell[0];
        const col = currentCell[0];
        if (grids[inputGrid].cells[row][col].status === "ISLAND"){
            dispatch(changeGridCell({
                gridIndex: inputGrid, 
                data: 2, 
                row: currentCell[0], 
                col: currentCell[1], 
                status: "DEEP_OCEAN",
            }))
            if (row + 1 < grids[inputGrid].cells.length && grids[inputGrid].cells[row + 1][col].status === "ISLAND") {
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
        }
        if (prevCells.length !== 0) {
            const backCell = prevCells[prevCells.length - 1];
            setPrevCells([...prevCells.slice(0, prevCells.length - 1)]);
            setCurrentCell(backCell);
            return;
        }
        if (col > grids[inputGrid].cells[0].length) {
            setCurrentCell([row + 1, 0]);
        }
        setCurrentCell([row, col + 1]);

    }

    const clearSelectedRow = () => {
        if (grids.length === 0) {
            return;
        }
        dispatch(clearGridRow({
            gridIndex: inputGrid,
            row: selectedRow,
            data: clearValue,
            status: "ISLAND"
        }))
    }

    const onClearCells = () => {
        if (grids.length === 0) {
            return;
        }
        setAnimationOn(false);
        dispatch(clearGridCells({gridIndex: inputGrid, defaultValue: 0}));
    }

    const onClickFindPathsToCells = () => {
        if (grids.length === 0) {
            return;
        }
        //Store current row and column values
        const row = currentCell[0];
        const col = currentCell[1];
        //Default value for first cell;
        if (row === 0 && col === 0) {
            console.log("Run default cell")
            console.log(row);
            console.log(col);
            dispatch(changeGridCell({
                gridIndex: inputGrid,
                row: 0,
                col: 0,
                data: 1,
                status: "UNEXPLORED"
            }))
            dispatch(changeGridCellStatus({
                gridIndex: inputGrid,
                row: 0, 
                col: 1,
                status: "CURRENT",
            }));
            setCurrentCell([0, 1]);
            setPrevCells([[0, 0], [-1, 1]]);
            return;
        }
        let sum = 0;
        for (let i = 0; i < prevCells.length; i++) {
            let prevCellRow = prevCells[i][0];
            let prevCellCol = prevCells[i][1];
            if (prevCellRow < 0 || prevCellCol < 0 || prevCellRow === undefined || prevCellCol === undefined) {
                continue;
            }
            sum += grids[inputGrid].cells[prevCellRow][prevCellCol].data;
        }
        dispatch(changeGridCell({
            gridIndex: inputGrid,
            row: row, 
            col: col,
            data: sum,
            status: "UNEXPLORED",
        }));
        //Clear status of prev cells so they no longer render as under evaluation
        for (let i = 0; i < prevCells.length; i++) {
            const prevRow = prevCells[i][0];
            const prevCol = prevCells[i][1];
            if (prevRow < 0 || prevCol < 0 || prevRow === undefined || prevCol === undefined) {
                continue;
            }
            dispatch(changeGridCell({
                gridIndex: inputGrid,
                row: prevCells[i][0], 
                col: prevCells[i][1],
                data: grids[inputGrid].cells[prevRow][prevCol].data,
                status: "UNEXPLORED",
            }));  
        }
        //set current cell to next cell in the grid
        const [nextRow, nextCol] = ARRAY_2D_GET_NEXT_INDEX(grids[inputGrid].cells, row, col);
        dispatch(changeGridCell({
            gridIndex: inputGrid,
            row: nextRow, 
            col: nextCol,
            data: 0,
            status: "CURRENT",
        }));
        setCurrentCell([nextRow, nextCol]);
        //Set prev cells to evaluated cells
        dispatch(changeGridCellStatus({
            gridIndex: inputGrid,
            row: nextRow - 1,
            col: nextCol,
            status: "PREV_EVALUATE"
        }));
        dispatch(changeGridCellStatus({
            gridIndex: inputGrid,
            row: nextRow,
            col: nextCol - 1,
            status: "PREV_EVALUATE"
        }));
        setPrevCells([[nextRow - 1, nextCol], [nextRow, nextCol - 1]])
    }

    const onClickAddGrid = () => {
        dispatch(addGrid({num: 1}));
    }

    const onClickSetUp417 = () => {
        dispatch(deleteGrid({num: grids.length}));
        dispatch(copyGrid({cells: GRID_417_PACIFIC_ATLANTIC_WATER_FLOW_GRID}));
    }



    useEffect(() => {
        if (animationOn) {
            setTimeout(() => clickStepDFS(), 500)
        }
    }, [currentCell])

    return (
    <ControlsContainer>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
            <button onClick={() => clickDecreaseRows()}>Remove Width</button>
            <button onClick={() => clickIncreaseRows()}>Add Width</button>
            <button onClick={() => clickDecreaseColumns()}>Remove Height</button>
            <button onClick={() => clickIncreaseColumns()}>Add Height</button>
        </div>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
            <button onClick={clickFloodFill}>Flood Fill From Start</button>
            <button onClick={clickStepDFS}>StepDFS Right</button>
            <button onClick={() => {
                setAnimationOn(true);
                clickStepDFS();
            }}>DFS Complete</button>
        </div>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
            <button onClick={setUp200}>Set up Num Islands</button>
            <button onClick={step200}>Step Num Islands</button>
            <button>Complete Num Islands</button>
        </div>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
            <button onClick={setUpMonkeyIsland}>Money Islandize</button>
            <button onClick={clearSelectedRow}>Clear Selected Row</button>
        </div>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
            <button onClick={onClearCells}>Mone</button>
            <button onClick={onClickFindPathsToCells}>Paths to Cells</button>
            <button onClick={onClickAddGrid}>Add Grid</button>
        </div>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
            <button onClick={onClickSetUp417}>SetUp417</button>
        </div>
        <br></br>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px"}}>
            Selected Grid: 
            <input 
                type="number" 
                value={inputGrid}
                min={0} 
                max={grids.length >= 1 ? grids.length - 1 : 0}
                onChange={onChangeSelectedGrid}
                ></input>

            Clear Value: <input 
                type="number" 
                value={clearValue}
                min={0} 
                max={3}
                onChange={onChangeClearValue}
                ></input>
            Selected Row: <input 
                type="number" 
                value={selectedRow}
                min={0} 
                max={grids.length >= 1 ? grids[inputGrid].cells.length - 1 : 0}
                onChange={onChangeSelectedRow}
                ></input>
        </div>

    </ControlsContainer>);
}