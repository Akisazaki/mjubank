
import dotenv from 'dotenv'
import { ConnectionOptions } from "typeorm"
dotenv.config()

const dbConfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  synchronize: false,
  logging: false,
  entities: ["src/model/entity/**/*.ts"],
  migrations: ["src/model/migration/**/*.ts"],
  subscribers: ["src/model/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/model/entity",
    migrationsDir: "src/model/migration",
    subscribersDir: "src/model/subscriber",
  },
}

export default dbConfig