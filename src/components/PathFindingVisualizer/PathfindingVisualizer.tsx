import React from "react";
import { selectAllGrids } from "../../features/grids/gridsSlice";
import {useSelector} from "react-redux"
import {Grid} from "../Grid"
import { PointedArray } from "../PointedArray";
import { useAppSelector } from "../../features/hooks";
import { RootState } from "../../utils/types";

export const PathFindingVisualizer = () => {
    const gridsLength = useAppSelector((state: RootState) => state.grids.length);
    console.log(gridsLength);
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
       
            {[...Array(gridsLength)].map((grid) => (
                <Grid 
                    key={`Grid_${grid}`}
                    gridIndex={grid}
                />
            ))}
        </div>
    )  
}