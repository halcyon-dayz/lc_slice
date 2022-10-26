import React from "react";
import { selectAllGrids } from "../../features/grids/gridsSlice";
import {useSelector} from "react-redux"
import {Grid} from "../Grid"
import { PointedArray } from "../PointedArray";

export const PathFindingVisualizer = () => {
    const grid = useSelector(selectAllGrids);
    return (
        <div>
            
            <PointedArray 
                cells={[
                    {data: 1, status: "NO_DATA"},
                    {data: 2, status: "NO_DATA"},
                    {data: 2, status: "NO_DATA"},
                    {data: 2, status: "NO_DATA"},
                    {data: 2, status: "NO_DATA"},
                    {data: 2, status: "NO_DATA"},
                    {data: 2, status: "NO_DATA"},
                    {data: 2, status: "NO_DATA"},
                ]}
                pointerLocations={[0, 0]}
            />
       
            <Grid grid={grid[0]}></Grid>
        </div>
    )  
}