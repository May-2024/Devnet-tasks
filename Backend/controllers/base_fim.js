const { FimBase, DatesFimBase } = require("../models/base_fim");

async function getFimBase() {
    try {
        const fimStatus = await FimBase.findAll();
        const datesResets = await DatesFimBase.findAll();
        return {
            fimStatus,
            datesResets
        };
    } catch(error) {
        return error.message;
    }
};

module.exports = { getFimBase };