'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Projects', [
      {
        project_id: 1,
        title: 'KP Semen Padang 01',
        description: 'Ini adalah batch pertama untuk KP di PT Semen Padang',
        start_date: new Date('2024-05-01'),
        end_date: new Date('2024-06-10'),
        student_id: 3,
        supervisor_id: 6,
        created_at: new Date('2024-06-20 17:59:20')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Projects', null, {});
  }
};