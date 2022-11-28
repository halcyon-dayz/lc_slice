import React, {useEffect, useRef, useState} from "react";
import {Grid} from "../Grid"
import { PointedArray } from "../PointedArray";
import { useAppSelector } from "../../features/hooks";
import { RootState } from "../../utils/types";
import "./ds.css"
import { Graph} from "../Graph/Graph"


type DSDisplayProps = {
    rightWidth: number,
}

export const DataStructureDisplay = ({rightWidth}: DSDisplayProps) => {
    const gridsLength = useAppSelector((state: RootState) => state.grids.length);
    const arraysLength = useAppSelector((state: RootState) => state.arrays.length);
    const graphsLength = useAppSelector((state: RootState) => state.graphs.length);


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
            {[...Array(graphsLength)].map((graph, idx) => (
                <Graph key={`Graph_${idx}`} width={rightWidth}/>
            ))}
        </div>
    )  
}