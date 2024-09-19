const express = require("express");
const router = express.Router();
const { FimService } = require("../controllers/base_fim");

const FimBase = new FimService();

router.get("/", async (req, res, next) => {
  try {
    const response = await FimBase.getFim();
    res.status(response.statusCode).json({
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
