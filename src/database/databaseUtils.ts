enum PSQLDataType {
  BIGINT = "BIGINT",
  INTEGER_ARRAY = "INTEGER[][]",
  SMALLINT = "SMALLINT"

}



export const addColumnToGrids = (columnName: string, dataType: PSQLDataType): string => {
  return `ALTER TABLE grids
  ADD COLUMN ${columnName} ${dataType}`;
}

export const changeDimensionsOfGrid = (
  width: number, 
  height: number, 
  pNum: number
) => {
  return `UPDATE grids
  SET width = ${width}, height = ${height}
  WHERE problem_number = 200;
  `
}
