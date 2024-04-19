const express = require("express");
const router = express.Router();
const { getMeshProcessData } = require("../controllers/mesh_process");

router.get("/", async (req, res, next) => {
  try {
    const data = await getMeshProcessData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
