const sequelize = require("../db/conection");
const { Sequelize, DataTypes } = require("sequelize");

const Anillo = sequelize.define(
  "Anillo",
  {
    prtg_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    interface: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "anillo",
    timestamps: false,
  }
);

module.exports = { Anillo }