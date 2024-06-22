// middleware/verifysession.js
export default function verifySession(role) {
    return (req, res, next) => {
      if (!req.session || !req.session.role) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (req.session.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    };
  }
  