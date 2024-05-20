function verifySession(role) {
  return function (req, res, next) {
    if (!req.session || !req.session.userId) {
      console.log("No session found, redirecting to login");
      return res.redirect('/login');
    }

    const userId = req.session.userId;
    const userRole = req.session.role;

    req.userId = userId;
    req.userRole = userRole;

    if (role && req.userRole !== role) {
      if (req.userRole === "mahasiswa") {
        return res.redirect("/home");
      } else if (req.userRole === "admin") {
        return res.redirect("/homeadmin");
      } else if (req.userRole === "dosen") {
        return res.redirect("/homedosen");
      } else {
        return res.status(403).json({ message: "Akses ditolak" });
      }
    }

    next();
  };
}

export { verifySession };
