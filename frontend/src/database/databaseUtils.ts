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

type CreateGridOnDatabaseProps = {
  problemNumber: number,
  data: number[][],
  label: string,
}

const genreatePSQL2DARRAY = (data: number[][]) => {
  let retString = ``;
  retString += `{`;
  for (let i = 0; i < data.length; i++) {
    retString += `{`
    for (let j = 0; j < data[0].length; j++) {
      retString += `${data[i][j]}`
    }
    if (i !== data.length - 1) {
      retString += `}\n`
    } else {
      retString += `}`
    }
  }
}

export const createGridOnDatabase = ({
  problemNumber,
  data,
  label,
}: CreateGridOnDatabaseProps) => {

  const dataArray = genreatePSQL2DARRAY(data);

  return `INSERT INTO grids
  VALUES(${problemNumber},
  '${dataArray}',
  ${data[0].length},
  ${data.length},
  '${label}'))`;
}
