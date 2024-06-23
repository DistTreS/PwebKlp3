'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswords = await Promise.all([
      bcrypt.hash('admin', 10),
      bcrypt.hash('fadli', 10),
      bcrypt.hash('ziggy', 10),
      bcrypt.hash('vina', 10),
      bcrypt.hash('dosen', 10)
    ]);

    return queryInterface.bulkInsert('Users', [
      {
        id: 2,
        username: 'Admin',
        email: 'admin01@gmail.com',
        password: hashedPasswords[0],
        role: 'admin',
        createdAt: new Date('2024-06-20 17:54:39'),
        updatedAt: new Date('2024-06-20 17:54:39'),
        profilePicture: null
      },
      {
        id: 3,
        username: 'Fadli',
        email: 'rajoparmatoalam@gmail.com',
        password: hashedPasswords[1],
        role: 'mahasiswa',
        createdAt: new Date('2024-06-20 17:57:04'),
        updatedAt: new Date('2024-06-20 18:00:12'),
        profilePicture: '/uploads/3_1718906412907.jpg'
      },
      {
        id: 4,
        username: 'Ziggy',
        email: 'ZiggyYafiHisyam@gmail.com',
        password: hashedPasswords[2],
        role: 'mahasiswa',
        createdAt: new Date('2024-06-20 17:57:29'),
        updatedAt: new Date('2024-06-20 18:02:43'),
        profilePicture: '/uploads/4_1718906563419.jpg'
      },
      {
        id: 5,
        username: 'Vina',
        email: 'vina@gmail.com',
        password: hashedPasswords[3],
        role: 'mahasiswa',
        createdAt: new Date('2024-06-20 17:57:44'),
        updatedAt: new Date('2024-06-22 16:45:46'),
        profilePicture: '/uploads/5_1719074746572.jpg'
      },
      {
        id: 6,
        username: 'Dosen',
        email: 'dosen01@gmail.com',
        password: hashedPasswords[4],
        role: 'dosen',
        createdAt: new Date('2024-06-20 17:58:20'),
        updatedAt: new Date('2024-06-22 16:44:10'),
        profilePicture: '/uploads/6_1719074650282.jpeg'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};