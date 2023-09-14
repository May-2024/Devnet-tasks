const sequelize = require("../db/conection");
const { Sequelize, DataTypes } = require("sequelize");

const Switches = sequelize.define(
  "Switches",
  {
    dispositivo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    group: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_prtg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastup_prtg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastdown_prtg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reachability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ups1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ups2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_ups1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_ups2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "switches",
    timestamps: false,
  }
);

module.exports = {Switches};