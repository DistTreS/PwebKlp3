import Sequelize from "sequelize";
import db from "../config/database.js";
import Projects from './KpModel.js';  
const { DataTypes } = Sequelize;

const LogbookEntries = db.define('logbookentries', {
    entry_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'projects',
            key: 'project_id'  
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    activity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

export default LogbookEntries;
