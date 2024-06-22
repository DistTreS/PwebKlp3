import Sequelize from "sequelize";
import db from "../config/database.js";
import Users from './UserModel.js';
import LogbookEntries from './LogbookEntries.js';

const { DataTypes } = Sequelize;

const Projects = db.define('projects', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Name of the users table
      key: 'id'
    }
  },
  supervisor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Name of the users table
      key: 'id'
    }
  }
}, {
  tableName: 'projects',
  timestamps: false,
  createdAt: 'created_at'
});

export default Projects;

