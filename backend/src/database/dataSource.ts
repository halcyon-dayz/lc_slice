import "reflect-metadata"
import { DataSource } from "typeorm"
import { Grids, ProblemInfo} from "./entities"
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