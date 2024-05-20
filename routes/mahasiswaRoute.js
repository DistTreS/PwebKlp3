import express from "express";
import { getUser, changePassword } from "../controllers/auth.js";
import { verifySession } from "../middleware/verifysession.js";

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/home'); 
});

router.get("/home", verifySession('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render("home", { user });
});

router.get("/profile", verifySession('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render("profile", { user });
});

router.get('/profile/change-password', verifySession('mahasiswa'), async function (req, res) {
  const user = await getUser(req, res); 
  res.render('changepassword', { user });
});

router.post('/change-password', verifySession('mahasiswa'), async (req, res) => {
  await changePassword(req, res);
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error during logout");
    }
    res.redirect('/login');
  });
});

router.get('/profile/change-profile', verifySession('mahasiswa'), async (req, res) => {
  const user = await getUser(req, res); 
  res.render('change-profile', { user });
});

router.post('/change-profile', verifySession('mahasiswa'), async (req, res) => {
  await editProfile(req, res);
});

export default router;
