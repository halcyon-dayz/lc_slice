import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ProblemInfo {
    @PrimaryGeneratedColumn("uuid")
    problemId: string

    @Column("int")
    problemNumber: number

    @Column()
    title: string

    @Column()
    description: string

    @Column("int")
    numExamples: number

    @Column({default: false})
    hasGraphs: boolean

    @Column({default: false})
    hasGrids: boolean

    @Column({default: false})
    hasArrays: boolean
}