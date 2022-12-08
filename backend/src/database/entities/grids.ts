import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"


enum GridInterpreter {
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  NORMALIZED = "NORMALIZED"
}

@Entity({name: "grids"})
export class Grids {
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
    data: number[][]

    @Column({
      type: "enum",
      enum: GridInterpreter,
      default: GridInterpreter.NUMBER
    })
    interpretAs: GridInterpreter
}