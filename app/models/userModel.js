import bcrypt from 'bcrypt';
import {sequelize} from '../../db.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        // Hash the password before saving it
        if (value) {
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue('password', hash);
        }
      }
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    account_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeUpdate: (user) => {
        user.account_updated = new Date();  // Update timestamp before saving
      },
    }
  });

export {User}