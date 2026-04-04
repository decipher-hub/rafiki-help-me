import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Donation extends Model {}

Donation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    donor_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true, len: [1, 255] },
    },
    donor_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { isEmail: true, notEmpty: true },
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
    payment_method: {
      type: DataTypes.ENUM('mpesa', 'bank'),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photo_url: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Donation',
    tableName: 'donations',
    underscored: true,
  }
);

export default Donation;
