const sequelize = require("../db/conection");
const { Sequelize, DataTypes } = require("sequelize");

const columns = {
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  group: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  status_prtg: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  lastup_prtg: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  lastdown_prtg: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  device_ip_cisco: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  device_cisco: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  port_cisco: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  status_cisco: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  reachability_cisco: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  id_prtg: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  importancia: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  clave: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status_device_cisco: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  data_backup: {
    type: DataTypes.STRING(10),
    allowNull: true,
  }
};

const CSP = sequelize.define("CSP", columns, {
  tableName: "csp",
  timestamps: false,
});

const CSS = sequelize.define("CSS", columns, {
  tableName: "css",
  timestamps: false,
});

const CNP = sequelize.define("CNP", columns, {
  tableName: "cnp",
  timestamps: false,
});

const CNS = sequelize.define("CNS", columns, {
  tableName: "cns",
  timestamps: false,
});

const HSE = sequelize.define("HSE", columns, {
  tableName: "hse",
  timestamps: false,
});

const CNPB = sequelize.define("CNPB", columns, {
  tableName: "cnpb",
  timestamps: false,
});

const CNSB = sequelize.define("CNSB", columns, {
  tableName: "cnsb",
  timestamps: false,
});

module.exports = {CSP, CSS, CNP, CNS, HSE, CNPB, CNSB};
