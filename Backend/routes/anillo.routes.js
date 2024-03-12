const express = require("express");
const router = express.Router();
const { getDataAnillo } = require("../controllers/anillo");

router.get("/", async (req, res, next) => {
  try {
    const data = await getDataAnillo();
    res.json(data);
    
  } catch (error) {
    console.error(error)
    next(error);
  }
});


module.exports = router;
