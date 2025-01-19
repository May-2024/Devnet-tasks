const { Devices } = require("../models/devices");
const axios = require("axios");
const { createObjectCsvWriter, createObjectCsvStringifier  } = require('csv-writer');


class DevicesService {
  async getDevices() {
    try {
      const data = await Devices.findAll();
      return {
        statusCode: 200,
        message: "Información de los Dispositivos obtenida exitosamente",
        data: data,
      };
    } catch (error) {
      throw new Error("Error al obtener la información de los Dispositivos");
    }
  }

  async getOneDevice(host) {
    try {
      const device = await Devices.findOne({ where: { host: host } });
      if (device !== null) {
        return {
          statusCode: 200,
          message: "Dispositivo obtenido exitosamente",
          data: device,
        };
      }
      return {
        status: 404,
        message: "El Dispositivo no existe en la base de datos.",
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener la información del Dispositivo");
    }
  }

  async createDevice(data) {
    try {
      const existingDevice = await Devices.findOne({
        where: { host: data.host },
      });

      if (!existingDevice) {
        const newDevice = await Devices.create({
          host: data.host,
          type: data.type,
          site: data.site,
          dpto: data.dpto,
          red: data.red,
        });

        return {
          statusCode: 201,
          message:
            "Dispositivo creado exitosamente. Espere unos minutos para que el sistema actualice los datos.",
          data: newDevice,
        };
      }

      return {
        statusCode: 409,
        message: "El dispositivo ya existe en la base de datos.",
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error al crear el dispositivo");
    }
  }

  async editOneDevice(id, changes) {
    try {
      const device = await Devices.findByPk(id);
      if (device !== null) {
        await Devices.update(
          {
            host: changes.host,
            type: changes.type,
            site: changes.site,
            dpto: changes.dpto,
            red: changes.red,
          },
          { where: { id: id } }
        );
        const deviceUpdated = await Devices.findByPk(id);
        return {
          statusCode: 200,
          message: "El Dispositivo ha sido modificado exitosamente.",
          data: deviceUpdated,
        };
      }
      return {
        statusCode: 404,
        message: "El Dispositivo no existe en la base de datos.",
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error al editar el dispositivo");
    }
  }

  async deleteDevice(host) {
    try {
      const device = await Devices.findOne({ where: { host: host } });
      if (device !== null) {
        await Devices.destroy({ where: { host: device.host } });
        const checkDeviceIsDeleted = await Devices.findByPk(device.host);
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
      throw new Error("Error al eliminar el dispositivo");
    }
  }


  async getCamarasCsv() {
    try {
      console.log("Entro añ service")
      const cctv_list_servers = [
        "10.225.0.253",
        // Agrega más IPs aquí si es necesario
      ];
  
      const username = "roiss";
      const password = "MNuqYXiugdfsY1NvKYdr";
      const dataCamaras = [
        {
          cctvServer: '192.168.1.2',
          integrator: 'Integrator2',
          name: 'Camera2',
          server: 'Server2',
          enabled: false,
          valid: true,
          url: 'http://camera2-url',
        },
      ];
  
      // Generar el archivo CSV en memoria con separador ;
      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'cctvServer', title: 'CCTV Server' },
          { id: 'integrator', title: 'Integrator' },
          { id: 'name', title: 'Name' },
          { id: 'server', title: 'Server' },
          { id: 'enabled', title: 'Enabled' },
          { id: 'valid', title: 'Valid' },
          { id: 'url', title: 'URL' },
        ],
        fieldDelimiter: ';', // Aquí configuramos el separador
      });
  
      const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(dataCamaras);
  
      return csvContent; // Retornamos el contenido del CSV
    } catch (error) {
      console.error('Error al obtener las cámaras:', error);
      throw new Error("Error al obtener la información del dispositivo");
    }
  }
}
// async function editOneDevice(id, changes) {
//   try {
//     const device = await DataDevices.findByPk(id);
//     if (device !== null) {
//       await DataDevices.update(
//         {
//           ip: changes.ip,
//           type_device: changes.type_device,
//           site: changes.site,
//           dpto: changes.dpto,
//           red: changes.red,
//         },
//         { where: { id: id } }
//       );
//       const deviceUpdated = await DataDevices.findByPk(id);
//       return {
//         status: 200,
//         message: "El Dispositivo ha sido modificado exitosamente.",
//         data: deviceUpdated,
//       };
//     }
//     return {
//       status: 404,
//       message: "El Dispositivo no existe en la base de datos.",
//     };
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

module.exports = { DevicesService };
