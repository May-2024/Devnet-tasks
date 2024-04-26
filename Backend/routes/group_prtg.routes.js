const express = require("express");
const router = express.Router();
const { getPrtgGroupData } = require("../controllers/group_prtg");

router.get("/", async (req, res, next) => {
  try {
    const data = await getPrtgGroupData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
