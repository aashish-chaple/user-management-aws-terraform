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
      allowNull: false,
      validate: {
        notEmpty: true, 
        isEmail: true  
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (value) {
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue('password', hash);
        }
      }
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures that the field is not empty
        is: {
          args: /^[A-Za-z]{2,50}$/, // Only allows alphabetic characters
          msg: 'First name must be alphabetic and contain between 2 and 50 characters.'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures that the field is not empty
        is: {
          args: /^[A-Za-z]{2,50}$/, // Only allows alphabetic characters
          msg: 'Last name must be alphabetic and contain between 2 and 50 characters.'
        }
      }
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