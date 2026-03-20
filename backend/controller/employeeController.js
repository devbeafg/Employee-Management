import { query } from "../utils/connectDB.js";
import { createRoleQuery, createEmployeeTableQuery, getAllEmployeeQuery, createEmployeeQuery, getEmployeeQuery, deleteEmployeeQuery, updateEmployeeQuery } from "../utils/sqlQuery.js";

const getAllEmployee = async (req, res, next) => {
    try {
        const response = await query(`SELECT to_regclass('employee_details')`)
        console.log(response);

        if (!response.rows[0].to_regclass) {
            await query(createRoleQuery);
            await query(createEmployeeTableQuery);
        }

        const { rows } = await query(getAllEmployeeQuery)
        res.json(rows)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

const getEmployee = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await query(getEmployeeQuery, [id]);
        console.log(data);

        if (!data.rows.length) {
            return res.status(404).json({ error: "Employee record not found" })
        }
        res.json(data.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

const deleteEmployee = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await query(deleteEmployeeQuery, [id])

        if (!data.rowCount) {
            return res.status(404).json({ error: "Employee record not found" })
        }

        res.json({ message: "Employee successfully deleted" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

const updateEmployee = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name, email, age, role, salary } = req.body;

        const result = await query(updateEmployeeQuery,
            [name, email, age, role, salary, id]
        );

        if (result.rowCount === 0) {
            return res.json({ error: "Employee not updated" })
        }

        res.json(result.rows[0])

    } catch (error) {
        res.json({ error: error.message })
    }
}

const createEmployee = async (req, res, next) => {
    try {
        const { name, email, age, role, salary } = req.body;

        if (!name || !role || !age || !salary || !email) {
            return res.status(400).json({ error: "Missing fields" })
        }

        const data = await query(createEmployeeQuery,
            [name, email, age, role, salary]
        );

        res.json(data.rows[0])
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

export { getAllEmployee, getEmployee, deleteEmployee, updateEmployee, createEmployee };