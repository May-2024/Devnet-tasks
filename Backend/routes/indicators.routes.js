const express = require("express");
const router = express.Router();
const { overall } = require("../controllers/indicators/overallKpi");
const { getClients } = require("../controllers/clients");
const { getSwitches } = require('../controllers/switches')
const { getDisponibilidad } = require("../controllers/indicators/disponibilidad");
const { getInfraSolucion } = require("../controllers/indicators/infra_solucion");
const { dashboardMesh } = require("../controllers/indicators/mesh");
const { dashboardDevices } = require("../controllers/indicators/devices");
const { dashboardFirewalls } = require("../controllers/indicators/firewalls");
const { dashboardWan } = require("../controllers/indicators/wan");

const allClients = async () => {
  try {
    const clients = await getClients();
    const allClientsJSON = clients.map((client) => client.toJSON());
    return allClientsJSON;
  } catch (error) {
  };
};

const allSwitches = async () => {
  try {
    const switches = await getSwitches();
    const allSwitchesJSON = switches.map((switch_) => switch_.toJSON());
    return allSwitchesJSON;
  } catch (error) {
  };
};

router.get("/", async (req, res, next) => {
  try {
    const listAllClients = await allClients();
    const listAllSwitches = await allSwitches();
    const dataMesh = await dashboardMesh();
    const dataDevices = await dashboardDevices();
    const dataFirewalls = await dashboardFirewalls();
    const kpiWan = await dashboardWan();

    const overallKpi = overall(listAllClients);
    const disponibilidad = getDisponibilidad(listAllClients);
    const infraSolucion = getInfraSolucion(listAllSwitches);

    const allIndicators = {
      overallKpi: overallKpi,
      disponibilidad: disponibilidad,
      infra_solucion: infraSolucion,
      mesh: {
        palasTotales: dataMesh.totalPalas,
        palasStatus2: dataMesh.palasStatus2,
        palasFailed: dataMesh.palasFailed,
        palasWarnings: dataMesh.palasWarnings,
        palasOk: dataMesh.palasOk,
        caexTotales: dataMesh.totalCaex,
        caexStatus2: dataMesh.caexStatus2,
        caexFailed: dataMesh.caexFailed,
        caexWarnings: dataMesh.caexWarnings,
        caexOk: dataMesh.caexOk,
      },
      devices: {
        numTotalDevices: dataDevices.numTotalDevices,
        numTotalCameras: dataDevices.numTotalCameras,
        numTotalAp: dataDevices.numTotalAp,
        numTotalOthers: dataDevices.numTotalOthers,
        numCamerasUp: dataDevices.numCamerasUp,
        numCamerasDown: dataDevices.numCamerasDown,
        numApUp: dataDevices.numApUp,
        numApDown: dataDevices.numApDown,
        numApDown: dataDevices.numApDown,
        numOthersUp: dataDevices.numOthersUp,
        numOthersDown: dataDevices.numOthersDown
      }, 
      firewalls: {
        numFwCorpAlive: dataFirewalls.numFwCorpAlive,
        numFwCorpDown: dataFirewalls.numFwCorpDown,
        numFwCommuniAlive: dataFirewalls.numFwCommuniAlive,
        numFwCommuniDown: dataFirewalls.numFwCommuniDown,
      },
      wan: {
        kpiWan: kpiWan,
      }
    };
    
    res.json(allIndicators);

  } catch (error) {
    console.error(error);
    next(error);
  };
});

module.exports = router;
