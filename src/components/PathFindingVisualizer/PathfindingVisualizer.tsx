import React, {useEffect, useRef, useState} from "react";
import {Grid} from "../Grid"
import { PointedArray } from "../PointedArray";
import { useAppSelector } from "../../features/hooks";
import { RootState } from "../../utils/types";
import "./ds.css"
import { Graph} from "../Graph/Graph"

export const PathFindingVisualizer = () => {
    const gridsLength = useAppSelector((state: RootState) => state.grids.length);
    const arraysLength = useAppSelector((state: RootState) => state.arrays.length);


    return (
        <div className="data_structures_container">
            {[...Array(gridsLength)].map((grid, idx) => (
                <Grid 
                    key={`Grid_${idx}`}
                    gridIndex={idx}
                />
            ))}
            {[...Array(arraysLength)].map((array, idx) => {
                console.log(array);
                return (<PointedArray 
                    arrayIndex={idx}
                    key={`Array_${idx}`}
                />);
            })}
            {[...Array(1)].map((graph, idx) => (
                <Graph key={`Graph_${idx}`}/>
            ))}
        </div>
    )  
}