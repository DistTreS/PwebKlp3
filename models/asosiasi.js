import LogbookEntries from './LogbookEntries.js';
import Projects from './KpModel.js';
import Users from './UserModel.js';
import LogbookComments from './LogbookComments.js';

Projects.hasMany(LogbookEntries, {
    foreignKey: 'project_id',
    as: 'logbookEntries'
});

Projects.belongsTo(Users, { 
    as: 'student', 
    foreignKey: 'student_id' 
});

Projects.belongsTo(Users, { 
    as: 'supervisor', 
    foreignKey: 'supervisor_id' 
});

LogbookEntries.belongsTo(Projects, {
    foreignKey: 'project_id',
    as: 'project'
});


LogbookComments.belongsTo(LogbookEntries, {
    foreignKey: 'entry_id',
    as: 'logbookEntry'
});

LogbookEntries.hasMany(LogbookComments, {
    foreignKey: 'entry_id',
    as: 'comments'
  });
  
LogbookComments.belongsTo(LogbookEntries, {
    foreignKey: 'entry_id',
    as: 'logbook'
  });
  
LogbookComments.belongsTo(Users, {
    foreignKey: 'user_id',
    as: 'commenter'
  });
  