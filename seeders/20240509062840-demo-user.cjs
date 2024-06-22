const bcrypt = require('bcrypt');
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username : 'Fadli',
        email: 'fadlihidayat7259@gmail.com',
        password: await bcrypt.hash('fadli1', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username : 'Ziggy',
        email: 'ziggyyafihisyam@gmail.com',
        password: await bcrypt.hash('ziggy1', 10),
        role: 'mahasiswa',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username : 'Vina',
        email: 'chalvinaa@gmail.com',
        password: await bcrypt.hash('vina1', 10),
        role: 'dosen',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
