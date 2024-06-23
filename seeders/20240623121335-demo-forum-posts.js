'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ForumPosts', [
      {
        post_id: 1,
        thread_id: 1,
        user_id: 4,
        content: 'aku sih ndak tau, tapi cuma mau bilang semangat deh klo dapat kerjaan itu:)',
        created_at: new Date('2024-06-20 18:03:45'),
        updated_at: new Date('2024-06-20 18:03:45')
      },
      {
        post_id: 2,
        thread_id: 1,
        user_id: 4,
        content: 'wkwkwk',
        created_at: new Date('2024-06-20 18:03:51'),
        updated_at: new Date('2024-06-20 18:03:51')
      },
      // Add the remaining posts here...
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ForumPosts', null, {});
  }
};