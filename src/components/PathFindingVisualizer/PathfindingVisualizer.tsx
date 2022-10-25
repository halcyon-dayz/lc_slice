import React from "react";
import { gridSelector } from "../../features/grid/gridSlice";
import {useSelector} from "react-redux"
import {Grid} from "../Grid"
import { PointedArray } from "../PointedArray";
import {ArrDS} from "../../utils/types";

export const PathFindingVisualizer = () => {
    const grid = useSelector(gridSelector);

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
       
            <Grid grid={grid}></Grid>
        </div>
    )  
}