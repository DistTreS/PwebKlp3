import Sequelize from "sequelize";
import db from "../config/database.js";
import Users from "./UserModel.js";  

const { DataTypes } = Sequelize;

const ForumThreads = db.define('forumthreads', {
    thread_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false,
    tableName: 'forumthreads'
});

ForumThreads.belongsTo(Users, { as: 'user', foreignKey: 'user_id' });

export default ForumThreads;
