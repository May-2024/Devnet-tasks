const { Wan } = require("../models/wan");
const { DataWan } = require("../models/data_wan");

async function getWan() {
  const numWan = await getNumberWan();
  const wan = await Wan.findAll({
    order: [["id", "DESC"]],
    limit: numWan,
  });
  return wan;
}

async function getNumberWan() {
  const listWan = await DataWan.findAll();
  const numWan = listWan.length;
  return numWan;
}

async function getOneWan(ip) {
  const wan = await DataWan.findOne({ where: { ip: ip } });
  if (wan !== null) {
    return {
      status: 200,
      data: wan,
    };
  };
  return {
    status: 404,
    message: "La UPS no existe en la base de datos.",
  };
}

async function createWan(data) {
  try {
    const wanDoesExist = await DataWan.findOne({ where: { ip: data.ip } });
    if (wanDoesExist === null) {
      const newWan = await DataWan.create({
        ip: data.ip
      });
      return {
        status: 201,
        message: "WAN creada exitosamente, espere unos minutos para que el sistema actualice los datos.",
        data: newWan,
      };
    }
    return {
      status: 409,
      message: "La WAN ya existe en la base de datos.",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function editOneWan(id, changes) {
  try {
    const wan = await DataWan.findByPk(id);
    if (wan !== null) {
      await DataWan.update(
        {
          ip: changes.ip
        },
        { where: { id: id } }
      );
      const wanUpdated = await DataWan.findByPk(id);
      return {
        status: 200,
        message: "WAN modificado exitosamente.",
        data: wanUpdated,
      };
    }
    return {
      status: 404,
      message: "WAN no existe en la base de datos.",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteWan(ip) {
  try {
    const wan = await DataWan.findOne({ where: { ip: ip } });
    if (wan !== null) {
      await DataWan.destroy({ where: { id: wan.id } });

      const checkWanIsDeleted = await DataWan.findByPk(wan.id);
      if (checkWanIsDeleted === null) {
        return {
          status: 200,
          message: "WAN eliminada exitosamente",
        };
      } else {
        throw error;
      }
    }
    return {
      status: 404,
      message: "WAN no existe en la base de datos",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { getWan, createWan, editOneWan, deleteWan, getOneWan };
