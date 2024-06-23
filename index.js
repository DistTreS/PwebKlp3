// Import modul yang diperlukan
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from 'path';
import multer from "multer";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors"; 
import { Op } from 'sequelize';
import verifySession from "./middleware/verifysession.js";
import bcrypt from "bcrypt";
import Users from './models/UserModel.js';
import Projects from './models/KpModel.js';
import LogbookEntries from './models/LogbookEntries.js';
import sequelize from './config/database.js';
import ForumThreads from './models/ForumThreads.js';
import ForumPosts from './models/ForumPosts.js';
import './models/asosiasi.js';
import { Parser } from 'json2csv';
import LogbookComments from "./models/LogbookComments.js";




dotenv.config();
const app = express();

app.use(session({
  secret: 'inirahasia', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 600000 } // secure should be true in production with HTTPS
}));


app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(express.static(path.join(process.cwd(), 'assets')));
app.use('/preline', express.static(path.join(process.cwd(), '/node_modules/preline/dist')));
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Set up storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${req.session.userId}_${Date.now()}${path.extname(file.originalname)}`);
  },
});



// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('profilePicture');


// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}



//Fungsi
app.get('/',async (req, res) => {
  res.render('login');
});


app.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(401).json("Username tidak ditemukan, silahkan daftar terlebih dahulu");
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(401).json("Password salah");
    }

    req.session.userId = user.id;
    req.session.name = user.username;
    req.session.email = user.email;
    req.session.role = user.role;
    req.session.profilePicture = user.profilePicture;

    if (user.role === "mahasiswa") {
      const userId = user.id;
      
      // Hitung jumlah entri logbook
      const logbookCount = await LogbookEntries.count({
        include: [{
          model: Projects,
          as: 'project',  
          where: { student_id: userId }
        }]
      });

      // Hitung jumlah file yang diunggah
      const fileCount = await Projects.count({ where: { student_id: userId } });

      // Hitung jumlah thread forum yang dibuat
      const threadCount = await ForumThreads.count({ where: { user_id: userId } });

      // Hitung jumlah balasan forum yang dibuat
      const postCount = await ForumPosts.count({ where: { user_id: userId } });

      const recentLogbooks = await LogbookEntries.findAll({
        include: [{
          model: Projects,
          as: 'project',
          where: { student_id: userId }
        }],
        limit: 5,
        order: [['date', 'DESC']]
      });

      return res.render("mahasiswa/home", {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || '/public/images/default-profile.jpg',
        logbookCount,
        fileCount,
        threadCount,
        postCount,
        recentLogbooks
      });
    } else if (user.role === "admin") {
      return res.render("admin/homeadmin", { username: user.username, email: user.email });
    } else if (user.role === "dosen") {
      const userId = user.id;

      // Ambil jumlah project yang diawasi oleh dosen
      const projectCount = await Projects.count({
        where: { supervisor_id: userId }
      });

      // Ambil jumlah logbook dari mahasiswa yang diawasi oleh dosen
      const logbookCount = await LogbookEntries.count({
        include: [{
          model: Projects,
          as: 'project',
          where: { supervisor_id: userId }
        }]
      });

      // Ambil jumlah komentar yang diberikan dosen pada logbook
      const commentCount = await LogbookComments.count({
        where: { user_id: userId }
      });

      // Ambil informasi tentang project yang diawasi dan mahasiswa yang mengerjakannya
      const projects = await Projects.findAll({
        where: { supervisor_id: userId },
        include: [{
          model: Users,
          as: 'student',
          attributes: ['username']
        }]
      });

      return res.render("dosen/homedosen", {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || '/public/images/default-profile.jpg',
        projectCount,
        logbookCount,
        commentCount,
        projects: projects.map(project => project.toJSON()) // Pastikan ini dikirimkan
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});



app.get('/home', verifySession('mahasiswa'), async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Ambil data pengguna dari database
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const logbookCount = await LogbookEntries.count({
      include: [{
        model: Projects,
        as: 'project',  
        where: { student_id: userId }
      }]
    });

    // Hitung jumlah file yang diunggah
    const fileCount = await Projects.count({ where: { student_id: userId } });

    // Hitung jumlah thread forum yang dibuat
    const threadCount = await ForumThreads.count({ where: { user_id: userId } });

    // Hitung jumlah balasan forum yang dibuat
    const postCount = await ForumPosts.count({ where: { user_id: userId } });

    const recentLogbooks = await LogbookEntries.findAll({
      include: [{
        model: Projects,
        as: 'project',
        where: { student_id: userId }
      }],
      limit: 5,
      order: [['date', 'DESC']]
    });

    // Render halaman dengan data pengguna dan statistik
    res.render('mahasiswa/home', {
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || '/public/images/default-profile.jpg',
      logbookCount,
      fileCount,
      threadCount,
      postCount,
      recentLogbooks
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: 'Server error' });
  }
});




app.get('/homeadmin', verifySession('admin'), (req, res) => {
  res.render('admin/homeadmin');
});

app.get('/admin/register', (req, res) => {
  res.render('admin/register');
});

app.post("/register", verifySession('admin'), async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await Users.create({
      username,
      password: hashedPassword,
      email,
      role,
    });

    console.log('Password yang disimpan di database:', newUser.password);

    res.redirect("/admin/view-users");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Rute untuk menampilkan form tambah proyek KP
app.get('/admin/tambahkankp', verifySession('admin'), async (req, res) => {
  try {
    const students = await Users.findAll({ where: { role: 'mahasiswa' } });
    const supervisors = await Users.findAll({ where: { role: 'dosen' } });
    
    res.render('admin/tambahkankp', { students, supervisors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});


app.post('/admin/tambahkankp', verifySession('admin'), async (req, res) => {
  const { title, description, startDate, endDate, studentId, supervisorId } = req.body;

  try {
    const project = await Projects.create({
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      student_id: studentId,
      supervisor_id: supervisorId,
    });

    res.redirect('/admin/view-projects'); // Redirect to a page where admin can view all projects
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error adding project' });
  }
});





app.get('/admin/view-users', verifySession('admin'), async (req, res) => {
  try {
    const users = await Users.findAll();
    res.render('admin/view-users', { users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

app.get('/mahasiswa/profile',async (req, res) => {
  const userId = req.session.userId;
  const user = await Users.findByPk(userId);
  
  res.render('mahasiswa/profile',{
  username: user.username,
  email: user.email,
  role: user.role,
  profilePicture: user.profilePicture || '/public/images/default-profile.jpg'
  });
});

app.get('/mahasiswa/forum', verifySession('mahasiswa'), async (req, res) => {
  try {
      const threads = await ForumThreads.findAll({
          include: [{ model: Users, as: 'user', attributes: ['username'] }],
          order: [['created_at', 'DESC']]
      });

      const userId = req.session.userId;
      const user = await Users.findByPk(userId);

      res.render('mahasiswa/forum', { 
        threads, 
        username: user.username, 
        email: user.email, 
        profilePicture: user.profilePicture|| '/public/images/default-profile.jpg'
      });
  } catch (error) {
      console.error("Error fetching threads:", error);
      res.status(500).json({ message: "Error fetching threads" });
  }
});

// Menampilkan thread beserta postnya
app.get('/mahasiswa/thread/:id', verifySession('mahasiswa'), async (req, res) => {
  try {
      const userId = req.session.userId;
      const user = await Users.findByPk(userId);

      const thread = await ForumThreads.findByPk(req.params.id, {
          include: [{ model: Users, as: 'user', attributes: ['username'] }]
      });
      const posts = await ForumPosts.findAll({
          where: { thread_id: req.params.id },
          include: [{ model: Users, as: 'user', attributes: ['username'] }],
          order: [['created_at', 'ASC']]
      });
      res.render('mahasiswa/thread', { 
        thread, 
        posts,
        username: user.username, 
        email: user.email, 
        profilePicture: user.profilePicture|| '/public/images/default-profile.jpg'
       });
  } catch (error) {
      console.error("Error fetching thread or posts:", error);
      res.status(500).json({ message: "Error fetching thread or posts" });
  }
});

// Membuat thread baru
app.post('/mahasiswa/forum/thread', verifySession('mahasiswa'), async (req, res) => {
  try {
      const { title } = req.body;
      await ForumThreads.create({
          title,
          user_id: req.session.userId
      });
      res.redirect('/mahasiswa/forum');
  } catch (error) {
      console.error("Error creating thread:", error);
      res.status(500).json({ message: "Error creating thread" });
  }
});

// Menambahkan post baru dalam thread
app.post('/mahasiswa/thread/:id/post', verifySession('mahasiswa'), async (req, res) => {
  try {
      const { content } = req.body;
      await ForumPosts.create({
          thread_id: req.params.id,
          user_id: req.session.userId,
          content
      });
      res.redirect(`/mahasiswa/thread/${req.params.id}`);
  } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Error creating post" });
  }
});

app.get('/admin/view-projects', verifySession('admin'), async (req, res) => {
  try {
    const projects = await Projects.findAll({
      include: [
        { model: Users, as: 'student' },
        { model: Users, as: 'supervisor' }
      ]
    });
    res.render('admin/view-projects', { projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
});

app.get('/mahasiswa/logbook', verifySession('mahasiswa'), async (req, res) => {
  try {
    const { keyword, sort } = req.query;
    const userId = req.session.userId;

    const whereClause = keyword ? {
      [Op.or]: [
        { activity: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ]
    } : {};

    const orderClause = sort ? [[sort, 'ASC']] : [['date', 'DESC']];

    const projects = await Projects.findAll({
      where: { student_id: userId },
      include: [{ 
        model: LogbookEntries, 
        as: 'logbookEntries', 
        where: whereClause,
        attributes: ['date', 'activity', 'entry_id' ,'description'],
        order: orderClause
      }]
    });

    const user = await Users.findByPk(userId);

    const logbookEntries = projects.flatMap(project => project.logbookEntries);
    
    res.render('mahasiswa/logbook', {
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || '/public/images/default-profile.jpg',
      logbookEntries,
      keyword,
      sort
    });
  } catch (error) {
    console.error("Error fetching logbook entries:", error);
    res.status(500).json({ message: "Error fetching logbook entries" });
  }
});




app.get('/mahasiswa/logbook-entry', verifySession('mahasiswa'), async (req, res) => {
  try {
      const projects = await Projects.findAll({ where: { student_id: req.session.userId } });
      res.render('mahasiswa/logbook-entry', { projects });
  } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Error fetching projects" });
  }
});

app.post('/mahasiswa/logbook-entry', verifySession('mahasiswa'), async (req, res) => {
  try {
      const { project_id, date, activity, description } = req.body;
      await LogbookEntries.create({
          project_id,
          date,
          activity,
          description
      });
      res.redirect('/mahasiswa/logbook');  // Atur sesuai dengan halaman yang diinginkan setelah penyimpanan
  } catch (error) {
      console.error("Error saving logbook entry:", error);
      res.status(500).json({ message: "Error saving logbook entry" });
  }
});

app.get('/mahasiswa/logbook/:entryId', verifySession('mahasiswa'), async (req, res) => {
  try {
    
    const entryId = req.params.entryId;
    const logbook = await LogbookEntries.findOne({
      where: { entry_id: entryId },
      include: [
        {
          model: Projects,
          as: 'project',
          include: [{ model: Users, as: 'student' }, { model: Users, as: 'supervisor' }]
        },
        {
          model: LogbookComments,
          as: 'comments',
          include: [{ model: Users, as: 'commenter' }]
        }
      ]
    });

    if (!logbook) {
      return res.status(404).json({ message: 'Logbook not found' });
    }

    const userId = req.session.userId;
    const user = await Users.findByPk(userId);

    res.render('mahasiswa/logbookDetail', { 
      logbook, 
      username: user.username, 
      email: user.email, 
      profilePicture: user.profilePicture|| '/public/images/default-profile.jpg'
     });
  } catch (error) {
    console.error("Error fetching logbook details:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route untuk mengubah password
app.post('/ubah-password', async (req, res) => {
  try {
    const userId = req.session.userId;
    const { currentPassword, newPassword } = req.body;

    // Temukan user berdasarkan userId
    const user = await Users.findOne({
      where: {
        id: userId,
      },
    });

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Verifikasi kata sandi saat ini
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Kata sandi saat ini salah" });
    }

    // Hash kata sandi baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Perbarui kata sandi di database
    await Users.update({ password: hashedNewPassword }, {
      where: {
        id: userId,
      },
    });

    res.json({ message: "Kata sandi berhasil diubah" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// Rute untuk mengubah email
app.post('/ubah-email', async (req, res) => {
  try {
    const userId = req.session.userId;
    const { newEmail } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Users.update(
      { email: newEmail },
      { where: { id: userId } }
    );

    req.session.email = newEmail; // Update email di session
    res.json({ message: 'Email berhasil diubah' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

app.post('/upload-profile-picture', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log("Error during file upload:", err);
      return res.status(400).json({ message: err });
    }

    if (req.file == undefined) {
      console.log("No file selected");
      return res.status(400).json({ message: 'No file selected' });
    }

    try {
      if (!req.session.userId) {
        console.log("User ID not found in session");
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const user = await Users.findOne({ where: { id: req.session.userId } });

      if (!user) {
        console.log("User not found:", req.session.userId);
        return res.status(404).json({ message: 'User not found' });
      }
      // Update user's profile picture
      user.profilePicture = `/uploads/${req.file.filename}`;
      await user.save(); // Save the updated user object

      res.json({ message: 'Profile picture updated', filePath: user.profilePicture });
    } catch (error) {
      console.log("Server error:", error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});



app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout gagal" });
    }
    res.redirect('/');
  });
});

app.get('/mahasiswa/backup-logbook', async (req, res) => {
  try {
      const userId = req.session.userId;

      if (!userId) {
          return res.status(401).json({ message: 'User not authenticated' });
      }

      const logbookEntries = await LogbookEntries.findAll({
          include: [{
              model: Projects,
              as: 'project', // Pastikan ini sesuai dengan alias dalam asosiasi
              where: { student_id: userId }
          }]
      });

      const logbookData = logbookEntries.map(entry => ({
          date: entry.date,
          activity: entry.activity,
          description: entry.description
      }));

      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(logbookData);

      res.setHeader('Content-Disposition', 'attachment; filename=logbook-backup.csv');
      res.setHeader('Content-Type', 'text/csv');
      res.end(csv);
  } catch (error) {
      console.error("Error fetching logbook entries for backup:", error);
      res.status(500).json({ message: "Error fetching logbook entries for backup" });
  }
});


// Dosen
app.get('/dosen/home', verifySession('dosen'), async (req, res) => {
  try {
      const userId = req.session.userId;

      if (!userId) {
          return res.status(401).json({ message: 'User not authenticated' });
      }

      const user = await Users.findByPk(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Ambil jumlah project yang diawasi oleh dosen
      const projectCount = await Projects.count({
          where: { supervisor_id: userId }
      });

      // Ambil jumlah logbook dari mahasiswa yang diawasi oleh dosen
      const logbookCount = await LogbookEntries.count({
          include: [{
              model: Projects,
              as: 'project',
              where: { supervisor_id: userId }
          }]
      });

      // Ambil jumlah komentar yang diberikan dosen pada logbook
      const commentCount = await LogbookComments.count({
          where: { user_id: userId }
      });

      // Ambil informasi tentang project yang diawasi dan mahasiswa yang mengerjakannya
      const projects = await Projects.findAll({
          where: { supervisor_id: userId },
          include: [{
              model: Users,
              as: 'student',
              attributes: ['username']
          }]
      });

      res.render('dosen/homedosen', {
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture || '/public/images/default-profile.jpg',
          projectCount,
          logbookCount,
          commentCount,
          projects: projects.map(project => project.toJSON())
      });
  } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: 'Server error' });
  }
});


app.get('/dosen/account', verifySession('dosen'), async (req, res) => {
  try {
      const userId = req.session.userId;

      if (!userId) {
          return res.status(401).json({ message: 'User not authenticated' });
      }

      const user = await Users.findByPk(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.render('dosen/account', {
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture || '/public/images/default-profile.jpg'
      });
  } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.get('/dosen/logbooks', verifySession('dosen'), async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const logbookEntries = await LogbookEntries.findAll({
      include: [
        {
          model: Projects,
          as: 'project',
          where: { supervisor_id: userId },
          include: [
            {
              model: Users,
              as: 'student',
              attributes: ['username']
            }
          ]
        }
      ]
    });

    res.render('dosen/logbooks', { logbookEntries });
  } catch (error) {
    console.error("Error fetching logbook entries:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/dosen/logbooks/:entryId', verifySession('dosen'), async (req, res) => {
  try {
    const entryId = req.params.entryId;

    const logbook = await LogbookEntries.findByPk(entryId, {
      include: [
        {
          model: Projects,
          as: 'project',
          include: [
            {
              model: Users,
              as: 'student',
              attributes: ['username']
            }
          ]
        }
      ]
    });

    if (!logbook) {
      return res.status(404).json({ message: 'Logbook not found' });
    }

    const comments = await LogbookComments.findAll({
      where: { entry_id: entryId }
    });

    res.render('dosen/logbookDetail', { logbook, comments });
  } catch (error) {
    console.error("Error fetching logbook details:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/dosen/logbooks/:entryId/comment', verifySession('dosen'), async (req, res) => {
  try {
    const entryId = req.params.entryId;
    const userId = req.session.userId;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const newComment = await LogbookComments.create({
      entry_id: entryId,
      user_id: userId,
      content: comment,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.redirect(`/dosen/logbooks/${entryId}`);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
