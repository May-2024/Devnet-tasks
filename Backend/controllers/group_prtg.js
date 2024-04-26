const { GroupPrtg } = require("../models/group_prtg");

async function getPrtgGroupData() {
  const data = await GroupPrtg.findAll();
  return data;
}

module.exports = { getPrtgGroupData };
