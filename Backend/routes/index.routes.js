const express = require("express");
const clientsRoutes = require("./clients.routes");
const switchesRoutes = require("./switches.routes");
const statusRoutes = require("./status_system.routes");
const indicatorsRoutes = require("./indicators.routes");
const upsRoutes = require("./ups.routes");
const vpnRoutes = require("./vpn.routes");
const meshRoutes = require("./mesh.routes");
const devicesRoutes = require("./devices.routes");
const firewallsRoutes = require("./firewalls.routes");
const wanRoutes = require("./wan.routes");
const authRoutes = require("./auth.routes");
const userRoutes = require("./users.routes");
const neighborsRoutes = require("./neighbors.routes");
const interfacesRoutes = require("./interfaces.routes");
const systemHealthRoutes = require("./system_health.routes");
const routeDefaultRoutes = require("./route_default.routes");
const statusCoresRoutes = require("./status_core.routes");
const infra_general = require("./inf_gen.routes");
const fimRoutes = require("./fim.routes");
const anilloOpitRoutes = require("./anillo_opit.routes");
const actilityRoutes = require("./actility.routes");
const meshProcessRoutes = require("./meshProcess.routes");
const groupPrtgRoutes = require("./group_prtg.routes");
const dateTimeRoutes = require("./datetimes.routes");
const dockersRoutes = require("./dockers.routes");
const anilloUgRoutes = require("./anillo_ug.routes");
const anilloTetraRoutes = require("./anillo_tetra.routes");
const flotacionOtRoutes = require("./flotacion_ot.routes");
const router = express.Router();

const allRoutes = (app) => {
  app.use("/api/v1/candelaria", router);
  router.use("/clients", clientsRoutes);
  router.use("/switches", switchesRoutes);
  router.use("/status", statusRoutes);
  router.use("/indicators", indicatorsRoutes);
  router.use("/ups", upsRoutes);
  router.use("/vpn", vpnRoutes);
  router.use("/mesh", meshRoutes);
  router.use("/devices", devicesRoutes);
  router.use("/firewalls", firewallsRoutes);
  router.use("/wan", wanRoutes);
  router.use("/auth", authRoutes);
  router.use("/users", userRoutes);
  router.use("/neighbors", neighborsRoutes);
  router.use("/interfaces", interfacesRoutes);
  router.use("/system-health", systemHealthRoutes);
  router.use("/route-default", routeDefaultRoutes);
  router.use("/status-cores", statusCoresRoutes);
  router.use("/infra_general", infra_general);
  router.use("/fim", fimRoutes);
  router.use("/anillo-opit", anilloOpitRoutes);
  router.use("/actility", actilityRoutes);
  router.use("/mesh-process", meshProcessRoutes);
  router.use("/group-prtg", groupPrtgRoutes);
  router.use("/datetimes", dateTimeRoutes);
  router.use("/dockers", dockersRoutes);
  router.use("/anillo-ug", anilloUgRoutes);
  router.use("/anillo-tetra", anilloTetraRoutes);
  router.use("/flotacion-ot", flotacionOtRoutes);
};

module.exports = { allRoutes };
