// #region Imports
import { ControlsContainer } from "./styles"
import React, {useState, useEffect} from "react"
import { useSelector} from "react-redux";
import { 
    changeGridCell, 
    selectAllGrids,
    changeGridCellStatus,
    changeGridCellData,
    changeGridLabels,
    copyGrids
} from "../../features/grids/gridsSlice";
import { floodFill} from "../../features/grids/gridsSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { deleteGrid } from "../../features/sharedActions";
import { GRID_417_BOOLEAN, GRID_417_PACIFIC_ATLANTIC_WATER_FLOW } from "../../features/grids/defaultGrids";
import { GRID_417_CONTEXT, GRID_CONTEXT } from "../../features/grids/gridTypes";
import { 
    ARRAY_2D_GET_DIRECTION_FROM_PREVIOUS_CELL,
    ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL,
    ARRAY_2D_GET_NEXT_INDEX, 
    ARRAY_2D_IS_INDEX_SAME, 
    ARRAY_2D_IS_VALID_INDEX,
    GRID_CELL_INDEX_HAS_STATUS,
    GRID_CELL_INDEX_HAS_DATA,
    GRID_CELL_INDEX_GET_DATA
} from "../../features/grids/gridUtils";
import { UtilitiesController } from "../Controllers/UtilitiesController";
//#endregion


