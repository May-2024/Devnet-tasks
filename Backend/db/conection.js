require('dotenv').config();
const { Sequelize } = require("sequelize");
const config = require("../config/config");

const environment = process.env.NODE_ENV || 'local';
const dbConfig = config[environment];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'mysql',
    logging: false,
  }
);

// Función para verificar la conexión a la base de datos
async function checkDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("The connection to the database has been established successfully.");
  } catch (error) {
    console.error("Could not connect to database:", error);
  }
}

checkDatabaseConnection();

module.exports = sequelize;