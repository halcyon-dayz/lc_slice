import React from "react";
import { selectAllGrids } from "../../features/grids/gridsSlice";
import {useSelector} from "react-redux"
import {Grid} from "../Grid"
import { PointedArray } from "../PointedArray";
import { useAppSelector } from "../../features/hooks";
import { RootState } from "../../utils/types";

export const PathFindingVisualizer = () => {
    const gridsLength = useAppSelector((state: RootState) => state.grids.length);
    return (
        <div>
       
            {[...Array(gridsLength)].map((grid, idx) => (
                <Grid 
                    key={`Grid_${grid}`}
                    gridIndex={idx}
                />
            ))}
        </div>
    )  
}