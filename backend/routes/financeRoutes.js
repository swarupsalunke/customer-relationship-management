const express = require("express");

const router = express.Router();

const {
  createIncome,
  createExpense,
  getFinanceTransactions,
  getFinanceDashboard,
} = require("../controllers/financeController");


// Finance Dashboard
router.get("/dashboard", getFinanceDashboard);


// Transactions
router.get("/transactions", getFinanceTransactions);


// Income
router.post("/income", createIncome);


// Expense
router.post("/expense", createExpense);


module.exports = router;