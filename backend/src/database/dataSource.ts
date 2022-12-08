import "reflect-metadata"
import { DataSource } from "typeorm"
import { Grids } from "./entities/grids.js"
import { ProblemInfo } from "./entities/problemInfo.js"
import { psqlPassword, psqlUsername, psqlDatabase} from "./envVars.js"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: `${psqlUsername}`,
    password: `${psqlPassword}`,
    database: `${psqlDatabase}`,
    synchronize: true,
    logging: true,
    entities: [Grids, ProblemInfo],
    migrations: [],
    subscribers: [],
})