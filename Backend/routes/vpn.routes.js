const express = require("express");
const router = express.Router();
const { getUsersVpn } = require("../controllers/vpn");

router.get("/", async (req, res, next) => {
  try {
    const usersVpn = await getUsersVpn();
    res.json(usersVpn);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
