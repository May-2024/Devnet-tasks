const express = require("express");
const router = express.Router();
const { getFimBase } = require("../controllers/base_fim");

router.get("/", async (req, res, next) => {
  try {
    const data = await getFimBase();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
