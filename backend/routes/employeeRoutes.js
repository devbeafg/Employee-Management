import express from 'express'
import {getAllEmployee, getEmployee, deleteEmployee, updateEmployee, createEmployee} from "../controller/employeeController.js"

const router = express.Router()

router.post("/", createEmployee);
router.get("/", getAllEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.get("/:id", getEmployee);

export default router;