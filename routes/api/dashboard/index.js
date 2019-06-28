const express = require("express");
const router = express.Router();

router.get("/dashboard/home");
router.get("/dashboard/calendar/show");
router.get("/dashboard/programs");
router.get("/dashboard/surveys");

module.exports = router;
