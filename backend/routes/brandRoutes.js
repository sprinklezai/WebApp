const express = require("express");
const router = express.Router();

const { readExcel } = require("../services/excelService");

router.get("/brands", (req, res) => {
    try {
        const data = readExcel("Brand_Master.xlsx");
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to load brands" });
    }
});

module.exports = router;