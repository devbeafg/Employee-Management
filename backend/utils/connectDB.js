import pg from "pg"
import env from "dotenv"

env.config();

const requereEnvVars = [
    "PG_USER", "PG_HOST", "PG_DATABASE", "PG_PORT", "PG_PASSWORD"
]

requereEnvVars.forEach((varName) => {
    if(!process.env[varName]){
        console.log(`missing required env variable: ${varName}`);
        process.exit(1)
    }
});

const db = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
    password: process.env.PG_PASSWORD,
})

db.connect().then(() => console.log("Database is connected")).catch((err)=> {
    console.log("Connection denied", err);
    process.exit(1);
});

db.on("error", (err)=> {
    console.log("Database erro: ", err)
});

export const query = (text, params) => db.query(text, params);