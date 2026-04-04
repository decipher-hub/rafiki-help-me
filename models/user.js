import bcrypt from 'bcrypt';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class User extends Model {
  /**
   * @param {string} email
   */
  static async findByEmailWithPassword(email) {
    const normalized = String(email).trim().toLowerCase();
    return User.scope('withPassword').findOne({ where: { email: normalized } });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 128],
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    hooks: {
      beforeValidate: (user) => {
        if (user.email) {
          user.setDataValue('email', String(user.email).trim().toLowerCase());
        }
      },
      beforeCreate: async (user) => {
        if (user.password && !String(user.password).startsWith('$2')) {
          user.password = await bcrypt.hash(String(user.password), 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password && !String(user.password).startsWith('$2')) {
          user.password = await bcrypt.hash(String(user.password), 10);
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: { attributes: { include: ['password'] } },
    },
  }
);

export default User;
