import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import employeeRoutes from "./routes/employeeRoutes.js"

dotenv.config();

const app = express();
const port = 3000;
const corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/api/employee", employeeRoutes)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 5000;

    const message = err.message || "Internal server error"

    return err.status(statusCode).json({error: message})
})

app.get("/", (req, res) => {
    res.send("API Working")
});

app.listen(port, () =>
    console.log("Server started on PORT: " + port))