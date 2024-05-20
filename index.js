// Import modul yang diperlukan
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from 'path';
import indexRouter from "./routes/index.js";
import userRouter from "./routes/mahasiswaRoute.js";
import adminRouter from "./routes/adminRoute.js";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors"; // Import cors middleware
import { verifySession } from "./middleware/verifysession.js"; // Import middleware verifySession

dotenv.config();
const app = express();

app.use(session({
  secret: 'inirahasia', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 } // secure should be true in production with HTTPS
}));

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

// Gunakan router yang sesuai
app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/admin', adminRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
