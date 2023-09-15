const Sequelize = require("sequelize");

const { v4: uuidv4 } = require("uuid");
uuidv4();

const sequelize = require("../utils/database");

const forgotPasswordRequest = sequelize.define("forgotpasswordrequest", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    isActive: Sequelize.BOOLEAN,
})

module.exports = forgotPasswordRequest;