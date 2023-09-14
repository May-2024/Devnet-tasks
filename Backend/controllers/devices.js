const { Devices } = require("../models/devices");
const { DataDevices } = require("../models/data_devices");

async function getDevices() {
  const numDevices = await getNumberDevices();
  const devices = await Devices.findAll({
    order: [["id", "DESC"]],
    limit: numDevices,
  });
  return devices;
}

async function getNumberDevices() {
  const listDevices = await DataDevices.findAll();
  const numDevices = listDevices.length;
  return numDevices;
}

async function getOneDevice(ip) {
  const device = await DataDevices.findOne({ where: { ip: ip } });
  if (device !== null) {
    return {
      status: 200,
      data: device,
    };
  };
  return {
    status: 404,
    message: "El Dispositivo no existe en la base de datos.",
  };
}

async function createDevice(data) {
  try {
    const deviceDoesExist = await DataDevices.findOne({
      where: { ip: data.ip },
    });
    if (deviceDoesExist === null) {
      const newDevice = await DataDevices.create({
        ip: data.ip,
        type_device: data.type_device,
        site: data.site,
        dpto: data.dpto,
        red: data.red,
      });
      return {
        status: 201,
        message: "El Dispositivo ha sido creado exitosamente, espere unos minutos para que el sistema actualice los datos.",
        data: newDevice,
      };
    }
    return {
      status: 409,
      message: "El Dispositivo ya existe en la base de datos.",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function editOneDevice(id, changes) {
  try {
    const device = await DataDevices.findByPk(id);
    if (device !== null) {
      await DataDevices.update(
        {
          ip: changes.ip,
          type_device: changes.type_device,
          site: changes.site,
          dpto: changes.dpto,
          red: changes.red,
        },
        { where: { id: id } }
      );
      const deviceUpdated = await DataDevices.findByPk(id);
      return {
        status: 200,
        message: "El Dispositivo ha sido modificado exitosamente.",
        data: deviceUpdated,
      };
    }
    return {
      status: 404,
      message: "El Dispositivo no existe en la base de datos.",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteDevice(ip) {
  try {
    const device = await DataDevices.findOne({ where: { ip: ip } });
    if (device !== null) {
      await DataDevices.destroy({ where: { id: device.id } });
      const checkDeviceIsDeleted = await DataDevices.findByPk(device.id);
      if (checkDeviceIsDeleted === null) {
        return {
          status: 200,
          message: "El Dispositivo ha sido eliminado exitosamente",
        };
      } else {
        throw error;
      }
    }
    return {
      status: 404,
      message: "El Dispositivo no existe en la base de datos",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { getDevices, createDevice, editOneDevice, deleteDevice, getOneDevice };
