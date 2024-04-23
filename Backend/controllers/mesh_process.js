const { MeshProcess } = require("../models/mesh_process");

async function getMeshProcessData() {
  const data = await MeshProcess.findAll();
  return data;
}

module.exports = { getMeshProcessData };
