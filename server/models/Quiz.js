const { DataTypes } = require("sequelize");
const sequelize = require("../common/db");

const Quiz = sequelize.define(
  "quiz",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { paranoid: true }
);

module.exports = Quiz;
