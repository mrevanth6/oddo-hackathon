const { v4: uuidv4 } = require("uuid");
const connection = require("../database"); // your mysql2 connection
const addVehicle =   async (req, res) => {
    const {
        registrationNumber,
        name,
        type,
        maxLoadCapacity,
        acquisitionCost,
    } = req.body;

    try {
        // Check if registration number already exists
        const [rows] = await connection.query(
            "SELECT id FROM vehicles WHERE registration_number = ?",
            [registrationNumber.toUpperCase()]
        );

        if (rows.length > 0) {
            return res.status(400).json({
                error: `Vehicle with Registration Number '${registrationNumber}' already exists.`
            });
        }

        // Insert new vehicle
        const id = uuidv4();

        await connection.query(
            `INSERT INTO vehicles
            (id, registration_number, name, type,
             max_load_capacity, acquisition_cost)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                id,
                registrationNumber.toUpperCase(),
                name,
                type,
                Number(maxLoadCapacity),
                Number(acquisitionCost)
            ]
        );

        res.status(201).json({
            id,
            registrationNumber: registrationNumber.toUpperCase(),
            name,
            type,
            maxLoadCapacity: Number(maxLoadCapacity),
            odometer: 0,
            acquisitionCost: Number(acquisitionCost),
            status: "Available",
            region: "Unassigned"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};
module.exports = { addVehicle };