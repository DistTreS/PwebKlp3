import {Sequelize} from "sequelize";

const db = new Sequelize('tbpweb','root','',{
    host:"localhost",
    dialect:"mysql"
});

export default db;  