export const Controls = () => {
    //Controls Specific Variables
    const [inputGrid, setInputGrid] = useState<number>(0);
    const [clearValue, setClearValue] = useState<number>(0);
    const [selectedRow, setSelectedRow] = useState<number>(0);
    //Individual Problem Variables
    const [prevCells, setPrevCells] = useState<[number, number][]>([]);
    const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0])
    const [animationOn, setAnimationOn] = useState<boolean>(false);
    const [stackContext, setStackContext] = useState<GRID_CONTEXT[]>([])
    const [globals, setGlobals] = useState<string>("PACIFIC");

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

    const onClickSetUp417 = () => {
        dispatch(deleteGrid({num: grids.length}));
        dispatch(copyGrids([GRID_417_PACIFIC_ATLANTIC_WATER_FLOW, GRID_417_BOOLEAN, GRID_417_BOOLEAN]))
        dispatch(changeGridLabels(0, ["Water Flow", "Pacific", "Atlantic"]));
        setCurrentCell([0, 0]);
        dispatch(changeGridCellStatus({
            gridIndex: 0,
            row: currentCell[0],
            col: currentCell[1],
            status: "CURRENT"
        }))
        setStackContext([]);
    }

    const directToPacific = (i: number, j: number): boolean => {
        if (i === 0 || j === 0) {
            return true;
        }
        return false;
    }

    const directToAtlantic = (i: number, j: number): boolean => {
        if (i === grids[0].cells.length - 1 || j === grids[0].cells[0].length - 1) {
            return true;
        }
        return false;
    }

    //Flow of checks
    //1. Start at [0, 0]
    //2. FloodFill Pacifc from Left Side, stop when we reach ([grids.length - 1, 0])
    //3. Flood Fill Atlantic from Right Side, stop when we reach([grids.length - 1, grids[0].length - 1]])
    //4. Flood Fill Pacific From Top, stop when we reach ([0, grids[0].length - 1])
    //5. Flood Fill Atlantic from Bottom, stop when we reach ([0, grids[grids.length - 1].length - 1])

    //TODO: Make it clear as a design goal that we want to manipulate the stack as little as possible,
    //As such, attempt to invalidate any cells checked by dfs before going to them
    const onClickStep417 = () => {
        const waterFlowGrid = grids[0];
        const pacificGrid = grids[1];
        const atlanticGrid = grids[2];
        const i = currentCell[0]
        const j = currentCell[1];
        const curTileValue = waterFlowGrid.cells[currentCell[0]][currentCell[1]].data;

        const dfsPacific = (cell: [number, number]) => {
            const [northOfCur, eastOfCur, southOfCur, westOfCur] = 
                ARRAY_2D_GET_FOUR_DIRECTIONS_FROM_CELL(cell);
            if (
                GRID_CELL_INDEX_HAS_DATA(pacificGrid.cells, northOfCur[0], northOfCur[1], false) && 
                GRID_CELL_INDEX_GET_DATA(waterFlowGrid.cells, northOfCur[0], northOfCur[1]) >= curTileValue
            ) {
                setStackContext([...stackContext, {prevCell: cell, prevTileValue: curTileValue}])
                setCurrentCell(northOfCur);
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: northOfCur[0],
                    col: northOfCur[1],
                    status: "CURRENT"
                }))
                return true;
            }
            if (
                GRID_CELL_INDEX_HAS_DATA(pacificGrid.cells, eastOfCur[0], eastOfCur[1], false) &&
                GRID_CELL_INDEX_GET_DATA(waterFlowGrid.cells, eastOfCur[0], eastOfCur[1]) >= curTileValue
            ) {
                setStackContext([...stackContext, {prevCell: cell, prevTileValue: curTileValue}])
                setCurrentCell(eastOfCur);
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: eastOfCur[0],
                    col: eastOfCur[1],
                    status: "CURRENT"
                }))
                return true;
            }
            if (
                GRID_CELL_INDEX_HAS_DATA(pacificGrid.cells, southOfCur[0], southOfCur[1], false) &&
                GRID_CELL_INDEX_GET_DATA(waterFlowGrid.cells, southOfCur[0], southOfCur[1]) >= curTileValue
            ) {
                setStackContext([...stackContext, {prevCell: cell, prevTileValue: curTileValue}])
                setCurrentCell(southOfCur);
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: southOfCur[0],
                    col: southOfCur[1],
                    status: "CURRENT"
                }))
                return true;
            }
            if (
                GRID_CELL_INDEX_HAS_DATA(pacificGrid.cells, westOfCur[0], westOfCur[1], false) &&
                GRID_CELL_INDEX_GET_DATA(waterFlowGrid.cells, westOfCur[0], westOfCur[1]) >= curTileValue
            ) {
                setStackContext([...stackContext, {prevCell: cell, prevTileValue: curTileValue}])
                setCurrentCell(westOfCur);
                dispatch(changeGridCellStatus({
                    gridIndex: 0,
                    row: westOfCur[0],
                    col: westOfCur[1],
                    status: "CURRENT"
                }))
                return true;
            }
            return false;
        }
        if (stackContext.length !== 0) {
            dispatch(changeGridCellStatus({
                gridIndex: 0,
                row: i,
                col: j,
                status: "EXPLORED"
            }));
            dispatch(changeGridCellData({
                gridIndex: 1,
                row: i,
                col: j,
                data: true
            }));
            if (dfsPacific(currentCell) === true) {
                return;
            }
            //Pop stack and set currentCell to prevcell
            const prevCell = stackContext[stackContext.length - 1].prevCell;
            setCurrentCell(prevCell);
            dispatch(changeGridCellStatus({
                gridIndex: 0,
                row: prevCell[0],
                col: prevCell[1],
                status: "CURRENT"
            }))
            setStackContext(stackContext.slice(0, stackContext.length - 1));
        }
        if (directToPacific(i, j)) {
            console.log("Direct to Pacific")
            //Set status of waterFlowGrid to explored
            dispatch(changeGridCellStatus({
                gridIndex: 0,
                row: i, 
                col: j,
                status: "EXPLORED"
            }));
            //Change data in the pacific grid to true
            dispatch(changeGridCellData({
                gridIndex: 1,
                row: currentCell[0],
                col: currentCell[1],
                data: true
            }));
            if (dfsPacific(currentCell) === true) {
                return;
            } else {
                setCurrentCell(ARRAY_2D_GET_NEXT_INDEX(waterFlowGrid.cells, i, j));
            }
        }
    }

    useEffect(() => {
        if (animationOn) {
            setTimeout(() => clickStepDFS(), 500)
        }
    }, [currentCell])

    return (
    <ControlsContainer>
        <UtilitiesController inputGrid={inputGrid} selectedRow={selectedRow} clearValue={clearValue}/>
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
            <button onClick={onClickFindPathsToCells}>Paths to Cells</button>
        </div>
        <div style={{display: "flex", flexDirection: "row", "justifyContent": "flex-start", marginLeft: "20px", marginTop: "10px"}}>
            <button onClick={onClickSetUp417}>SetUp417</button>
            <button onClick={() => onClickStep417()}>Step 417</button>
            <button>Complete 417</button>
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