import express from "express";
import { Login, Logout } from "../controllers/auth.js";
const router = express.Router();



router.post('/login', Login);



router.get('/login', (req,res) => {
  res.render('login');
});


router.delete('/logout', Logout);

router.get('/logout', (req, res) => {
  res.redirect('/login');
});


export default router;
