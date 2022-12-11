import {Entity, Unique, PrimaryGeneratedColumn, Column} from "typeorm"


export enum GridInterpreter {
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  NORMALIZED = "NORMALIZED"
}

@Entity({name: "grids"})
@Unique(["problemNumber", "gridData"])
export class GridORM {
    @PrimaryGeneratedColumn("uuid")
    gridId: string

    @Column("int")
    problemNumber: number

    @Column("int")
    fromExample: number

    @Column("int")
    exampleIndex: number

    @Column({length: 255})
    label: string

    @Column("int", {array: true})
    gridData: number[][]

    @Column({
      type: "enum",
      enum: GridInterpreter,
      default: GridInterpreter.NUMBER
    })
    interpretAs: GridInterpreter

    width: number
    height: number
}