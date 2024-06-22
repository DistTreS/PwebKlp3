import Sequelize from "sequelize";
import db from "../config/database.js";
import Users from "./UserModel.js";  // Pastikan import model Users

const { DataTypes } = Sequelize;

const ForumPosts = db.define('forumposts', {
    post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    thread_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false,
    tableName: 'forumposts'
});

ForumPosts.belongsTo(Users, { as: 'user', foreignKey: 'user_id' });

export default ForumPosts;
