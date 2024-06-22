import LogbookEntries from './LogbookEntries.js';
import Projects from './KpModel.js';
import Users from './UserModel.js';

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
