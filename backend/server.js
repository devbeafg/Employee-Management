import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import employeeRoutes from "./routes/employeeRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: "*",
};

app.use(cors({
  origin: "*"
}));
app.use(bodyParser.json());
app.use("/api/employee", employeeRoutes)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const message = err.message || "Internal server error"

    return res.status(statusCode).json({ error: message });
})

app.get("/", (req, res) => {
    res.send("API Working")
});

app.listen(port, () =>
    console.log("Server started on PORT: " + port))