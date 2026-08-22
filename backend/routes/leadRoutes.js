const express = require("express");

const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

const router = express.Router();


// ==========================================
// CREATE LEAD
// POST /api/leads
// ==========================================

router.post("/", createLead);


// ==========================================
// GET ALL LEADS
// GET /api/leads
// ==========================================

router.get("/", getAllLeads);


// ==========================================
// GET SINGLE LEAD
// GET /api/leads/:id
// ==========================================

router.get("/:id", getLeadById);


// ==========================================
// UPDATE LEAD
// PUT /api/leads/:id
// ==========================================

router.put("/:id", updateLead);


// ==========================================
// DELETE LEAD
// DELETE /api/leads/:id
// ==========================================

router.delete("/:id", deleteLead);


module.exports = router;