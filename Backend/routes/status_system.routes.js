const express = require("express");
const router = express.Router();
const {date_status_system} = require('../controllers/status');

router.get('/', async (req, res, next) => {
    try {
        const data = await date_status_system();
        res.json(data);
    } catch (error) {
        next(error);
    };
});

module.exports = router;