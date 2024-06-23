'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('LogbookEntries', [
      {
        entry_id: 1,
        project_id: 1,
        date: new Date('2024-05-01'),
        activity: 'Pengenalan lingkungan kerja',
        description: 'Diajak berkeliling dari pagi sampai jam istirahat siang kemudian disuruh mengamati sendiri sampai sore',
        created_at: new Date('2024-06-20 18:29:39')
      },
      {
        entry_id: 2,
        project_id: 1,
        date: new Date('2024-05-02'),
        activity: 'Memulai pekerjaan sebagai staff administrasi perusahaan',
        description: 'hari ini saya ditempatkan di staff administrasi dan melakukan beberapa pekerjaan adiministrasi seperti \n-blablabla\n-blabla\n-blablabla',
        created_at: new Date('2024-06-21 14:43:01')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('LogbookEntries', null, {});
  }
};