'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('LogbookComments', [
      {
        comment_id: 1,
        entry_id: 1,
        user_id: 6,
        content: 'Tolong kegiatannya lebih dirincikan lagi jangan digambarkan secara general saja',
        created_at: new Date('2024-06-22 17:43:41'),
        updated_at: new Date('2024-06-22 17:43:41')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('LogbookComments', null, {});
  }
};