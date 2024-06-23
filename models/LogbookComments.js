import Sequelize from 'sequelize';
import db from '../config/database.js';
import LogbookEntries from './LogbookEntries.js';

const { DataTypes } = Sequelize;

const LogbookComments = db.define('logbookcomments', {
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    entry_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'logbookentries',
            key: 'entry_id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
});

export default LogbookComments;
