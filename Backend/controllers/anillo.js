const { Anillo } = require("../models/anillo");

async function getDataAnillo() {
  const data = await Anillo.findAll();
  return data;
}

module.exports = { getDataAnillo };
