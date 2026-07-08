const express = require("express");
const router = express.Router();

const { getSalesDashboard } = require("../services/salesService");

router.get("/sales/:brandCode", async (req, res) => {
  try {
    const { brandCode } = req.params;
    const { month } = req.query;

    const data = await getSalesDashboard({
      brandCode,
      month: month || "2026_06",
    });

    res.json(data);
  } catch (error) {
    console.error("Sales API error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load sales dashboard",
      error: error.message,
    });
  }
});

module.exports = router;