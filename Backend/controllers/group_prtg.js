const { GroupPrtg } = require("../models/group_prtg");

class GroupPrtgService {
  async getGroupPrtg() {
    try {
      const data = await GroupPrtg.findAll();
      return {
        statusCode: 200,
        message:
          "Información de los Grupos de PRTG para Infraestructura General obtenida exitosamente",
        data: data,
      };
    } catch (error) {
      throw new Error(
        "Error al obtener la información de los Grupos de PRTG para Infraestructura General"
      );
    }
  }

  async getPrtgGroupUpDown() {
    try {
      const data = await GroupPrtg.findAll();
      const dataUpDown = this.countStatus(data);
      return {
        statusCode: 200,
        message:
          "Información de los Grupos de PRTG Up y Down para Infraestructura General obtenida exitosamente",
        data: dataUpDown,
      };
    } catch (error) {
        console.error(error)
      throw new Error(
        "Error al obtener la información de los Grupos de PRTG Up y Down para Infraestructura General"
      );
    }
  }

  countStatus(data) {
    const result = data.reduce((acc, curr) => {
      // Si el grupo es "certificados candel aria", omitir el dispositivo
      if (
        curr.group &&
        curr.group.toLowerCase() === "certificados candelaria"
      ) {
        return acc;
      }

      const existingItem = acc.find((item) => item.device === curr.device);
      if (existingItem) {
        if (curr.status === "Up") {
          existingItem.up++;
        } else if (curr.status.toLowerCase().includes("down")) {
          existingItem.down++;
        }
      } else {
        const newItem = {
          device: curr.device,
          group: curr.rol,
          up: curr.status === "Up" ? 1 : 0,
          down: curr.status.toLowerCase().includes("down") ? 1 : 0,
        };
        acc.push(newItem);
      }
      return acc;
    }, []);

    return result;
  }
}

// async function getPrtgGroupData() {
//   const data = await GroupPrtg.findAll();
//   getPrtgGroupUpDown();
//   return data;
// }

// async function getPrtgGroupUpDown() {
//   const data = await GroupPrtg.findAll();
//   const dataUpDown = countStatus(data);
//   return dataUpDown;
// }

// function countStatus(data) {
//   const result = data.reduce((acc, curr) => {
//     // Si el grupo es "certificados candel aria", omitir el dispositivo
//     if (curr.group && curr.group.toLowerCase() === "certificados candelaria") {
//       return acc;
//     }

//     const existingItem = acc.find((item) => item.device === curr.device);
//     if (existingItem) {
//       if (curr.status === "Up") {
//         existingItem.up++;
//       } else if (curr.status.toLowerCase().includes("down")) {
//         existingItem.down++;
//       }
//     } else {
//       const newItem = {
//         device: curr.device,
//         group: curr.rol,
//         up: curr.status === "Up" ? 1 : 0,
//         down: curr.status === "Down" ? 1 : 0,
//       };
//       acc.push(newItem);
//     }
//     return acc;
//   }, []);

//   return result;
// }

module.exports = { GroupPrtgService };
