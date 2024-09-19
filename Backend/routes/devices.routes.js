const express = require("express");
const router = express.Router();
const { validateData } = require("../middlewares/validator.handler");
const {
  createDevicesSchema,
  editDevicesSchema,
} = require("../schemas/devices.schema");
const passport = require("passport");
const { checkRoles } = require("../middlewares/auth.handler");
const { DevicesService } = require("../controllers/devices");

const Devices = new DevicesService();

// Obtener todos las Devices
router.get("/", async (req, res, next) => {
  try {
    const response = await Devices.getDevices();
    res.status(response.statusCode).json({
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    next(error);
  }
});


// router.get("/:ip", async (req, res, next) => {
//   try {
//     const ip = req.params.ip;
//     const device = await getOneDevice(ip);
//     res.status(device.status).json({
//       status: device.status,
//       message: device.message,
//       error: device.error,
//       data: device.data,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// router.post(
//   "/new",
//   passport.authenticate("jwt", { session: false }),
//   checkRoles("admin", "staff"),
//   validateData(createDevicesSchema),
//   async (req, res, next) => {
//     try {
//       const data = req.body;
//       const newDevice = await createDevice(data);
//       res.status(newDevice.status).json({
//         status: newDevice.status,
//         message: newDevice.message,
//         error: newDevice.error,
//         data: newDevice.data,
//       });
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   }
// );

// router.put(
//   "/edit/:id",
//   passport.authenticate("jwt", { session: false }),
//   checkRoles("admin", "staff"),
//   validateData(editDevicesSchema),
//   async (req, res, next) => {
//     try {
//       const id = req.params.id;
//       const changes = req.body;
//       const deviceEdit = await editOneDevice(id, changes);
//       res.status(deviceEdit.status).json({
//         status: deviceEdit.status,
//         message: deviceEdit.message,
//         error: deviceEdit.error,
//         data: deviceEdit.data,
//       });
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   }
// );

// router.delete(
//   "/remove/:id",
//   passport.authenticate("jwt", { session: false }),
//   checkRoles("admin", "staff"),
//   async (req, res, next) => {
//     try {
//       const id = req.params.id;
//       const deviceDeleted = await deleteDevice(id);
//       res.status(deviceDeleted.status).json({
//         status: deviceDeleted.status,
//         message: deviceDeleted.message,
//         error: deviceDeleted.error,
//         data: deviceDeleted.data,
//       });
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   }
// );

module.exports = router;
