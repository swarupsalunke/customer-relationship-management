const express = require("express");

const router = express.Router();

const {
  getPriceProducts,
  createPrice,
  getPendingPrices,
  approvePrice,
  rejectPrice,
  getPriceHistory,
  getPriceStats,
  bulkCreatePrices,
} = require("../controllers/priceController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// ======================================================
// PRICE MANAGEMENT
// ======================================================


// GET PRICE PRODUCTS

router.get(
  "/",
  authMiddleware,
  roleMiddleware(
    "SUPER_ADMIN",
    "DIRECTOR",
    "MANAGER",
    "ACCOUNTANT",
    "SALES_EXECUTIVE"
  ),
  getPriceProducts
);


// PRICE STATISTICS

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware(
    "SUPER_ADMIN",
    "DIRECTOR",
    "MANAGER"
  ),
  getPriceStats
);


// PENDING PRICE REVISIONS

router.get(
  "/pending",
  authMiddleware,
  roleMiddleware(
    "SUPER_ADMIN",
    "DIRECTOR",
    "MANAGER"
  ),
  getPendingPrices
);


// CREATE PRICE REVISION

router.post(
  "/",
  authMiddleware,
  roleMiddleware(
    "SUPER_ADMIN",
    "DIRECTOR",
    "MANAGER"
  ),
  createPrice
);


// BULK PRICE UPDATE

router.post(
  "/bulk",
  authMiddleware,
  roleMiddleware(
    "SUPER_ADMIN",
    "DIRECTOR",
    "MANAGER"
  ),
  bulkCreatePrices
);


// PRICE HISTORY

router.get(
  "/history/:productId",
  authMiddleware,
  roleMiddleware(
    "SUPER_ADMIN",
    "DIRECTOR",
    "MANAGER",
    "ACCOUNTANT",
    "SALES_EXECUTIVE"
  ),
  getPriceHistory
);


// APPROVE PRICE

router.put(
  "/:id/approve",
  authMiddleware,
  roleMiddleware(
    "SUPER_ADMIN",
    "DIRECTOR"
  ),
  approvePrice
);


// REJECT PRICE

router.put(
  "/:id/reject",
  authMiddleware,
  roleMiddleware(
    "SUPER_ADMIN",
    "DIRECTOR"
  ),
  rejectPrice
);


module.exports = router;