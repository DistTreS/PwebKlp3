import Sequelize from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Users = db.define('Users', {
    username: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM('admin', 'mahasiswa', 'dosen')
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});


export default Users;