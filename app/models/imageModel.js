import {sequelize} from '../../db.js';
import { DataTypes } from 'sequelize';

const Image = sequelize.define('Image', {
    file_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    upload_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true, 
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'images',
    timestamps: false,
});

export {Image};