const express = require("express");
const router = express.Router();
const searchController = require("../../../app/controllers/search/search.controller");

router.get("/search", searchController.doSearch);


module.exports = router;