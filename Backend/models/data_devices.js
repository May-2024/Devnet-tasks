const sequelize = require("../db/conection");
const { Sequelize, DataTypes } = require("sequelize");

const DataDevices= sequelize.define(
  "DataDevices",
  {
    ip: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    type_device: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    site: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dpto: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    red: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    tableName: "data_devices",
    timestamps: false,
  }
);

module.exports = { DataDevices }
