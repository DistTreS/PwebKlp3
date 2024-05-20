import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import session from "express-session";

// Login function
export const Login = async (req, res) => {
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
    req.session.name = user.name;
    req.session.email = user.email;
    req.session.role = user.role;

    if (user.role === "mahasiswa") {
      return res.redirect("/home");
    } else if (user.role === "admin") {
      return res.redirect("homeadmin");
    } else if (user.role === "dosen") {
      return res.redirect("homedosen");
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Logout function
export const Logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Gagal logout" });
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

// Change password function
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await Users.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password saat ini salah" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });

    res.redirect('/logout');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get user function
export const getUser = (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  res.json({
    userId: req.session.userId,
    name: req.session.name,
    email: req.session.email
  });
};
