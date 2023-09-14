const sequelize = require("../db/conection");
const { Sequelize, DataTypes } = require("sequelize");

const columns = {
  email: {
    type: DataTypes.STRING(225),
    allowNull: true,
  },
  ip_lan: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  ip_origin: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  datetime: {
    type: DataTypes.STRING(100),
    allowNull: true,
  }
};

const Vpn_1 = sequelize.define("Vpn_1", columns, {
  tableName: "vpn_1",
  timestamps: false,
});

const Vpn_2 = sequelize.define("Vpn_2", columns, {
  tableName: "vpn_2",
  timestamps: false,
});

const Vpn_3 = sequelize.define("Vpn_3", columns, {
  tableName: "vpn_3",
  timestamps: false,
});


module.exports = { Vpn_1, Vpn_2, Vpn_3 }