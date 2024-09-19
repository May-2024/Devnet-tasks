const { FimBase, DatesFimBase } = require("../models/base_fim");

async function getFimBase() {
    try {
        const fimStatus = await FimBase.findAll();
        const datesResets = await DatesFimBase.findAll();
        return {
            fimStatus,
            datesResets
        };
    } catch(error) {
        return error.message;
    }
};

class FimService {
    async getFim() {
      try {
        const dataFim = await FimBase.findAll();
        const datesResets = await DatesFimBase.findAll();

        const data = {
          fimStatus: dataFim,
          datesResets: datesResets,
        };
        
        return {
          statusCode: 200,
          message: "Información de las Base FiM obtenida exitosamente",
          data: data,
        };
      } catch (error) {
        throw new Error("Error al obtener la información de las Base FiM");
      }
    }
  }

module.exports = { FimService };