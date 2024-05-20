import Sequelize from "sequelize";
import db from "../config/database.js";
import bcrypt from "bcrypt";

const { DataTypes } = Sequelize;

const Users = db.define('Users', {
    name: {
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
    }
}, {
    freezeTableName: true
});

// Before saving a user, hash the password
Users.beforeCreate(async (user, options) => {
    user.password = await bcrypt.hash(user.password, 10);
});

export default Users;