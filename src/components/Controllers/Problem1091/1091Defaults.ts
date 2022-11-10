import { Cell, GridDS, ArrDS} from "../../../utils/types";

const GRID_1091_A: Cell[][] = [
    [
        {data: 0, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"}
    ],
    [
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"}
    ],
]

const GRID_1091_B: Cell[][] = [
    [
        {data: 0, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
    ],
    [
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
    ],
    [
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
    ]
]

const GRID_1091_C: Cell[][] = [
    [
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
    ],
    [
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
    ],
    [
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
    ]
]

const GRID_1091_D: Cell[][] = [
    [
        {data: 0, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
    ],
    [
        {data: 0, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
    ],
    [
        {data: 0, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
    ],
    [
        {data: 0, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"},
    ],
    [
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"}
    ],
    [
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 1, status: "UNEXPLORED"},
        {data: 0, status: "UNEXPLORED"}
    ],
]

export const DEFAULT_1091_GRIDS = [
    GRID_1091_A,
    GRID_1091_B,
    GRID_1091_C,
    GRID_1091_D
]