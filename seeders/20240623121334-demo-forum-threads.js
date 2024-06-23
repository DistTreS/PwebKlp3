'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ForumThreads', [
      {
        thread_id: 1,
        title: 'Gess ada yang tau cara bikin laporan keuangan tahunan perusahaan ngga ?',
        user_id: 3,
        created_at: new Date('2024-06-20 18:01:12'),
        updated_at: new Date('2024-06-20 18:01:12')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ForumThreads', null, {});
  }
};