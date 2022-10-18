import React, { useEffect, useState} from "react";
import { gridCellsSelector, gridSelector } from "../../features/grid/gridSlice";
import { GridStructureDisplay, RootState} from "../../types";
import {useSelector} from "react-redux"
import {Grid} from "../Grid"

export const PathFindingVisualizer = () => {
    const grid = useSelector(gridSelector);

    useEffect(() => {
        console.log("started");
    }, [])


    return (
        <Grid grid={grid}></Grid>
    )  
}