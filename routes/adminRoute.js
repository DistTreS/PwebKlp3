import express from "express";
import { verifySession } from "../middleware/verifysession.js";
import { getUser } from "../controllers/auth.js";

const router = express.Router();

// Redirect to admin dashboard
router.get('/', (req, res) => {
  res.redirect('homeadmin');
});

// Render registration form
router.get("/register", verifySession('admin'), (req, res) => {
  res.render("register");
});

// Handle registration form submission
router.post("/register", verifySession('admin'), async (req, res) => {
  try {
    await registerUser(req, res);
    res.redirect("view-users");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Render admin home page
router.get("/homeadmin", verifySession('admin'), async (req, res) => {
  const user = getUser(req, res);
  res.render("homeadmin", { user });
});

// View all users
router.get("/viewusers", verifySession('admin'), async (req, res) => {
  try {
    const users = await viewUsers(req, res);
    res.render("view-users", { users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

export default router;
