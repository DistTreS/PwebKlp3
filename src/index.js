const express = require('express');
const session = require('express-session');
const path = require("path");
const bcrypt = require("bcrypt");
const connectToDatabase = require("./config");
const User = require("./models/user");
const port = 3000;

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
    secret: 'thisissecret', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
    cookie: { maxAge: 60000 } 


}));

app.get('/', (req, res) => {
    res.render('landingpage');
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    if (req.session.role !== 'Administrator') {
        return res.status(403).send('Access Denied');
    }
    res.render("register");
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userCollection = await connectToDatabase();
        const user = await userCollection.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id.toString(); 
            req.session.role = user.role;
            switch(user.role) {
                case 'Administrator':
                    res.redirect('/homeadmin');
                    break;
                case 'Dosen':
                    res.redirect('/homedosen');
                    break;
                case 'Mahasiswa':
                    res.redirect('/home');
                    break;
                default:
                    res.redirect('/');
            }
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        res.status(500).send('Error connecting to the database');
    }
});


app.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body;
    try {
        const userCollection = await connectToDatabase();
        const existingUser = await userCollection.findOne({ username });
        if (existingUser) {
            return res.render('register', { error: 'Username already exists' }); // Kirim pesan error ke view
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await userCollection.insertOne({ username, password: hashedPassword, email, role });
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Error connecting to the database');
    }
});



app.get('/homeadmin', (req, res) => {
    if (req.session.role !== 'Administrator') {
        return res.status(403).send('Access Denied');
    }
    res.render('homeadmin');
});

app.get('/homedosen', (req, res) => {
    if (req.session.role !== 'Dosen') {
        return res.status(403).send('Access Denied');
    }
    res.render('homedosen');
});

app.get('/home', (req, res) => {
    if (req.session.role !== 'Mahasiswa') {
        return res.status(403).send('Access Denied');
    }
    res.render('home');
});

const { MongoClient, ObjectId } = require('mongodb'); 

// Rute untuk mengambil profil pengguna
app.get('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const userCollection = await connectToDatabase();
        // Konversi userId dari sesi ke ObjectId
        const user = await userCollection.findOne({ _id: new ObjectId(req.session.userId) });
        if (user) {
            res.render('profile', { user });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Error connecting to the database');
    }
});


app.get("/changepassword", (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render("changepassword");
});


app.post("/changepassword", async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    if (newPassword !== confirmPassword) {
        return res.send('New passwords do not match');
    }

    try {
        const userCollection = await connectToDatabase();
        const user = await userCollection.findOne({ _id: new ObjectId(req.session.userId) });
        if (user && await bcrypt.compare(oldPassword, user.password)) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await userCollection.updateOne(
                { _id: new ObjectId(req.session.userId) },
                { $set: { password: hashedPassword } }
            );
            res.send('Password changed successfully');
        } else {
            res.send('Old password is incorrect');
        }
    } catch (error) {
        res.status(500).send('Error connecting to the database');
    }
});

app.get('/view-users', async (req, res) => {
    if (!req.session.userId || req.session.role !== 'Administrator') {
        return res.redirect('/login');
    }
    try {
        const userCollection = await connectToDatabase();
        const users = await userCollection.find({}).toArray();
        res.render('view-users', { users });
    } catch (error) {
        res.status(500).send('Error connecting to the database');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/login');
    });
});





app.listen(port, () => {
    console.log(`Server is running on Port : ${port}`);
});
