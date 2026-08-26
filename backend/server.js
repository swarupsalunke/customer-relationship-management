const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const productRoutes = require("./routes/productRoutes");
const priceRoutes = require("./routes/priceRoutes");
const dailyCashReportRoutes = require("./routes/dailyCashReportRoutes");
const orderRoutes = require("./routes/orderRoutes");
const leadRoutes = require("./routes/leadRoutes");
const qrRoutes = require("./routes/qrRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const schemeRoutes = require("./routes/schemeRoutes");
const financeRoutes = require("./routes/financeRoutes");
const reportRoutes = require("./routes/reportRoutes");
const systemSettingsRoutes = require("./routes/systemSettingsRoutes");
const manufacturingBatchRoutes = require("./routes/manufacturingBatchRoutes");
const batchCostVerificationRoutes = require("./routes/batchCostVerificationRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const stockMovementRoutes = require("./routes/stockMovementRoutes");
const dispatchRoutes = require("./routes/dispatchRoutes");
const inboundMaterialRoutes = require("./routes/inboundMaterialRoutes");

const path = require("path");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/daily-cash-reports", dailyCashReportRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/finance", financeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/system-settings", systemSettingsRoutes);
app.use("/api/manufacturing/batches", manufacturingBatchRoutes);
app.use("/api/manufacturing/cost-verification", batchCostVerificationRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/inventory/movements", stockMovementRoutes);
app.use("/api/dispatch", dispatchRoutes);
app.use("/api/inbound", inboundMaterialRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "OnePlus Spark CRM/ERP API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});