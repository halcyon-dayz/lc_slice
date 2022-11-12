import React, {useEffect} from "react";
import {Grid} from "../Grid"
import { PointedArray } from "../PointedArray";
import { useAppSelector } from "../../features/hooks";
import { RootState } from "../../utils/types";
//import { arrowManager } from "../../utils/arrows";

export const PathFindingVisualizer = () => {
    const gridsLength = useAppSelector((state: RootState) => state.grids.length);
    const arraysLength = useAppSelector((state: RootState) => state.arrays.length);

    /*useEffect(() => {
        const nodeList = document.querySelectorAll(".grid");
        if (nodeList.length <= 0) {
            return;
        }
        for (let i = 0; i < nodeList.length - 1; i++) {
            arrowManager.add(nodeList[i], nodeList[i + 1]);
        }
    }, []) */
    return (
        <div>
            {[...Array(gridsLength)].map((grid, idx) => (
                <Grid 
                    key={`Grid_${idx}`}
                    gridIndex={idx}
                />
            ))}
            {[...Array(arraysLength)].map((array, idx) => (
                <PointedArray 
                    key={`Array_${idx}`}
                    pointerLocations={array.pointerLocations}
                    cells={array.data}
                />
            ))}
        </div>
    )  
}