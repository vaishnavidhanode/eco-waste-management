const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Test database connection
pool.connect()
    .then(client => {
        console.log("PostgreSQL connected successfully");
        client.release();
    })
    .catch(error => {
        console.error("Database connection failed:", error.message);
    });

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "Smart Waste API is working!"
    });
});
// Create pickup request
app.post("/api/requests", async (req, res) => {

    try {

        const {
            name,
            phone,
            waste_category,
            pickup_address,
            pickup_date,
            pickup_time,
            description
        } = req.body;

        if (
            !name ||
            !phone ||
            !waste_category ||
            !pickup_address ||
            !pickup_date
        ) {
            return res.status(400).json({
                error: "Please fill all required fields."
            });
        }

        const result = await pool.query(
            `INSERT INTO pickup_requests
            (
                name,
                phone,
                waste_category,
                pickup_address,
                pickup_date,
                pickup_time,
                description
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                name,
                phone,
                waste_category,
                pickup_address,
                pickup_date,
                pickup_time,
                description
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to create pickup request."
        });
    }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});