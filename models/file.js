const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const File = sequelize.define("downloadfile", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileUrl: Sequelize.STRING
});

module.exports = File;
