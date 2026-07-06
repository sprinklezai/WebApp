const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fandb-sprinklez-dashboard-live.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.send("Sprinklez Backend is running...");
});

app.use("/api", authRoutes);
app.use("/api", dataRoutes);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});